/* global WebImporter */
export default function parse(element, { document }) {
  // Get immediate child divs (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: if no columns, fallback to single cell
  if (columns.length === 0) {
    const cells = [
      ['Columns (columns12)'],
      [element]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }

  // The header row should be a single-cell row
  const cells = [];
  cells.push(['Columns (columns12)']);
  // The next row should have as many cells as columns
  cells.push(columns);
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
