import { DOMHelper } from "../Utility/DOMHelper";

/**
 * Used to display all CMS sections for which there is no suitable implementation.
 */
export class DefaultSection {
  data;
  previewId;

  /**
   * Creates an instance of DefaultSection.
   */
  constructor(data) {
    this.updateData(data);
  }

  updateData(data) {
    this.data = data;
    this.previewId = data.identifier ? data.identifier : "";
  }

  /**
   * Creates a new HTML element with the entire content of this section.
   *
   * @returns {HTMLElement} of this section
   */
  render() {
    const newHtmlNode = DOMHelper.htmlToElement(this.html());
    // Add code
    const codeElement = newHtmlNode.querySelector("code");
    const dataAsJson = JSON.stringify(this.data, null, 4);
    codeElement.innerHTML = Prism.highlight(
      dataAsJson,
      Prism.languages.javascript,
      "javascript"
    );

    return newHtmlNode;
  }

  /**
   * Returns a HTML snippet with the CaaS content.
   *
   * @returns {String} html
   */
  html() {
    return `<section class="w-full relative" data-preview-id="${this.previewId}">
              <div class="pt-6 lg:px-8 lg:pt-8 pb-12 xl:pb-24 lg:pb-16">
                <pre class="max-h-half-screen overflow-auto language-javascript">
                  <code class="language-javascript"></code>
                </pre>
              </div>
            </section>`;
  }
}
