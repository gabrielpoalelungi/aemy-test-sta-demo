/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child divs (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length === 0) return;

  // Create the table using WebImporter.DOMUtils.createTable as usual
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns31)'],
    columns
  ], document);

  // Fix the header row to span all columns
  const headerRow = table.querySelector('tr');
  if (headerRow && columns.length > 1) {
    const th = headerRow.querySelector('th');
    if (th) {
      th.setAttribute('colspan', columns.length);
    }
  }

  element.replaceWith(table);
}
