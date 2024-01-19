import * as TPP_SNAP from "fs-tpp-api/snap";
import { TextImage } from "../Section/TextImage";
import { DefaultSection } from "../Section/DefaultSection";
import { PageHeaderSection } from "../Section/PageHeaderSection";
import { CodeDescriptionSection } from "../Section/CodeDescriptionSection";

/**
 * Is required to render the pages of the project. The page information and all sections are output.
 */
export class Standard {
  constructor(data) {
    this.data = data;
    this.sectionList = [];
  }

  /**
   * Renders the content of a webpage based on the provided data.
   */
  render() {
    const mainElement = document.querySelector("#app main");
    // Sets the preview element of the ContentCreator, the navigation and workflow are updated accordingly.
    TPP_SNAP.setPreviewElement(this.data._id);
    if (this.data.hasOwnProperty("page")) {
      const page = this.data.page;
      // A simple section to output the content of the page.
      this.sectionList = [];
      this.sectionList.push(new PageHeaderSection(page));
      this.collectSections().then(() => {
        mainElement.replaceChildren();
        this.sectionList.forEach((section) => {
          mainElement.appendChild(section.render());
        });
      });
    }
  }

  /**
   * Updates the page data and renders it.
   */
  reRender(data = null) {
    if (data) {
      this.data = data;
    }
    this.render();
  }

  /**
   * Iterate through all bodies and sections
   */
  async collectSections() {
    if (
      this.data.page.hasOwnProperty("children") &&
      this.data.page.children.length > 0
    ) {
      for (const body of this.data.page.children) {
        if (body.hasOwnProperty("children") && body.children.length > 0) {
          for (const section of body.children) {
            await this.createSection(section);
          }
        }
      }
    }
  }

  /**
   * Attempts to create a matching section based on the specified data.
   * If no matching section can be found, a default section is created.
   *
   * @param {Object} section contains the data for this section
   */
  async createSection(section) {
    switch (section.template.uid) {
      case "text_image":
        this.sectionList.push(await TextImage.create(section));
        break;
      case "code_description":
        this.sectionList.push(new CodeDescriptionSection(section));
        break;
      default:
        this.sectionList.push(new DefaultSection(section));
    }
  }
}
