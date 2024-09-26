import { Modal } from "../Component/Modal";
import { RichText } from "../Component/RichText";
import { DOMHelper } from "../Utility/DOMHelper";

/**
 * A section that has been developed according to the existing template in the CMS. The information from the section created in the CMS is output.
 */
export class CodeDescriptionSection {
  data;
  previewId;
  headline;
  textBefore;
  code;
  textAfter;

  /**
   * Creates an instance of CodeDescriptionSection.
   */
  constructor(data) {
    this.updateData(data);
  }

  updateData(data) {
    this.data = data;
    this.previewId = data.identifier ? data.identifier : "";
    this.headline = data?.formData?.st_headline?.value
      ? data?.formData?.st_headline?.value
      : "";
    this.textBefore = data?.formData?.st_text_before?.value
      ? data?.formData?.st_text_before?.value
      : "";
    this.code = data?.formData?.st_code?.value
      ? data?.formData?.st_code?.value
      : "";
    this.textAfter = data?.formData?.st_text_after?.value
      ? data?.formData?.st_text_after?.value
      : "";
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
    codeElement.innerHTML = Prism.highlight(
      this.code,
      Prism.languages.javascript,
      "javascript"
    );
    // Add dev button
    const devButton = newHtmlNode.querySelector("button");
    devButton.addEventListener("click", (event) => {
      this.showInfoModal();
    });
    // Add text
    const richTextBefore = new RichText(this.textBefore);
    DOMHelper.appendNodes(
      newHtmlNode,
      '[data-preview-id="#st_text_before"]',
      richTextBefore.render()
    );
    const richTextAfter = new RichText(this.textAfter);
    DOMHelper.appendNodes(
      newHtmlNode,
      '[data-preview-id="#st_text_after"]',
      richTextAfter.render()
    );

    if (this.htmlNode) {
      this.htmlNode.replaceWith(newHtmlNode);
    }
    this.htmlNode = newHtmlNode;

    return newHtmlNode;
  }

  /**
   * Opens a dialog to display the data for this section that was provided by the caas endpoint.
   */
  showInfoModal() {
    const modal = Modal.instance();

    const jsonString = JSON.stringify(this.data, null, 2);
    const codeSnippet = `<pre class="max-h-half-screen overflow-auto language-javascript">
        <code class="language-javascript"></code>
      </pre>`;
    const codeBlock = DOMHelper.htmlToElement(codeSnippet);
    const codeElement = codeBlock.querySelector(".language-javascript");
    codeElement.innerHTML = Prism.highlight(
      jsonString,
      Prism.languages.javascript,
      "javascript"
    );

    modal.show(codeBlock);
  }

  /**
   * Returns a HTML snippet with the CaaS content.
   *
   * @returns {String} html
   */
  html() {
    return `<section class="w-full relative" data-preview-id="${this.previewId}">
                  <div class="pt-6 lg:px-8 lg:pt-8 pb-12 xl:pb-24 lg:pb-16">
                    <div class="flex flex-wrap -mx-4">
                      <div class="w-full px-4 mb-16 lg:mb-0">
                        <div class="max-w-full mx-auto lg:mx-0">                          
                          <h2 class="font-heading text-5xl xs:text-6xl font-bold text-gray-900 mb-10" data-preview-id="${this.previewId}/st_headline">${this.headline}</h2>
                          <div class="md:flex max-w-full px-5 py-5 mb-10 items-center bg-white shadow-lg rounded-3xl">
                              <div class="text-lg text-gray-700" data-preview-id="#st_text_before">                                                                
                              </div>
                          </div>
                          <pre class="max-h-half-screen overflow-auto language-javascript">
                            <code class="language-javascript"></code>
                          </pre>
                          <div class="max-w-full px-5 py-5 mb-10 items-center bg-white shadow-lg rounded-3xl">
                              <div class="text-lg text-gray-700" data-preview-id="#st_text_after">                                
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="absolute top-1/4 right-0 translate-x-full m-4 mx-auto rounded-md bg-gray-800 px-1 text-sm text-gray-100 ">
                    <button>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 
                          0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                      </svg>  
                    </button>          
                    <div class="absolute top-0 -z-10 w-4 h-4 origin-top-left transform rotate-45 bg-gray-800 rounded-sm"></div>
                  </div>
                </section>`;
  }
}
