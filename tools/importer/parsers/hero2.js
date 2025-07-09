/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Hero (hero2)'];

  // Get the grid layout (should contain both image and content)
  const grid = element.querySelector('.grid-layout');

  // Row 2: Image (background/feature image)
  let imgCell = [''];
  if (grid) {
    const img = grid.querySelector('img');
    if (img) {
      imgCell = [img];
    }
  }

  // Row 3: Title, Subheading, CTA (all text content)
  let contentCell = [''];
  if (grid) {
    // Find the div containing heading/content
    // It's the immediate child div that is not the image
    const children = Array.from(grid.children);
    // Find the first <div> that isn't the <img>
    const contentDiv = children.find(el => el.tagName === 'DIV');
    if (contentDiv) {
      contentCell = [contentDiv];
    }
  }

  // Compose block table
  const cells = [
    headerRow,
    imgCell,
    contentCell
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}