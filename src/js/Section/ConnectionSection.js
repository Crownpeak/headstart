import { App } from "../App";
import { Modal } from "../Component/Modal";
import { HeadlessConfiguration } from "../Crownpeak/HeadlessConfiguration";
import { DOMHelper } from "../Utility/DOMHelper";

/**
 * Section for displaying and changing the connection parameters for the CaaS and navigation endpoint.
 */
export class ConnectionSection {
  /**
   * Creates an instance of ConnectionSection.
   */
  constructor() {
    this.connectionStatusElement = document.querySelector("#connection-status");
    this.caasEndpointInput = document.querySelector(
      "#connection-parameters [name=caas-endpoint]"
    );
    this.caasApikeyInput = document.querySelector(
      "#connection-parameters [name=caas-apikey]"
    );
    this.caasNavEndpointInput = document.querySelector(
      "#connection-parameters [name=navigation-service-endpoint]"
    );
    this.render();
    this.connectSaveButton();
    this.connectReleaseParametersButton();
  }

  /**
   * Passes the currently set connection parameters to the app.
   *
   * @param {*} event of the user action
   */
  updateConfig(event) {
    event.preventDefault();
    if (
      this.caasEndpointInput.value &&
      this.caasApikeyInput.value &&
      this.caasNavEndpointInput.value
    ) {
      const newConfig = new HeadlessConfiguration(
        this.caasEndpointInput.value,
        this.caasApikeyInput.value,
        this.caasNavEndpointInput.value
      );
      App.setConfig(newConfig);
    }
  }

  /**
   * Connects a action to the save button.
   */
  connectSaveButton() {
    const saveConBtn = document.querySelector(
      "#connection-parameters [name=save-connect]"
    );
    saveConBtn.addEventListener("click", this.updateConfig.bind(this));
  }

  /**
   * Connects a action to the button to show the release connection parameters.
   */
  connectReleaseParametersButton() {
    const connectRelParBtn = document.querySelector(
      "#connection-parameters-release"
    );
    connectRelParBtn.addEventListener("click", () => {
      const modal = Modal.instance();
      const content = DOMHelper.htmlToElement(
        this.getReleaseParameterContent(
          App.config.caasReleaseEndpoint,
          App.config.caasReleaseApikey,
          App.config.navigationReleaseEndpoint
        )
      );
      modal.show(content);
    });
  }

  /**
   * Displays the current status of the connection and the parameters.
   */
  render() {
    if (App.config) {
      this.caasEndpointInput.value = App.config.caasPreviewEndpoint
        ? App.config.caasPreviewEndpoint
        : "CaaS Endpoint";
      this.caasApikeyInput.value = App.config.caasPreviewApikey
        ? App.config.caasPreviewApikey
        : "API Key";
      this.caasNavEndpointInput.value = App.config.navigationPreviewEndpoint
        ? App.config.navigationPreviewEndpoint
        : "Navigation Service Endpoint";
    }

    const statusDiv = this.connectionStatusElement.closest("div");
    if (App.caasConnection && App.navigationService) {
      this.connectionStatusElement.innerHTML = "Connection established";
      DOMHelper.setCSSClass(this.caasEndpointInput, [], ["border-red-500"]);
      DOMHelper.setCSSClass(this.caasApikeyInput, [], ["border-red-500"]);
      DOMHelper.setCSSClass(this.caasNavEndpointInput, [], ["border-red-500"]);
      DOMHelper.setCSSClass(
        statusDiv,
        ["bg-green-600"],
        ["bg-red-600", "bg-gray-400"]
      );
    } else if (App.caasConnection) {
      this.connectionStatusElement.innerHTML =
        "CaaS connection established, navigation service not available";
      DOMHelper.setCSSClass(this.caasNavEndpointInput, ["border-red-500"], []);
      DOMHelper.setCSSClass(this.caasEndpointInput, [], ["border-red-500"]);
      DOMHelper.setCSSClass(this.caasApikeyInput, [], ["border-red-500"]);
      DOMHelper.setCSSClass(
        statusDiv,
        ["bg-red-600"],
        ["bg-green-600", "bg-gray-400"]
      );
    } else if (App.navigationService) {
      this.connectionStatusElement.innerHTML =
        "Navigation service available, CaaS connection not established";
      DOMHelper.setCSSClass(this.caasEndpointInput, ["border-red-500"], []);
      DOMHelper.setCSSClass(this.caasApikeyInput, ["border-red-500"], []);
      DOMHelper.setCSSClass(this.caasNavEndpointInput, [], ["border-red-500"]);
      DOMHelper.setCSSClass(
        statusDiv,
        ["bg-red-600"],
        ["bg-green-600", "bg-gray-400"]
      );
    } else if (App.config) {
      this.connectionStatusElement.innerHTML = "Connection not established";
      DOMHelper.setCSSClass(
        statusDiv,
        ["bg-red-600"],
        ["bg-green-600", "bg-gray-400"]
      );
      DOMHelper.setCSSClass(this.caasEndpointInput, ["border-red-500"], []);
      DOMHelper.setCSSClass(this.caasApikeyInput, ["border-red-500"], []);
      DOMHelper.setCSSClass(this.caasNavEndpointInput, ["border-red-500"], []);
    } else {
      this.connectionStatusElement.innerHTML = "Connection not yet established";
      DOMHelper.setCSSClass(
        statusDiv,
        ["bg-gray-400"],
        ["bg-red-600", "bg-green-600"]
      );
    }
  }

  /**
   * Creates a html snippet to show the release parameters.
   *
   * @param {String} endpoint of the caas
   * @param {String} apikey of the caas
   * @param {String} navigationEndpoint of the navigation service
   * @returns {String} html
   */
  getReleaseParameterContent(endpoint, apikey, navigationEndpoint) {
    return `<div>
              <div class="w-full px-3 mb-6">
                <label class="block mb-2 text-sm text-gray-800 uppercase tracking-wide font-bold">CaaS Endpoint
                  URL</label>
                <input disabled
                  class="appearance-none block w-full py-3 px-4 mb-2 md:mb-0 leading-tight text-black bg-gray-200 focus:bg-white border rounded focus:outline-none"
                  type="text" name="caas-endpoint" value="${endpoint}">
              </div>
              <div class="w-full px-3 mb-6">
                <label class="block mb-2 text-sm text-gray-800 uppercase tracking-wide font-bold">APIKEY</label>
                <input disabled
                  class="appearance-none block w-full py-3 px-4 mb-2 md:mb-0 leading-tight text-black bg-gray-200 focus:bg-white border rounded focus:outline-none"
                  type="text" name="caas-apikey" value="${apikey}">
              </div>
              <div class="w-full px-3 mb-6">
                <label class="block mb-2 text-sm text-gray-800 uppercase tracking-wide font-bold">Navigation
                  Service
                  URL</label>
                <input disabled
                  class="appearance-none block w-full py-3 px-4 mb-2 md:mb-0 leading-tight text-black bg-gray-200 focus:bg-white border rounded focus:outline-none"
                  type="text" name="navigation-service-endpoint" value="${navigationEndpoint}">
              </div>
            </div>`;
  }
}
