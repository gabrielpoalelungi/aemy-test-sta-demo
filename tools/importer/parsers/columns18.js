/* global WebImporter */
export default function parse(element, { document }) {
  // Find the elements that represent columns in the block.
  // For this HTML, each direct child of .aem-Grid is a column (e.g. image blocks)
  const itemsContainer = element.querySelector('.cmp-grid-container__items');
  if (!itemsContainer) return;
  const grid = itemsContainer.querySelector('.aem-Grid');
  if (!grid) return;
  // Each column is a direct child of the .aem-Grid
  const columns = Array.from(grid.children);
  // For each column, collect all visible content. Here, each is an image block, but generalize to allow future mixed content
  const cellsRow = columns.map(col => {
    // For robustness, collect all child nodes (could be text, buttons, images, etc)
    // Document fragment for all content
    const fragment = document.createDocumentFragment();
    Array.from(col.childNodes).forEach(node => fragment.appendChild(node));
    // If nothing was appended, skip (shouldn't happen in this HTML)
    if (!fragment.hasChildNodes()) return '';
    return fragment;
  });
  // If all cells are empty, do nothing
  if (cellsRow.length === 0 || cellsRow.every(cell => !cell || (cell.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !cell.hasChildNodes()))) return;
  // Create the block table: header row (1 col), then next row with one cell per column
  const cells = [
    ['Columns (columns18)'],
    cellsRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
