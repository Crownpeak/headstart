import { HeadlessConfiguration } from "./Crownpeak/HeadlessConfiguration";
import { CaaSConnection } from "./Crownpeak/CaaSConnection";
import { NavigationServiceConnection } from "./Crownpeak/NavigationServiceConnection";
import { Route, Router } from "./Router";
import { InfoPage } from "./Page/InfoPage";
import { Standard } from "./Page/Standard";
import { Navigation } from "./Component/Navigation";

/**
 * The HeadStart application
 */
export class App {
  static config;
  static isContentCreator;
  static caasConnection;
  static navigationService;
  static navigation;
  static router;
  static currentRoute;
  static page;

  /**
   * This method should only be called ones
   *
   * @param {HeadlessConfiguration} config
   */
  static create(config, isContentCreator = false) {
    console.log("Create new app");
    this.isContentCreator = isContentCreator;
    // init the internal navigation
    this.initInternalNavigation();
    // init ContentCreator SNAP
    if (this.isContentCreator && TPP_SNAP) {
      this.initSNAPTPP();
    }
    // Connect
    const storedConfig = this.loadConfigFromSessionStorage();
    if (config || storedConfig) {
      this.config = storedConfig ? storedConfig : config;
      this.connect().then(() => {
        this.navigateTo(location.pathname);
      });
    } else {
      this.navigateTo("/");
    }
  }

  /**
   * This method saves a passed configuration, attempts to establish a new connection
   * using the specified configuration and triggers a new display of the application
   * if the connection is successful.
   *
   * @param {HeadlessConfiguration} config
   */
  static setConfig(config) {
    this.storeConfigToSessionStorage(config);
    this.config = config;
    this.connect().then(() => {
      this.render();
    });
  }

  /**
   * Saves a configuration in the browser's session storage.
   *
   * @param {HeadlessConfiguration} config
   */
  static storeConfigToSessionStorage(config) {
    localStorage.setItem("config", JSON.stringify(config));
  }

  /**
   * Loads a configuration from the browser's session storage.
   *
   * @returns {JSON}
   */
  static loadConfigFromSessionStorage() {
    const configString = localStorage.getItem("config");
    return configString ? JSON.parse(configString) : null;
  }

  /**
   * This method is responsible for initializing
   * custom handling of browser navigation buttons such
   * as 'Back' and 'Forward,' as well as internal
   * links within the application.
   *
   * @returns {JSON}
   */
  static initInternalNavigation() {
    // Browser back and forward
    window.addEventListener("popstate", (event) => {
      const state = event.state;
      if (!state) {
        return;
      }
      console.log(`State = ${JSON.stringify(event.state)}`);
      if (state.hasOwnProperty("previewId") && state.previewId) {
        this.navigateToPreviewId(state.previewId, false);
      } else if (state.hasOwnProperty("path")) {
        this.navigateTo(state.path, false);
      }
    });
    // EventListener for internal navigation
    document.body.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        this.navigateTo(e.target.pathname);
      }
    });
  }

  /**
   * When we are in the preview of the CMS ContentCreator,
   * CallBack functions must be defined for various actions.
   */
  static initSNAPTPP() {
    TPP_SNAP.onRequestPreviewElement(async (previewId) => {
      // Check if the given previewId is known by the router.
      console.log("onRequestPreviewElement", previewId);
      if (this.router) {
        this.navigateToPreviewId(previewId);
      }
    });
    TPP_SNAP.onContentChange(async (node, previewId, content) => {
      // Rebuild the current page
      console.log("onContentChange", node, previewId, content);
      this.page.reRender(content);
      // any: if the handler doesn't return anything, onRerenderView~Handler will be triggered.
      return true;
    });

    TPP_SNAP.onRerenderView(async () => {
      // Rebuild the current page
      const currentPreviewPageId = this.page.data._id;
      console.log("onRerenderView", currentPreviewPageId, this.page.data);      
      this.caasConnection.fetchById(currentPreviewPageId).then((data) => {
        this.page.reRender(data);
      });      
    });
  }

  /**
   * When a configuration is provided, this method endeavors
   * to establish connections to both the Content as a Service (CaaS)
   * and the navigation service. Additionally, it initializes
   * the router and navigation.
   */
  static async connect() {
    if (this.config) {
      // Create and test the caas connection
      const caasConnection = new CaaSConnection(
        this.config.caasPreviewEndpoint,
        this.config.caasPreviewApikey
      );
      if (await caasConnection.testConnection()) {
        this.caasConnection = caasConnection;
      } else {
        this.caasConnection = null;
      }
      // Create and test the navigation service connection
      const navigationService = new NavigationServiceConnection(
        this.config.navigationPreviewEndpoint
      );
      if (await navigationService.testConnection()) {
        this.navigationService = navigationService;
        // TODO: Language (planned for a future version)
        const navInfo = await navigationService.fetchRoutes("en_GB");
        this.router = new Router(navInfo);
        this.navigation = new Navigation();
      } else {
        this.navigationService = null;
      }
    }
  }

  /**
   * Internal navigation to url
   *
   * @param {String} url
   * @param {Boolean} addToHistory
   */
  static navigateTo(url, addToHistory = true) {
    if (this.router) {
      this.currentRoute = this.router.getPotentialRoute(url);
    } else {
      this.currentRoute = Route.startpageRoute();
    }
    if (addToHistory) {
      history.pushState(
        this.currentRoute,
        this.currentRoute.label,
        this.currentRoute.path
      );
    }
    this.render();
  }

  /**
   * Internal navigation to a previewid
   *
   * @param {String} previewId
   * @param {Boolean} addToHistory
   */
  static navigateToPreviewId(previewId, addToHistory = true) {
    if (this.router) {
      this.router.getRouteForPreviewId(previewId).then((newRoute) => {
        this.currentRoute = newRoute;
        if (addToHistory) {
          history.pushState(
            this.currentRoute,
            this.currentRoute.label,
            this.currentRoute.path
          );
        }
        this.render();
      });
    } else {
      this.currentRoute = Route.startpageRoute();
      if (addToHistory) {
        history.pushState(
          this.currentRoute,
          this.currentRoute.label,
          this.currentRoute.path
        );
      }
      this.render();
    }
  }

  /**
   * This method attempts to generate the page.
   */
  static render() {
    this.getPage().then((page) => {
      this.page = page;
      this.page.render();
      if (this.navigation) {
        this.navigation.render();
      }
    });
  }

  /**
   * This method tries to fetch a relevant document
   * from the Content as a Service (CaaS) based on the current route.
   * Upon finding a corresponding document, it looks for a
   * suitable page implementation and proceeds to instantiate a new object.
   *
   * @returns a page
   */
  static getPage() {
    return new Promise((resolve, reject) => {
      if (this.currentRoute.path)
        if (this.currentRoute.path === "/") {
          resolve(new InfoPage());
        } else {
          this.caasConnection
            .fetchByUrl(this.currentRoute.contentUrl)
            .then((documentData) => {
              resolve(new Standard(documentData));
            })
            .catch(() => {
              console.log("Error fetching caas");
              resolve(new InfoPage());
            });
        }
    });
  }

  /**
   * Render the current page again.
   */
  static reRender() {
    this.page.reRender();
    if (this.navigation) {
      this.navigation.render();
    }
  }
}
