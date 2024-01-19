import { ConnectionSection } from "../Section/ConnectionSection";
import { ContentSection } from "../Section/ContentSection";
import { NavigationSection } from "../Section/NavigationSection";
import { MoreSection } from "../Section/MoreSection";
import { SitemapSection } from "../Section/SitemapSection";

/**
 * The homepage with all the information about this project
 */
export class InfoPage {
  /**
   * Initializes and renders all sections of the homepage.
   */
  render() {
    this.getInfoPageHTML().then(() => {
      this.connectionSection = new ConnectionSection();
      this.connectionSection.render();
      this.navigationSection = new NavigationSection();
      this.navigationSection.render();
      this.contentSection = new ContentSection();
      this.contentSection.render();
      this.sitemapSection = new SitemapSection();
      this.sitemapSection.render();
      this.nextSection = new MoreSection();
      this.nextSection.render();
    });   
  }

  /**
   * Recreates the content.
   */
  reRender() {
    this.connectionSection.render();
    this.navigationSection.render();
    this.contentSection.render();
    this.sitemapSection.render();
    this.nextSection.render();
  }

  /**
   * As the content and markup of the startpage is overwritten when switching to another page in the project. 
   * The HTML must be reloaded when the page is called up again.
   * 
   * @returns {HTMLElement}
   * 
   */  
  getInfoPageHTML() {
    return new Promise((resolve) => {
      if (document.getElementById("info-page")) {
        resolve();
      } else {
        fetch("index.html")
          .then((response) => response.text())
          .then((text) => {
            const parser = new DOMParser();
            const infoPageHTML = parser.parseFromString(text, "text/html");
            document.getElementById("content-wrapper").innerHTML =
              infoPageHTML.getElementById("content-wrapper").innerHTML;
            resolve();
          });
      }
    });
  }
}