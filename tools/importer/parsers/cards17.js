/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Setup header row as in the example
  const headerRow = ['Cards (cards17)'];
  const cells = [headerRow];

  // 2. Find all tab content panes (each may have multiple cards in a grid)
  const tabPanes = element.querySelectorAll('.w-tab-pane');
  tabPanes.forEach((tabPane) => {
    // The main grid in this tab
    const grid = tabPane.querySelector('.w-layout-grid');
    if (!grid) return;
    // Each card is a direct <a> child of the grid
    const cards = Array.from(grid.querySelectorAll(':scope > a'));
    cards.forEach((card) => {
      // IMAGE: Look for img as direct/indirect child (only if present)
      const imgEl = card.querySelector('img');
      // TEXT: Find heading and description (must reference existing nodes)
      let title = card.querySelector('h3, .h4-heading');
      let desc = card.querySelector('.paragraph-sm');
      // Compose text cell by referencing the existing nodes (not cloning)
      const textFragments = [];
      if (title) textFragments.push(title);
      if (desc && desc !== title) textFragments.push(desc);
      // If both missing, make empty so the cell isn't undefined
      const textCell = textFragments.length ? textFragments : '';
      // Image cell: either the <img> or blank
      const imageCell = imgEl ? imgEl : '';
      cells.push([imageCell, textCell]);
    });
  });

  // 3. Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // 4. Replace the original element
  element.replaceWith(table);
}
