/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns: download blocks inside .cmp-grid-container__items > .aem-Grid
  let columns = [];
  const itemsContainer = element.querySelector('.cmp-grid-container__items');
  if (itemsContainer) {
    const grid = itemsContainer.querySelector('.aem-Grid');
    if (grid) {
      columns = Array.from(grid.children).filter(child => child.classList.contains('download'));
    }
  }
  // Fallback: if not found, use top-level download blocks
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll('.download'));
  }
  // Build cells array: header single cell, then a row with all columns as cells
  const cells = [
    ['Columns (columns13)'],
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
