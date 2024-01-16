export class NavigationServiceConnection {
  constructor(navigationEndpoint) {
    this.navigationEndpoint = navigationEndpoint;
  }

  /**
   * Checks the navigation service connection
   */
  testConnection() {    
    const requestUrl = new URL(this.navigationEndpoint);
    // TODO: Language (planned for a future version)
    requestUrl.searchParams.append("language", "en_GB");
    const request = new Request(requestUrl.href, {
      method: "HEAD",
    });
    return fetch(request)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return true;
        } else {
          console.log("Error testing navigation endpoint. Status: ", response);
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  /**
   * Requests languages
   *
   * @return {Array} of locations
   */
  fetchLanguages() {
    const requestUrl = new URL(this.navigationEndpoint);
    const pathParts = requestUrl.pathname.split('/').filter(part => part);
    if (pathParts.length > 1) {
      requestUrl.pathname = "/" + pathParts[0];
      // Set language to null to overwrite the language of the header
      requestUrl.searchParams.append("language", null);
      requestUrl.searchParams.append("from", pathParts[1]);
      requestUrl.searchParams.append("until", pathParts[1]);      
      const request = new Request(requestUrl.href, {
        method: "GET",
      });      
      return this.fetchNavigationService(request)
                  .then((result) => {
                    return result?._embedded?.map((item) => {return item.languageId});                    
                  });
    }
    return null;    
  }


  /**
   * Requests the navigation with depth one, which normally should return only the start page.
   *
   * @param {String} language to get
   */
  fetchStartpage(language) {
    const requestUrl = new URL(this.navigationEndpoint);
    requestUrl.searchParams.append("language", language);
    requestUrl.searchParams.append("depth", "1");
    requestUrl.searchParams.append("format", "default");
    const request = new Request(requestUrl.href, {
      method: "GET",
    });
    return this.fetchNavigationService(request);
  }

  /**
   * Requests all routes for a language.
   *
   * @param {String} language to get
   */
  fetchRoutes(language) {
    const requestUrl = new URL(this.navigationEndpoint);
    requestUrl.searchParams.append("language", language);
    requestUrl.searchParams.append("depth", "99");
    requestUrl.searchParams.append("format", "caas");
    const request = new Request(requestUrl.href, {
      method: "GET",
    });
    return this.fetchNavigationService(request);
  }

  /**
   * Requested the entire navigation.
   *
   * @param {String} language to get
   */
  fetchNavigation(language) {
    const requestUrl = new URL(this.navigationEndpoint);
    requestUrl.searchParams.append("language", language);
    requestUrl.searchParams.append("depth", "99");
    requestUrl.searchParams.append("format", "default");
    const request = new Request(requestUrl.href, {
      method: "GET",
    });
    return this.fetchNavigationService(request);
  }

  /**
   * Requests the navigation service
   *
   * @param {Request} request to do
   * @returns caas document json
   */
  async fetchNavigationService(request) {
    return fetch(request)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return response.json().then((errData) => {
            console.log(errData);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
