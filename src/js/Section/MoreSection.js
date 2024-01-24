import { App } from "../App";

/**
 * Simple Javascript to show and hide content from the "More information" section.
 */
export class MoreSection {
  /**
   * Creates an instance of MoreSection.
   */
  constructor() {
    this.render();
  }

  /**
   * Shows or hides the content.
   */
  render() {
    if (App.caasConnection && App.navigationService) {
      document.getElementById("more-content").classList.remove("hidden");
    } else {
      document.getElementById("more-content").classList.add("hidden");
    }
  }
}
