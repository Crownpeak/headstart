/**
 * Used to display all CMS sections for which there is no suitable implementation.
 */
export class DefaultSection {
  /**
   * Creates an instance of DefaultSection.
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * Creates a new HTML element with the entire content of this section.
   *
   * @returns {HTMLElement} of this section
   */
  render() {
    const section = document.createElement("section");
    section.innerHTML = JSON.stringify(this.data, null, 4);
    section.dataset.previewId = this.data.identifier;
    return section;
  }
}
