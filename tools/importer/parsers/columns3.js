/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid containing the columns
  let gridWithColumns = element.querySelector('.cmp-grid-container__items .aem-Grid');
  if (!gridWithColumns) {
    // fallback: find the first grid where every child is a column
    const allGrids = element.querySelectorAll('.aem-Grid');
    for (const grid of allGrids) {
      if ([...grid.children].every(child => child.classList.contains('image'))) {
        gridWithColumns = grid;
        break;
      }
    }
  }

  // For each column, use the entire .image block so all (future) content is preserved
  let columnCells = [];
  if (gridWithColumns) {
    const columnDivs = gridWithColumns.querySelectorAll(':scope > .image');
    columnCells = Array.from(columnDivs);
  }

  // If fewer than 3 columns, pad with empty cells
  while (columnCells.length < 3) columnCells.push('');

  // Compose the cells array as per the table structure (header row: one cell, content row: columns)
  const cells = [
    ['Columns (columns3)'],
    columnCells
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
