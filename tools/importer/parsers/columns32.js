/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid-layout, which contains the column content
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all immediate children of the grid (the columns)
  const columns = Array.from(grid.children);
  if (columns.length === 0) return;

  // The header row must have only ONE cell, containing the block name
  const headerRow = ['Columns (columns32)'];

  // The table structure for a columns block requires:
  // - the first row: one cell with the block name
  // - the second row: N cells, one for each column's content
  // So, cells is an array of arrays: first array single header, second array is the columns
  const cells = [
    headerRow,
    columns // this array will have one cell for each column
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
