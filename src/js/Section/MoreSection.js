import { App } from "../App";

/**
 * Simple Javascript to show and hide content from the "More information" section.
 */
export class MoreSection {
  constructor() {
    this.render();
  }

  render() {
    if (App.caasConnection && App.navigationService) {        
        document.getElementById("more-content").classList.remove("hidden");      
    } else {        
        document.getElementById("more-content").classList.add("hidden");
    }
  }
}
