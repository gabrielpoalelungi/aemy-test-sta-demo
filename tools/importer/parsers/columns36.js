/* global WebImporter */
export default function parse(element, { document }) {
  // Find all top-level .section blocks (each is a column)
  let sections = element.querySelectorAll(':scope > div > div > div > div > div.section');
  if (!sections.length) {
    // fallback for slightly different nesting
    sections = element.querySelectorAll('.section');
  }

  // Compose the cells for the columns row (one cell per section)
  const columnsRow = [];
  sections.forEach((section) => {
    const cellContent = [];
    const image = section.querySelector('.cmp-image');
    if (image) cellContent.push(image);
    const text = section.querySelector('.cmp-text');
    if (text) cellContent.push(text);
    columnsRow.push(cellContent);
  });

  // Compose the table with a single header cell and a single row with multiple columns
  const cells = [
    ['Columns (columns36)'],
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
