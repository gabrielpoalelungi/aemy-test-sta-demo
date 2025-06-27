/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the grid items container
  const itemsContainer = element.querySelector('.cmp-grid-container__items');
  if (!itemsContainer) return;

  // 2. Find .aem-Grid inside itemsContainer
  const grid = itemsContainer.querySelector('.aem-Grid');
  if (!grid) return;

  // 3. Get all column blocks (immediate .value-prop children)
  const columnElements = Array.from(grid.querySelectorAll(':scope > .value-prop'));

  // 4. For each value-prop, reference the statistic content
  const statColumns = columnElements.map((valueProp) => {
    const stat = valueProp.querySelector('.cmp-value-prop__statistic');
    if (!stat) return '';
    return stat;
  });

  // 5. Compose the cells array: ensure header is a single cell, then a row of stat columns
  const cells = [
    ['Columns (columns41)'],
    statColumns
  ];

  // 6. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
