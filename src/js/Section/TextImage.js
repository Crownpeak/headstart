import { App } from "../App";
import { Modal } from "../Component/Modal";
import { RichText } from "../Component/RichText";
import { DOMHelper } from "../Utility/DOMHelper";

/**
 * A section that has been developed according to the existing template in the CMS.
 * The information from the section created in the CMS is output.
 */
export class TextImage {
  data;
  previewId;
  title;
  text;
  imageUrl;

  /**
   * Creates an instance of TextImage.
   */
  constructor(data) {
    this.updateData(data);
  }

  updateData(data) {
    this.data = data;
    this.previewId = data.identifier ? data.identifier : "";
    this.title = data?.formData?.st_headline?.value
      ? data?.formData?.st_headline?.value
      : "";
    this.text = data?.formData?.st_text?.value
      ? data?.formData?.st_text?.value
      : "";
    this.imageUrl = data?.formData?.st_image?.value?.url;
  }

  /**
   * Creates a new HTML element with the entire content of this section.
   *
   * @returns {HTMLElement} of this section
   */
  render() {
    const newHtmlNode = DOMHelper.htmlToElement(this.html());
    const devButton = newHtmlNode.querySelector("button");
    devButton.addEventListener("click", (event) => {
      this.showInfoModal();
    });
    const richText = new RichText(this.text);
    DOMHelper.appendNodes(
      newHtmlNode,
      `[data-preview-id="${this.previewId}/st_text"]`,
      richText.render()
    );

    if (this.imageUrl) {
      App.caasConnection
        .resolveImage(this.imageUrl, "4x3_M")
        .then((imageSrc) => {
          if (!imageSrc) return;
          const element = newHtmlNode.querySelector(
            `[data-preview-id="${this.previewId}/st_image"]`
          );
          element.src = imageSrc;
        });
    }

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
                      <div class="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
                        <div class="max-w-md lg:max-w-xl mx-auto lg:mx-0">
                          <span class="inline-block py-2 px-3 mb-10 text-xs bg-pink-50 text-pink-900 font-semibold rounded-full">
                            This is an example of text and image
                          </span>
                          <h2 class="font-heading text-5xl xs:text-6xl font-bold text-gray-900 mb-10">${this.title}</h2>
                          <div class="md:flex max-w-3xl px-5 py-5 mb-10 items-center bg-white shadow-lg rounded-3xl">
                              <div class="text-lg text-gray-700" data-preview-id="${this.previewId}/st_text">                                
                              </div>
                          </div>                          
                        </div>
                      </div>
                      <div class="w-full lg:w-1/2 px-4">
                        <img class="mx-auto lg:mr-0"
                            data-preview-id="${this.previewId}/st_image"
                            src="${this.imageUrl}" alt="" >
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
