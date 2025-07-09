/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per requirements
  const headerRow = ['Accordion (accordion21)'];

  // Gather all immediate child .divider elements (each is an accordion item)
  const accordionRows = [];
  const items = element.querySelectorAll(':scope > .divider');
  items.forEach((item) => {
    // Expecting structure: .divider > .w-layout-grid.grid-layout > [title, content]
    const grid = item.querySelector(':scope > .grid-layout');
    if (grid) {
      const gridChildren = grid.querySelectorAll(':scope > *');
      // Defensive checks in case of missing children
      if (gridChildren.length >= 2) {
        const title = gridChildren[0];
        const content = gridChildren[1];
        // Reference the actual elements, not their clones or HTML
        accordionRows.push([title, content]);
      }
    }
  });

  // Only create the table if there is at least one item
  if (accordionRows.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...accordionRows
    ], document);
    element.replaceWith(table);
  } else {
    // Optionally, remove the element if empty (no accordion items found)
    element.remove();
  }
}
