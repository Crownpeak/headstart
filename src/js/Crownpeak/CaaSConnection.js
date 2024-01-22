/**
 * Holds a CaaS connection.
 */
export class CaaSConnection {
  constructor(caasEndpoint, apikey) {
    this.caasEndpoint = caasEndpoint;
    this.apikey = apikey;
  }

  /**
   * Checks the caaS connection
   *
   * For the test, the metadata of the collection is requested.
   *
   * @returns {Boolean} true if a connection could be established, false otherwise.
   */
  testConnection() {
    const requestUrl = new URL(this.caasEndpoint + "/_meta");
    const request = new Request(requestUrl.href, {
      method: "GET",
      headers: this.getDefaultHeaders(),
    });
    return fetch(request)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return true;
        } else {
          return response.json().then((errData) => {
            console.log("Error requesting caas collection", errData);
            return false;
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  /**
   * Requests the document with the given id
   *
   * @param {String} id the document to fetch
   */
  fetchById(id) {
    const requestUrl = new URL(id, this.caasEndpoint + "/");
    const request = new Request(requestUrl.href, {
      method: "GET",
      headers: this.getDefaultHeaders(),
    });
    return this.fetchCaaS(request);
  }

  /**
   * Requests the document with the given url
   *
   * @param {String} url the document to fetch
   */
  fetchByUrl(url) {
    const requestUrl = new URL(url);
    const request = new Request(requestUrl.href, {
      method: "GET",
      headers: this.getDefaultHeaders(),
    });
    return this.fetchCaaS(request);
  }

  /**
   * Requests the caas
   *
   * @param {Request} request to do
   * @returns caas document json
   */
  async fetchCaaS(request) {
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

  getDefaultHeaders() {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${this.apikey}`);
    headers.append("Content-Type", "application/json");
    return headers;
  }
}
