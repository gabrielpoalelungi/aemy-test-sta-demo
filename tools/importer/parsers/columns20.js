/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the grid that contains the columns
  const gridItems = element.querySelector('.cmp-grid-container__items');
  if (!gridItems) return;
  const grid = gridItems.querySelector('.aem-Grid');
  if (!grid) return;

  // Each .aem-GridColumn is a visual column
  const columnDivs = Array.from(grid.children).filter(
    (child) => child.classList.contains('aem-GridColumn')
  );

  // Build the content row (actual columns)
  const contentRow = columnDivs.map((col) => {
    const textEl = col.querySelector('.cmp-text');
    const imgEl = col.querySelector('.cmp-image');
    if (textEl && imgEl) return [textEl, imgEl];
    if (textEl) return textEl;
    if (imgEl) return imgEl;
    return col;
  });

  if (!contentRow.length) return;

  // Header row must have as many columns as the content row; all but the first cell are empty
  const headerRow = ['Columns (columns20)'];
  while (headerRow.length < contentRow.length) headerRow.push('');

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
