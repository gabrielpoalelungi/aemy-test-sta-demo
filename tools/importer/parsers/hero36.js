/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: Block name exactly as in the prompt
  const headerRow = ['Hero (hero36)'];

  // 2. Second row: Background image (none in this HTML example)
  const bgImageRow = [''];

  // 3. Third row: Title, Subheading, and Call-to-Action
  //    All text and CTA are inside the grid-layout > first div (text) and the <a> (CTA)
  //    Structure: <div class="w-layout-grid ..."><div><h2>...</h2><p>...</p></div><a>...</a></div>

  const grid = element.querySelector('.grid-layout');
  let contentArr = [];
  if (grid) {
    // Text container is usually the first child div, CTA is the <a>
    const children = Array.from(grid.children);
    const textDiv = children.find(child => child.tagName === 'DIV');
    const ctaLink = children.find(child => child.tagName === 'A');
    if (textDiv) contentArr.push(textDiv);
    if (ctaLink) contentArr.push(ctaLink);
  } else {
    // fallback: use all element content
    contentArr.push(element);
  }

  // Final content for row 3: either single node or array
  const mainContentRow = [contentArr.length === 1 ? contentArr[0] : contentArr];

  // Compose final table
  const cells = [
    headerRow,
    bgImageRow,
    mainContentRow
  ];

  // Create block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
