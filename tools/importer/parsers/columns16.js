/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns (value-props)
  const grid = element.querySelector('.cmp-grid-container__items > .aem-Grid');
  if (!grid) return;

  // Each direct child of the grid is a column
  const colEls = Array.from(grid.children).filter((c) => c.nodeType === 1);
  if (!colEls.length) return;

  // For each column: collect ALL direct children of the value-prop (not just the statistic block)
  const columns = colEls.map((col) => {
    // get the main cmp-value-prop wrapper if present
    const content = col.querySelector('.cmp-value-prop') || col;
    // For generality, allow all children (text, images, links, etc) in each column
    // If cmp-value-prop has only one child, use that, else use all its children
    const children = Array.from(content.childNodes).filter((n) => {
      // Only include elements or text nodes with non-whitespace
      return (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim().length > 0);
    });
    // If only one child, return it directly
    if (children.length === 1) return children[0];
    // If multiple, return as array for the cell
    return children;
  });

  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns16)'],
    columns
  ], document);

  element.replaceWith(table);
}
