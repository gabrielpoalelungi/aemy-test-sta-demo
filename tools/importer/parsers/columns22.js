/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container with the two content columns
  const gridItems = element.querySelector('.cmp-grid-container__items .aem-Grid');
  if (!gridItems) return;
  const columns = Array.from(gridItems.children).filter(col => col.nodeType === 1);
  if (columns.length < 2) return;

  // Find the column that contains text
  const textCol = columns.find(col => col.querySelector('.cmp-text'));
  // Find the column that contains image
  const imageCol = columns.find(col => col.querySelector('.cmp-image'));
  if (!textCol || !imageCol) return;

  // Get the main content elements
  const textContent = textCol.querySelector('.cmp-text');
  const imageContent = imageCol.querySelector('.cmp-image');

  // Defensive: Ensure elements are found
  if (!textContent || !imageContent) return;

  // Block table structure
  const headerRow = ['Columns (columns22)'];
  const contentRow = [textContent, imageContent];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(table);
}
