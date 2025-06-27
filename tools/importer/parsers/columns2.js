/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid items container
  const grid = element.querySelector('.cmp-grid-container__items > .aem-Grid');
  if (!grid) return;

  // Find the content and image columns
  const cols = Array.from(grid.children);
  const contentCol = cols.find((c) => c.classList.contains('content-block'));
  const imageCol = cols.find((c) => c.classList.contains('image'));

  // LEFT COLUMN: headline + paragraphs
  let leftCell = [];
  if (contentCol) {
    const main = contentCol.querySelector('.cmp-content-block__content');
    if (main) {
      const headline = main.querySelector('.cmp-content-block__headline');
      if (headline) leftCell.push(headline);
      const desc = main.querySelector('.cmp-content-block__description .cmp-text');
      if (desc) {
        // Add all paragraphs in order
        leftCell.push(...desc.querySelectorAll('p'));
      }
    }
  }

  // RIGHT COLUMN: image
  let rightCell = [];
  if (imageCol) {
    // just use the img element
    const img = imageCol.querySelector('img');
    if (img) rightCell.push(img);
  }

  // Build columns table
  const cells = [
    ['Columns (columns2)'],
    [leftCell, rightCell]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
