/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that holds the columns
  const grid = element.querySelector('.cmp-grid-container__items > .aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid as columns
  const columnBlocks = Array.from(grid.children);

  // For each column block, collect all its content (not just images)
  // Each .image div is a column - but in a more general scenario, columns may contain richer content
  const columns = columnBlocks.map(col => {
    // If the column has only one child, use it directly
    if (col.children.length === 1) {
      return col.firstElementChild;
    }
    // Else, for robustness, append all children to a wrapper div
    const wrapper = document.createElement('div');
    Array.from(col.childNodes).forEach(node => wrapper.appendChild(node));
    return wrapper;
  });

  // Compose the header row
  const header = ['Columns (columns48)'];
  // Compose the columns row (one cell per column)
  const row = columns;

  // Build the table
  const block = WebImporter.DOMUtils.createTable([header, row], document);

  // Replace the source element
  element.replaceWith(block);
}
