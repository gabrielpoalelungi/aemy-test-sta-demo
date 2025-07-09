/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main grid containing the columns
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;
  const children = Array.from(grid.children);

  // Left column: heading + quote
  const leftCol = document.createElement('div');
  if (children[0]) leftCol.appendChild(children[0]);
  if (children[1]) leftCol.appendChild(children[1]);

  // Right column: only the testimonial person content (avatar, name, title)
  let rightCol = document.createElement('div');
  if (children[2]) {
    // The flex-horizontal contains avatar, name, and title
    const flexRow = children[2].querySelector('.flex-horizontal');
    if (flexRow) {
      rightCol.appendChild(flexRow);
    }
  }

  // Compose table as 1 header row, 1 content row with 2 columns
  const headerRow = ['Columns (columns27)'];
  const contentRow = [leftCol, rightCol];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
