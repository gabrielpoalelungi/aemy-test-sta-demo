/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout inside the section
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const columns = Array.from(grid.children);
  // For each column, collect all content of the column (not just images)
  // Some Webflow grids wrap actual content in a further <div>, so we want all visible children
  // We'll use the innermost content of each column
  const row = columns.map(col => {
    // If the column only has one child that's a wrapper (eg. .utility-aspect-2x3), use its content
    let content = [];
    const wrappers = Array.from(col.children);
    if (wrappers.length === 1 && wrappers[0].children.length) {
      content = Array.from(wrappers[0].children);
    } else if (wrappers.length > 0) {
      content = wrappers;
    } else {
      content = [col];
    }
    // Flatten any text nodes and elements
    return content.length === 1 ? content[0] : content;
  });
  // Build the cells array for the table
  const cells = [
    ['Columns (columns17)'],
    row
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
