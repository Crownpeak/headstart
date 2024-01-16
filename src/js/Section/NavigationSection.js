import { App } from "../App";
import Prism from 'prismjs';

export class NavigationSection {
  constructor() {
    this.render();
  }

  render() {
    const codeElement = document.querySelector("#navigation-js");
    const url = App.config ? App.config.navigationPreviewEndpoint : "URL";
    codeElement.innerHTML = Prism.highlight(this.getJSSnippet(url), Prism.languages.javascript, 'javascript');

    const responseElement = document.querySelector("#navigation-response");
    if (App.navigationService) {
      // TODO: Language (planned for a future version)
      App.navigationService.fetchRoutes("en_GB").then((response) => {
        if(response){
          const jsonString = JSON.stringify(response,null,2);
          responseElement.innerHTML = Prism.highlight(jsonString, Prism.languages.javascript, 'javascript');
        }        
      });
    }
  }

  getJSSnippet(navigationEndpoint) {
    return `
      const requestUrl = new URL("${navigationEndpoint}");
      requestUrl.searchParams.append("language", "en_GB");
      requestUrl.searchParams.append("depth", "9");
      requestUrl.searchParams.append("format", "caas");
      const request = new Request(requestUrl.href, {
        method: "GET",
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
