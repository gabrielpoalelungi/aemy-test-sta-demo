/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the example
  const headerRow = ['Hero (hero40)'];

  // Find the background image (the first img.cover-image inside element)
  let bgImg = element.querySelector('img.cover-image');
  // Fallback to first img if no cover-image found
  if (!bgImg) bgImg = element.querySelector('img');
  // Only add the element reference if it exists
  const imageRow = [bgImg ? bgImg : ''];

  // Find the container holding the text and cta
  const container = element.querySelector('.container');
  // Robustly find the grid that holds content, fallback to container
  let contentGrid = null;
  if (container) {
    contentGrid = container.querySelector('.w-layout-grid') || container;
  }

  // Collect block content: heading, paragraph, cta button
  const contentParts = [];
  if (contentGrid) {
    // Heading (usually h1)
    const heading = contentGrid.querySelector('h1');
    if (heading) contentParts.push(heading);
    // Paragraph (usually the description)
    const paragraph = contentGrid.querySelector('p');
    if (paragraph) contentParts.push(paragraph);
    // CTA button (usually an <a> in button-group)
    const cta = contentGrid.querySelector('.button-group a, a.button, a.w-button');
    if (cta) contentParts.push(cta);
  }
  // If nothing found, fallback to the container itself (should be rare)
  const contentRow = [contentParts.length ? contentParts : (container ? container : '')];

  // Build the table
  const cells = [
    headerRow,  // 1st row: block name
    imageRow,   // 2nd row: background image (optional)
    contentRow  // 3rd row: main content (headings, paragraph, CTA)
  ];

  // Create and insert the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
