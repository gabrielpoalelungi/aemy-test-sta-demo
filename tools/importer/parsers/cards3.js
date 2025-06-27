/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];
  // Select all direct children with class 'icon-item' (each card)
  const cardElements = element.querySelectorAll(':scope > .icon-item');
  cardElements.forEach(card => {
    // Image/icon cell
    let img = null;
    const imgWrapper = card.querySelector('.icon-item__title-wrapper');
    if (imgWrapper) {
      img = imgWrapper.querySelector('img');
    }
    // Text content cell
    let content = null;
    const contentDiv = card.querySelector('.icon-item__content');
    if (contentDiv) {
      content = contentDiv;
    }
    // If both cells exist, include the row
    if (img || content) {
      rows.push([img, content]);
    }
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
