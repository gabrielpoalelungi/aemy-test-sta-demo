/* global WebImporter */
export default function parse(element, { document }) {
  // Find the bio detail container
  const bioDetail = element.querySelector('.cmp-bio__detail');
  if (!bioDetail) return;

  // Get left and right containers
  const left = bioDetail.querySelector('.cmp-bio__detail--left-container');
  const right = bioDetail.querySelector('.cmp-bio__detail--right-container');

  // Guard in case containers are missing
  if (!left || !right) return;

  // Header row must match the number of columns in content row
  const headerRow = ['Columns (columns45)', ''];
  const contentRow = [left, right];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
