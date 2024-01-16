import { HeadlessConfiguration } from "./Crownpeak/HeadlessConfiguration";
import { CaaSConnection } from "./Crownpeak/CaaSConnection";
import { NavigationServiceConnection } from "./Crownpeak/NavigationServiceConnection";
import { Route, Router } from "./Router";
import { InfoPage } from "./Page/InfoPage";
import { Standard } from "./Page/Standard";
import { Navigation } from "./Component/Navigation";

import * as TPP_SNAP from "fs-tpp-api/snap";

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
    this.isContentCreator = isContentCreator;
    // init the internal navigation
    this.initInternalNavigation();
    // init ContentCreator SNAP
    if (this.isContentCreator) {
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

  static setConfig(config) {
    this.storeConfigToSessionStorage(config);
    this.config = config;
    this.connect().then(() => {
      this.reRender();
    });
  }

  static storeConfigToSessionStorage(config) {
    localStorage.setItem("config", JSON.stringify(config));
  }

  static loadConfigFromSessionStorage() {
    const configString = localStorage.getItem("config");
    return configString ? JSON.parse(configString) : null;
  }

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

  static initSNAPTPP() {
    TPP_SNAP.onRequestPreviewElement(async (previewId) => {
      // Check if the given previewId is known by the router.
      console.log("onRequestPreviewElement", previewId);
      if (this.router) {
        this.navigateToPreviewId(previewId);
      }
    });
    TPP_SNAP.onRerenderView(async () => {
      // Rebuild the current page
      const currentPreviewPageId = this.page.data._id;
      console.log("onRerenderView", currentPreviewPageId);
      this.caasConnection.fetchById(currentPreviewPageId).then((data) => {
        this.page.reRender(data);
      });
    });
  }

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

  static render() {
    this.getPage().then((page) => {
      this.page = page;
      this.page.render();
      if (this.navigation) {
        this.navigation.render();
      }
    });
  }

  static getPage() {
    return new Promise((resolve, reject) => {
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

  static reRender() {
    this.page.reRender();
    if (this.navigation) {
      this.navigation.render();
    }
  }
}
