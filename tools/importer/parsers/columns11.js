/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container which holds columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get immediate children of grid, which are the columns
  const columns = Array.from(grid.children);
  if (!columns.length) return;

  // Table header as in the example: exactly one cell
  const headerRow = ['Columns (columns11)'];

  // Content row: as many cells as columns found in the grid
  const contentRow = columns;

  // Create the block table, header row is a single column, content row as many columns as needed
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
