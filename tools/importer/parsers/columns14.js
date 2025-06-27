/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be a single cell as per requirements
  const headerRow = ['Columns (columns14)'];

  // Find columns: .elementor-column direct children of the main section > container
  const columns = Array.from(
    element.querySelectorAll(':scope > div > div.elementor-column')
  );

  // For each column, use the .elementor-widget-wrap as the main content for the cell
  const cellsRow = columns.map(col => {
    const wrap = col.querySelector(':scope > .elementor-widget-wrap');
    return wrap || col;
  });

  // The block table: header (1 cell), then the row of N columns/cells
  const tableCells = [headerRow, cellsRow];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
