/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that marks the columns area
  const gridContainer = element.querySelector('.cmp-grid-container__items > .aem-Grid');
  // Get all direct children .section of the grid (these are the columns visually)
  let columnSections = [];
  if (gridContainer) {
    columnSections = Array.from(gridContainer.querySelectorAll(':scope > .section'));
  }
  // Fallback: try to find sections if above fails
  if (columnSections.length === 0) {
    columnSections = Array.from(element.querySelectorAll('.cmp-grid-container__items .section'));
  }

  // For each column, gather its entire inner content (all blocks in the column)
  const cells = columnSections.map(section => {
    // The actual main content is inside the .cmp-section__container
    const container = section.querySelector('.cmp-section__container');
    let innerGrid = container && container.querySelector('.aem-Grid');
    if (!innerGrid) innerGrid = container || section;
    // Only use direct children with visible content
    const blocks = Array.from(innerGrid.children).filter(el => el.textContent.trim() || el.children.length > 0);
    return blocks;
  });

  // Only build table if we found at least one column
  if (cells.length > 0) {
    // Compose the table: header row, then columns row
    const table = WebImporter.DOMUtils.createTable([
      ['Columns (columns49)'],
      cells
    ], document);
    element.replaceWith(table);
  }
}
