/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const aemGrid = element.querySelector('.cmp-grid-container__items > .aem-Grid');
  if (!aemGrid) return;
  const valueProps = Array.from(aemGrid.querySelectorAll(':scope > .value-prop'));

  // Build columns so that each column cell contains ALL content from that column, not just a sub-block
  const columns = valueProps.map((vp) => {
    // Use everything inside the value-prop column, not just a sub-block
    // This ensures that any content inside each column is included
    return Array.from(vp.childNodes).filter(node => {
      // Keep elements and meaningful text nodes
      return node.nodeType !== Node.COMMENT_NODE && (node.nodeType !== Node.TEXT_NODE || node.textContent.trim().length > 0);
    });
  });

  // Compose the table: header row (1 cell), then a row with as many columns as needed
  const rows = [
    ['Columns (columns17)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
