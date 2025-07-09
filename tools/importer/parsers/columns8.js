/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main two-column grid (with text and image)
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.grid-layout');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);

  // Identify image element (right column)
  let imgEl = null;
  let textCol = null;
  gridChildren.forEach(child => {
    if (!imgEl && (child.tagName === 'IMG' || (child.querySelector && child.querySelector('img')))) {
      imgEl = child.tagName === 'IMG' ? child : child.querySelector('img');
    } else if (!textCol) {
      textCol = child;
    }
  });

  // Defensive: if we only found one, use the first/second
  if (!textCol && gridChildren.length > 0) textCol = gridChildren[0];
  if (!imgEl && gridChildren.length > 1) imgEl = gridChildren[1];

  // Reference the original textCol and imgEl elements directly in table cells
  // so all text content and structure are included

  // Compose header and content rows
  const headerRow = ['Columns (columns8)'];
  const contentRow = [textCol, imgEl];

  // Compose table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
