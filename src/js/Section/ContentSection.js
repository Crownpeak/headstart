import { App } from "../App";
import Prism from "prismjs";

/**
 * This class is designed to showcase making requests to the CaaS.
 * It utilizes the CaaS API to retrieve content and provides a method to display the obtained data.
 */
export class ContentSection {
  /**
   * Creates an instance of ContentSection.
   */
  constructor() {
    this.render();
  }

  /**
   * Fetches data from the CaaS API endpoint and displays the content.
   */
  render() {
    const codeElement = document.querySelector("#caas-content-js");
    const apikey = App.config?.caasPreviewApikey
      ? App.config.caasPreviewApikey
      : "APIKEY";

    if (App.caasConnection && App.navigationService) {
      const responseElement = document.querySelector("#caas-content-response");
      App.navigationService
        //TODO: Language (planned for a future version)
        .fetchStartpage("en_GB")
        .then((startpageInfo) => {
          const jsSnippet = this.getJSSnippet(
            startpageInfo.contentReference,
            apikey,
            startpageInfo.id
          );
          codeElement.innerHTML = Prism.highlight(
            jsSnippet,
            Prism.languages.javascript,
            "javascript"
          );
          return App.caasConnection.fetchByUrl(startpageInfo.contentReference);
        })
        .then((responseJson) => {
          const jsonSnippet = JSON.stringify(responseJson, null, 4);
          responseElement.innerHTML = Prism.highlight(
            jsonSnippet,
            Prism.languages.javascript,
            "javascript"
          );
        });
    } else {
      codeElement.innerHTML = this.getJSSnippet("DOCUMENT_URL", apikey);
    }
  }

  /**
   * A Javascript snippet that is displayed as an example of a request.
   */
  getJSSnippet(documentUrl, apikey) {
    return `
      const requestUrl = new URL("${documentUrl}");
      const headers = new Headers();
      headers.append("Authorization", "Bearer ${apikey}");
      headers.append("Content-Type", "application/json");
      const request = new Request(requestUrl.href, {
        method: "GET",
        headers: headers,
      });
      fetch(request)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return response.json().then((errData) => {
            console.log(errData);
          });
        }
      })
      .then((responseJson) => {
        console.log("Response: ", responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
    `;
  }
}
