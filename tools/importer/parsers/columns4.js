/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the cmp-bio__detail element
  const bioDetail = element.querySelector('.cmp-bio__detail');
  if (!bioDetail) {
    // fallback: replace with empty columns block
    const table = WebImporter.DOMUtils.createTable([
      ['Columns (columns4)'],
      [''],
    ], document);
    element.replaceWith(table);
    return;
  }

  // Find left and right containers (columns)
  const left = bioDetail.querySelector('.cmp-bio__detail--left-container');
  const right = bioDetail.querySelector('.cmp-bio__detail--right-container');

  // Reference the columns if present, else include what is available
  let columnsRow;
  if (left && right) {
    columnsRow = [left, right];
  } else if (left) {
    columnsRow = [left];
  } else if (right) {
    columnsRow = [right];
  } else {
    columnsRow = [bioDetail];
  }

  // The header row must always be a single cell (per example)
  const headerRow = ['Columns (columns4)'];

  const cells = [
    headerRow,
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
