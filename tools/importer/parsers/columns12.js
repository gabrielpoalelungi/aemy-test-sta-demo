/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all top-level grid columns
  function getGridColumns(container) {
    const gridItems = container.querySelector('.cmp-grid-container__items');
    if (!gridItems) return [];
    const grid = gridItems.querySelector('.aem-Grid');
    if (!grid) return [];
    return Array.from(grid.children).filter(child => child.classList.contains('aem-GridColumn'));
  }

  // Find the main grid container
  const mainGridContainer = element.querySelector('.cmp-grid-container');
  if (!mainGridContainer) return;

  const columns = getGridColumns(mainGridContainer);
  if (!columns.length) return;

  // Header row: exactly one cell, as per markdown example
  const headerRow = ['Columns (columns12)'];
  // Content row: one cell for each column, as an array
  const contentRow = columns.map(col => {
    const section = col.querySelector('.cmp-section');
    if (!section) return '';
    const container = section.querySelector('.cmp-section__container');
    if (!container) return '';
    const grid = container.querySelector('.aem-Grid');
    if (!grid) return '';
    const columnContent = [];
    Array.from(grid.children).forEach(child => {
      if (child.classList.contains('headline')) {
        const headline = child.querySelector('.cmp-title');
        if (headline) columnContent.push(headline);
      }
      if (child.classList.contains('list')) {
        const ul = child.querySelector('.cmp-list');
        if (ul && ul.children.length) columnContent.push(ul);
      }
    });
    if (columnContent.length === 1) return columnContent[0];
    if (columnContent.length > 1) return columnContent;
    return '';
  });
  // Compose table: first row is one cell (the header); next row has one cell per column
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
