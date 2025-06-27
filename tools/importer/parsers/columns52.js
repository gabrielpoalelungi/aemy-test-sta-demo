/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container with the cards
  const itemsContainer = element.querySelector('.cmp-grid-container__items');
  if (!itemsContainer) return;

  // Find all teaser cards directly inside the grid
  const teasers = Array.from(itemsContainer.querySelectorAll(':scope > .aem-Grid > .teaser'));
  if (!teasers.length) return;

  // For each teaser, extract the anchor for the title
  const teaserLinks = teasers.map(teaser => {
    // Grab the <a> inside the h4 title, if it exists
    const link = teaser.querySelector('.cmp-teaser__title a');
    return link ? link : '';
  });

  // We want 2 columns per row as in the screenshot
  const columnsPerRow = 2;
  const contentRows = [];
  for (let i = 0; i < teaserLinks.length; i += columnsPerRow) {
    contentRows.push([
      teaserLinks[i] || '',
      teaserLinks[i + 1] || ''
    ]);
  }

  // Compose the table: header first, then rows
  const cells = [
    ['Columns (columns52)'],
    ...contentRows
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
