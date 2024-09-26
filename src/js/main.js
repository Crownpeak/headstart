import { HeadlessConfiguration } from "./Crownpeak/HeadlessConfiguration";
import { App } from "./App";

/**
 * Initializes the application
 */
class Initializer {
  /**
   * Creates an instance of Initializer.
   */
  constructor() {
    let originUrl = Initializer.getPreviewOrigin();
    console.log("Origin Url", originUrl);
    if (originUrl) {
      Initializer.loadScript(`${originUrl}/fs5webedit/live/api.jsp`)
        .then(() => {
          console.log("TPP_SNAP loaded", TPP_SNAP);
          TPP_SNAP.isConnected.then((connected) => {            
            if (connected) {
              console.log("TPP_SNAP is connected");
              TPP_SNAP.onInit(this.sNAPInitHandler);
            } else {
              App.create(null, connected);
            }
          });
        })
        .catch((error) => {
          console.log("Error loading SNAP_API");
        });
    } else {
      App.create(null, false);
    }
  }

  /**
   * Is called when the connection to the ContentCreator is established.
   *
   * @param {boolean} success
   */
  sNAPInitHandler = (success) => {
    if (!success) {
      return;
    }
    // A little helper to fetch the caas endpoint, navigation service and apikey.
    // Normally this configuration is provided differently, for example in an .env file.
    // In detail the 'TPP_SNAP.execute' triggers a script inside of the Crownpeak CMS project.
    try {
      TPP_SNAP.execute("script:caas_endpoint_info", {}, true)
        .then((result) => {         
          const config = HeadlessConfiguration.create(result);
          App.create(config, true);          
        })
        .catch((error) => {
          console.log("Error requesting TPP_SNAP config script", error);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  static getPreviewOrigin() {
    if (window.location.ancestorOrigins) {
      var origins = window.location.ancestorOrigins;
      for (var i = 0; i < origins.length; i++) {
        // TODO: configure this in .env
        if (origins[i].endsWith(".e-spirit.hosting")) {
          return origins[i];
        }
      }
    } else {
      console.log("ancestorOrigins not supported.");
    }
    return null;
  }

  static loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Script load error for ${url}`));
      document.head.appendChild(script);
    });
  }
}

new Initializer();
