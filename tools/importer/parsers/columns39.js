/* global WebImporter */
export default function parse(element, { document }) {
  // Get the li items (tabs)
  const listItems = element.querySelectorAll(':scope > li');
  if (!listItems.length) {
    element.remove();
    return;
  }
  // Header row: single cell with block name
  const headerRow = ['Columns (columns39)'];
  // Second row: one cell for each tab label (reference the <span> if present, else just the text)
  const tabCells = Array.from(listItems).map(li => {
    const span = li.querySelector('span');
    if (span) return span;
    return document.createTextNode(li.textContent.trim());
  });
  // Note: Each row is an array of cells; here, header is [ 'Columns (columns39)' ], second row is [cell1, cell2, ...]
  const cells = [
    headerRow,
    tabCells,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
