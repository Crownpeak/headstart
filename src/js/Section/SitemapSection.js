import { App } from "../App";
import { Modal } from "../Component/Modal";
import { DOMHelper } from "../Utility/DOMHelper";

/**
 * Section for displaying the navigation as sitemap based on the specified navigation endpoint.
 */
export class SitemapSection {
  /**
   * Fetches the navigation data from the navigation endpoint and displays it as a sitemap.
   */
  render() {
    if (App.navigationService) {
      App.navigationService.fetchNavigation("en_GB").then((response) => {
        if (response) {
          this.buildSitemap(response);
        }
      });
    }
  }

  /**
   * Creates a sitemap based on the given json.
   *
   * @param {JSON} sitemapData
   */
  buildSitemap(sitemapData) {
    if (sitemapData.children) {
      const sitemapElement = document.querySelector("#sitemap");
      sitemapElement.addEventListener("click", this.openItemInfo);
      sitemapElement.replaceChildren();
      for (const sitemapItem of sitemapData.children) {
        sitemapElement.appendChild(this.createSitemapItem(sitemapItem));
      }
    }
  }

  /**
   * Action to show a dialog with the containing json defintion of the sitemap node.
   *
   * @param {Event} event
   */
  openItemInfo(event) {
    const button = event.target.closest("[data-sitemap-item]");
    if (button) {
      const modal = Modal.instance();
      const jsonString = button.dataset.sitemapItem;
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
  }

  /**
   * Creates a list entry with a link for the specified sitemap element and all its child nodes.
   *
   * @param {JSON} sitemapItem
   * @returns {HTMLElement}
   */
  createSitemapItem(sitemapItem) {
    const listItem = document.createElement("li");
    listItem.classList.add("ml-4");
    // Span for the link
    const listItemSpan = document.createElement("span");
    listItemSpan.classList.add("flex", "flex-row");

    // Link
    const itemLink = document.createElement("a");
    itemLink.classList.add("text-red-600", "hover:underline");
    itemLink.href = sitemapItem.seoRoute;
    itemLink.innerText = sitemapItem.label;
    itemLink.setAttribute("data-link", "");

    // Button
    listItemSpan.appendChild(itemLink);
    const infoButtonText = sitemapItem.children ? "(Folder/Menu)" : "(PageRef)";
    const infoButton = DOMHelper.htmlToElement(
      this.getItemButton(sitemapItem, infoButtonText)
    );
    listItemSpan.appendChild(infoButton);
    listItem.appendChild(listItemSpan);

    // nested childrean
    if (sitemapItem.children) {
      const list = document.createElement("ul");
      list.classList.add("ml-4");
      for (const child of sitemapItem.children) {
        list.appendChild(this.createSitemapItem(child));
      }
      listItem.appendChild(list);
    }
    return listItem;
  }

  /**
   * Creates an HTML string definition of a button to open an info dialog.
   *
   * @param {JSON} data of this sitemap node
   * @param {String} infoButtonText to be displayed
   * @returns {String} definition of a html button
   */
  getItemButton(data, infoButtonText) {
    return `<button class="flex flex-row items-center ml-2 text-base hover:bg-pink-200" data-sitemap-item='${JSON.stringify(
      data,
      null,
      2
    )}'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 
          0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>${infoButtonText}
    </button>`;
  }
}
