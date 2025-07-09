/* global WebImporter */
export default function parse(element, { document }) {
  // Header: exactly one cell, matches spec
  const headerRow = ['Columns (columns30)'];

  // Content columns: collect direct children (should be column wrappers)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));
  // Extract the img element from each column
  const bodyRow = columnDivs.map(div => {
    const img = div.querySelector('img');
    return img || '';
  });

  // Build the table as [[headerRow], [bodyRow]] -- headerRow is a 1-cell row, bodyRow is N cells
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bodyRow
  ], document);
  element.replaceWith(table);
}
