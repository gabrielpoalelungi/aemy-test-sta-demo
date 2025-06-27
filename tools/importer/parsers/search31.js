/* global WebImporter */
export default function parse(element, { document }) {
  // Block header per example
  const headerRow = ['Search (search31)'];

  // Collect all direct children (preserves all text content & structure, maximum resilience)
  const content = Array.from(element.childNodes);
  // If for some reason there is no content, provide an empty string
  const contentCell = content.length > 0 ? content : [''];

  // Build the cells array as per block guidelines
  const cells = [
    headerRow,
    [contentCell]
  ];

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
