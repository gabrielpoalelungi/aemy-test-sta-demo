/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name, single cell
  const headerRow = ['Columns (columns40)'];

  // Get direct column children
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, collect all children (preserving all content, not just images)
  const row = columns.map((col) => {
    // If the column has more than one child, or non-text content, collect all
    const colChildren = Array.from(col.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    // If only one child and it's an element, just use the element
    if (colChildren.length === 1) {
      return colChildren[0];
    }
    // If multiple children or mixed text/elements, return as array
    return colChildren;
  });

  // Build and replace table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row,
  ], document);
  element.replaceWith(table);
}
