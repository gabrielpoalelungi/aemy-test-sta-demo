/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must match the guideline exactly
  const headerRow = ['Hero (hero37)'];
  // Get the .grid-layout container for main content
  const grid = element.querySelector('.grid-layout');
  let title = null, subheading = null, cta = null;
  if (grid) {
    const children = grid.querySelectorAll(':scope > *');
    // Left cell - heading and subheading
    if (children.length > 0) {
      const left = children[0];
      // Find the first heading (any level)
      title = left.querySelector('h1, h2, h3, h4, h5, h6');
      // Find the first p or subheading (prefer .subheading class)
      subheading = left.querySelector('p.subheading, .subheading, p');
    }
    // Right cell - CTA (look for a link directly)
    if (children.length > 1) {
      const right = children[1];
      if (right.tagName.toLowerCase() === 'a') {
        cta = right;
      } else {
        // Fallback: Look for a link in this element
        cta = right.querySelector('a');
      }
    }
    // Fallback: If no CTA found in right, look for a link in left
    if (!cta && children.length > 0) {
      const left = children[0];
      cta = left.querySelector('a');
    }
  } else {
    // Fallback if grid missing: search in element
    title = element.querySelector('h1, h2, h3, h4, h5, h6');
    subheading = element.querySelector('p.subheading, .subheading, p');
    cta = element.querySelector('a');
  }
  // No background image present in this example, so leave row 2 empty
  const backgroundRow = [''];
  // Construct content row for row 3
  const content = [];
  if (title) content.push(title);
  if (subheading && subheading !== title) content.push(subheading);
  if (cta) content.push(cta);
  const contentRow = [content];
  // Compose table cells
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
