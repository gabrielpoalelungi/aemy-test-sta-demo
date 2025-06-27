/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate columns
  const columns = element.querySelectorAll(':scope > div > div.elementor-column');
  // Background images: all <img> in the right column (second column)
  let bgImgs = [];
  if (columns.length > 1) {
    const rightCol = columns[1];
    bgImgs = Array.from(rightCol.querySelectorAll('img'));
  }

  // Content: headline, subheading, CTA in the left column (first column)
  let textContent = [];
  if (columns.length > 0) {
    const leftCol = columns[0];
    // Headline (h1)
    const h1 = leftCol.querySelector('h1');
    if (h1) textContent.push(h1);
    // Subheading (any .elementor-widget-text-editor > .elementor-widget-container)
    const subheads = leftCol.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container');
    subheads.forEach(sh => textContent.push(sh));
    // CTA (button or link)
    const cta = leftCol.querySelector('a.elementor-button');
    if (cta) textContent.push(cta);
  }

  // Build the block table
  const cells = [];
  cells.push(['Hero']); // header row EXACTLY as in example
  if (bgImgs.length > 0) {
    cells.push([bgImgs]); // second row: background images, as array of elements
  } else {
    cells.push(['']);
  }
  if (textContent.length > 0) {
    cells.push([textContent]); // third row: content array
  } else {
    cells.push(['']);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
