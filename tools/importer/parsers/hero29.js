/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero29)'];

  // Find the main grid container, which has text and image as children
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);

  // Find the image element (assume first img in grid children)
  const imgEl = grid.querySelector('img');
  // Find the text content div (assume first non-img child)
  const textDiv = gridChildren.find(child => child !== imgEl);

  // 2nd row: image (as a cell, or empty string if missing)
  const imageRow = [imgEl || ''];

  // 3rd row: text content (referencing the original element directly, or empty if missing)
  const contentRow = [textDiv || ''];

  const rows = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
