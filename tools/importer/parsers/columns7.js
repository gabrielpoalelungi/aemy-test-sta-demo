/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing all downloads
  const grid = element.querySelector('.cmp-grid-container__items > .aem-Grid');
  if (!grid) return;

  // Get all .download cards (these are grid columns)
  const downloadColumns = Array.from(grid.children);

  // For each download, grab the download card block, preserving structure
  const blocks = downloadColumns.map(col => {
    // Reference the cmp-download block directly (contains all content and text)
    const block = col.querySelector('.cmp-download');
    return block || col;
  });

  // Arrange as rows of 3 columns to match the screenshot
  const rows = [];
  for (let i = 0; i < blocks.length; i += 3) {
    rows.push([
      blocks[i] || '',
      blocks[i + 1] || '',
      blocks[i + 2] || ''
    ]);
  }

  // Header row must match exactly: one column, with the block name
  const cells = [
    ['Columns (columns7)'],
    ...rows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
