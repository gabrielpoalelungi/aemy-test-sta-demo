/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid items container holding the images
  const gridItems = element.querySelector('.cmp-grid-container__items');
  if (!gridItems) return;

  // Find all immediate children with 'image' class (each column)
  const aemGrid = gridItems.querySelector('.aem-Grid');
  if (!aemGrid) return;
  const imageColumns = Array.from(aemGrid.querySelectorAll(':scope > .image.aem-GridColumn'));
  if (imageColumns.length === 0) return;

  // For each image column, find the <img> inside
  const contentRow = imageColumns.map(col => {
    const img = col.querySelector('img');
    return img || col;
  });

  // Header row must be a single cell with the block name
  const headerRow = ['Columns (columns44)'];

  const tableRows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
