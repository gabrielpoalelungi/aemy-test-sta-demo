/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main 2-column grid inside the container
  const grid = element.querySelector('.cmp-grid-container__items > .aem-Grid');
  if (!grid) return;

  // LEFT column: section (text + button)
  let leftCol = null;
  const section = grid.querySelector('.section .cmp-section__container > .aem-Grid');
  if (section) {
    leftCol = section;
  }

  // RIGHT column: image
  let rightCol = null;
  const image = grid.querySelector('.image .cmp-image');
  if (image) {
    rightCol = image;
  }

  // Header row must be a single cell (1 column) array
  const headerRow = ['Columns (columns53)'];
  // Content row should have as many columns as needed, here 2
  const contentRow = [leftCol || '', rightCol || ''];
  const cells = [
    headerRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
