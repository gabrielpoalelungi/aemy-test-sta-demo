/* global WebImporter */
export default function parse(element, { document }) {
  // Find the active tab (visible content)
  const activeTab = element.querySelector('.w-tab-pane.w--tab-active');
  if (!activeTab) return;

  // Find the main content grid in the active tab
  const grid = activeTab.querySelector('.w-layout-grid');
  if (!grid) return;

  // Find the first image in the grid (background image for hero)
  const img = grid.querySelector('img') || '';

  // Gather all content elements except images
  // This will capture all headings, paragraphs, CTAs, etc., in order
  const contentNodes = Array.from(grid.children).filter(child => child.tagName !== 'IMG');
  let content;
  if (contentNodes.length === 0) {
    content = '';
  } else if (contentNodes.length === 1) {
    content = contentNodes[0];
  } else {
    content = contentNodes;
  }

  // Build table as specified: 1 column, 3 rows
  const cells = [
    ['Hero (hero23)'],
    [img],
    [content]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
