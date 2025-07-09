/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Hero (hero3)'];

  // Row 2 - Background Image (optional, not present)
  const backgroundRow = [''];

  // Row 3 - Title, Subheading, CTA
  // Find the grid container which holds the main content
  const grid = element.querySelector('.w-layout-grid');

  // Defensive: in case the grid is not present
  let contentRow = [''];
  if (grid) {
    // Get all immediate children of the grid
    const gridChildren = Array.from(grid.children);
    // Typically: [text content, button group]
    const contentFragments = [];

    // Find heading and subheading in the first cell
    const textCell = gridChildren[0];
    if (textCell) {
      // Extract all headings and subheadings (preserve element structure)
      const h2 = textCell.querySelector('h2');
      if (h2) contentFragments.push(h2);
      const subheading = textCell.querySelector('p');
      if (subheading) contentFragments.push(subheading);
    }

    // Find CTAs in the second cell
    const ctaCell = gridChildren[1];
    if (ctaCell) {
      // Buttons/links (keep as elements)
      const buttons = Array.from(ctaCell.querySelectorAll('a'));
      if (buttons.length) {
        contentFragments.push(...buttons);
      }
    }
    contentRow = [contentFragments];
  }

  // Compose table data
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
