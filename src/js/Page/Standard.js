import { App } from "../App";
import { TextImage } from "../Section/TextImage";
import { DefaultSection } from "../Section/DefaultSection";
import { PageHeaderSection } from "../Section/PageHeaderSection";
import { CodeDescriptionSection } from "../Section/CodeDescriptionSection";
import { AddContentButton } from "../Utility/AddContentButton";

/**
 * Is required to render the pages of the project. The page information and all sections are output.
 */
export class Standard {
  static bodyName = "content";

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
    if (App.isContentCreator && TPP_SNAP) {
      TPP_SNAP.setPreviewElement(this.data._id);
    }
    if (this.data.hasOwnProperty("page")) {
      const page = this.data.page;
      // Note: The implementation here is very simple and does not care about the different bodies defined in the CMS.
      this.sectionList = [];
      // A simple section to output the content of the page.
      this.sectionList.push(new PageHeaderSection(page));

      this.collectSections();
      // Note: This button would have to be defined for each body in order to create new sections in it.
      if (App.isContentCreator && TPP_SNAP) {
        this.sectionList.push(
          new AddContentButton(page.identifier, Standard.bodyName)
        );
      }
      mainElement.replaceChildren();
      this.sectionList.forEach((section) => {
        mainElement.appendChild(section.render());
      });
    }
  }

  /**
   * Updates the page data and renders it.
   */
  reRender(data = null) {
    if (data) {
      // Check if the page data changed
      if (this.data.identifier === data.identifier) {
        this.data = data;
        this.render();
      } else {
        const changedSection = this.sectionList.find(
          (section) => section.data.identifier === data.identifier
        );
        if (changedSection) {
          changedSection.updateData(data);
          changedSection.render();
        }
      }
    }
  }

  /**
   * Iterate through all bodies and sections
   */
  collectSections() {
    if (
      this.data.page.hasOwnProperty("children") &&
      this.data.page.children.length > 0
    ) {
      for (const body of this.data.page.children) {
        if (body.hasOwnProperty("children") && body.children.length > 0) {
          for (const section of body.children) {
            this.createSection(section);
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
        this.sectionList.push(new TextImage(section));
        break;
      case "code_description":
        this.sectionList.push(new CodeDescriptionSection(section));
        break;
      default:
        this.sectionList.push(new DefaultSection(section));
    }
  }
}
