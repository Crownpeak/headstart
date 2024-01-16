import { App } from "./App";

export class Router {
  constructor(navInfo) {    
    this.navInfo = navInfo;
  }

  getTopLevel() {
    return Object.values(this.navInfo.idMap).filter(
      (item) => !item.parentIds.length
    );
  }

  // Test each route for potential match
  getPotentialRoute(path) {    
    if (path === "/") {
      return Route.startpageRoute();
    }
    const potentialRouteId = this.getMatchingRouteId(path);
    return this.getRouteForId(potentialRouteId);
  }

  getRouteForPreviewId(previewId) {
    return new Promise((resolve, reject) => {
      const previewIdEl = PreviewId.parse(previewId);
      if (!previewIdEl.local){
        throw new Error("Missing local");
      }      
      let foundRoute = this.getRouteForId(previewIdEl.id);
      if (foundRoute.language === previewIdEl.local) {
        resolve(foundRoute);
      } else if (App.navigationService) {
        // A simple delay to ensure that the content is stored in the Caas, a better solution would be to use the Event Stream Api.
        this.delay(500)
          .then(() => {
            return App.navigationService.fetchRoutes(previewIdEl.local);
          })
          .then((routesInfo) => {
            this.navInfo = routesInfo;
            resolve(this.getRouteForId(previewIdEl.id));
          });
      } else {
        reject();
      }
    });
  }

  getRouteForId(potentialRouteId) {    
    if (this.navInfo.idMap.hasOwnProperty(potentialRouteId)) {
      const foundRoute = this.navInfo.idMap[potentialRouteId];
      const local = this.navInfo.meta.identifier.languageId;
      return new Route(foundRoute.seoRoute,
                PreviewId.assembleId(foundRoute.caasDocumentId, local),
                foundRoute.contentReference,
                local);
    }
    return Route.notFoundPage();;
  }

  getMatchingRouteId(path) {
    for (let routePath in this.navInfo.seoRouteMap) {
      if (path.match(this.pathRegex(routePath)))
        return this.navInfo.seoRouteMap[routePath];
    }
  }

  pathRegex(path) {
    return new RegExp(
      "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$"
    );
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}

export class PreviewId{

  constructor(id, local = null){
    this.id = id;
    this.local = local;
  }

  combinedId(){
    return this.assembleId(id, local)
  }

  /**
   * Tries to create a preview ID based on the specified parameter. 
   * Valid are string representations of preview IDs with and without local.
   * E.g.:
   *  b3fb80a9-7c2b-43a3-93c0-0d0922f4dc9b
   *  b3fb80a9-7c2b-43a3-93c0-0d0922f4dc9b.en_GB
   *  
   * @param {String} previewIdString 
   * @returns a {@link PreviewId} based of the given parameters
   */
  static parse(previewIdString){
    let regExpRes = this.previewIdWithLocal(previewIdString);
    if(regExpRes) {      
      return new PreviewId(regExpRes[1], regExpRes[2]);
    }
    regExpRes = this.previewId(previewIdString);
    if(regExpRes) {      
      return new PreviewId();
    }
    return "";
  }
  

  static previewIdWithLocal(id){
    return new RegExp("^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}).([a-z]{2}_[A-Z]{2})").exec(id);
  }

  static previewId(id){
    return new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$").exec(id);
  }

  static assembleId(id, local){
    return id.concat('.', local);
  }

}

export class Route {

  constructor(path, previewId, contentUrl, language, label, status = 200) {
    this.path = path;
    this.previewId = previewId;
    this.contentUrl = contentUrl;
    this.language = language;
    this.label = label;
    this.status = status;
  }

  static startpageRoute(){
    return new Route("/", null, null, null, "Startpage", 200);
  }

  static notFoundPage(){
    return new Route("/", null, null, null, "404-Error", 404);
  }

}
