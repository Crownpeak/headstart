import { Modal } from "../Component/Modal";
import { DOMHelper } from "../Utility/DOMHelper";

/**
 * Adds a button that can be used to create a new section.
 */
export class AddContentButton {
  constructor(previewId, body) {
    this.previewId = previewId;
    this.body = body;
  }

  /**
   * Creates an HTML element with a button that can be used to create new sections.
   *
   * @returns {HTMLElement} with a button to create new sections
   */
  render() {
    const resultElement = DOMHelper.htmlToElement(this.html());
    const button = resultElement.querySelector("button");
    if (button) {
      resultElement.addEventListener("click", () => {
        this.addContentClick();
      });
    }
    return resultElement;
  }

  addContentClick() {
    if (TPP_SNAP) {
      TPP_SNAP.createSection(this.previewId, { body: this.body });
    }
  }

  html() {
    return `<section class="w-full relative">
                <button type="button" class="flex flex-col items-center justify-center p-1 bg-gray-200 text-[rgba(86,86,86,0.3)] border-2 border-dashed border-[rgba(86,86,86,0.15)] h-[180px] w-full max-w-full transition-all duration-300 mb-[20px] hover:bg-[#3288c3] hover:text-[rgba(255,255,255,0.8)] hover:border-2 hover:border-white cursor-pointer">
                    <span class="pb-[10px]">Slot "content"</span>
                        <div class="square-icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="plus-button h-[80px] transition-all duration-300 fill-[rgba(86,86,86,0.3)] hover:fill-[rgba(255,255,255,0.8)]">
                                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path>
                            </svg>
                        </div>
                    <span>Add content</span>
                </button>
            </section>`;
  }
}
