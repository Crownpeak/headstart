export class HeadlessConfiguration {
  static CAAS_PREVIEW_ENDPOINT_FIELD = "caasPreviewEndpoint";
  static CAAS_PREVIEW_API_KEY_FIELD = "caasPreviewApikey";  
  static NAVIGATION_PREVIEW_ENDPOINT_FIELD = "navigationPreviewEndpoint";

  static CAAS_RELEASE_ENDPOINT_FIELD = "caasReleaseEndpoint";
  static CAAS_RELEASE_API_KEY_FIELD = "caasReleaseApikey";
  static NAVIGATION_RELEASE_ENDPOINT_FIELD = "navigationReleaseEndpoint";
  
  constructor(caasPreviewEndpoint, caasPreviewApikey, navigationPreviewEndpoint, caasReleaseEndpoint, caasReleaseApikey, navigationReleaseEndpoint) {
    this.caasPreviewEndpoint = caasPreviewEndpoint;
    this.caasPreviewApikey = caasPreviewApikey;
    this.navigationPreviewEndpoint = navigationPreviewEndpoint;
    
    this.caasReleaseEndpoint = caasReleaseEndpoint;
    this.caasReleaseApikey = caasReleaseApikey;    
    this.navigationReleaseEndpoint = navigationReleaseEndpoint;
  }
  
  static create(configurationObj) {
    if (this.validate(configurationObj)){
      return new HeadlessConfiguration(
        configurationObj[this.CAAS_PREVIEW_ENDPOINT_FIELD],
        configurationObj[this.CAAS_PREVIEW_API_KEY_FIELD],
        configurationObj[this.NAVIGATION_PREVIEW_ENDPOINT_FIELD],
        configurationObj[this.CAAS_RELEASE_ENDPOINT_FIELD],
        configurationObj[this.CAAS_RELEASE_API_KEY_FIELD],
        configurationObj[this.NAVIGATION_RELEASE_ENDPOINT_FIELD]
      );      
    }
    throw new Error("One or more parameters missing");
  }

  static validate(obj){
    return obj.hasOwnProperty(this.CAAS_PREVIEW_ENDPOINT_FIELD) && obj.hasOwnProperty(this.CAAS_PREVIEW_API_KEY_FIELD) && obj.hasOwnProperty(this.NAVIGATION_PREVIEW_ENDPOINT_FIELD)
  }
}
