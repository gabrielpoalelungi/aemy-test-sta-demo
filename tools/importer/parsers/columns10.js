/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main bio detail container
  const bioDetail = element.querySelector('.cmp-bio__detail');
  if (!bioDetail) return;
  // Left and right containers
  const left = bioDetail.querySelector('.cmp-bio__detail--left-container');
  const right = bioDetail.querySelector('.cmp-bio__detail--right-container');
  // Defensive handling if structure varies
  let row = [];
  if (left && right) {
    row = [left, right];
  } else {
    row = [bioDetail];
  }
  // Header must be a single cell (spanning all columns)
  const cells = [
    ['Columns (columns10)'],
    row
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
