import * as TPP_SNAP from "fs-tpp-api/snap";
import { HeadlessConfiguration } from "./Crownpeak/HeadlessConfiguration";
import { App } from "./App";

class Initializer {
  constructor() {
    /**
     * Try a TPP handshake
     */
    TPP_SNAP.isConnected.then((connected) => {
      App.create(null, connected);               
      if (connected) {
        console.log("TPP_SNAP is connected");
        TPP_SNAP.onInit(this.sNAPInitHandler);
      }
    });
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
          App.setConfig(config);
        })
        .catch((error) => {
          console.log("Error requesting TPP_SNAP config script", error);          
        });
    } catch(error){
      console.log("error", error);
    }
  };
}

new Initializer();
