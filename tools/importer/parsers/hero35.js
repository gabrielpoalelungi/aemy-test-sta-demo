/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the block name header (must be 'Hero')
  const headerRow = ['Hero'];

  // 2. Background image row: this example has none, so second row is empty string
  const imageRow = [''];

  // 3. Content row: heading and all text content that follows
  // Try to find the heading
  let heading = element.querySelector('.cmp-content-block__headline');

  // Get text content (all <p> inside .cmp-text)
  let textDiv = element.querySelector('.cmp-text');
  let textEls = [];
  if (textDiv) {
    // Only take element nodes (e.g., <p>), as text nodes likely just whitespace
    textEls = Array.from(textDiv.children).filter(el => el.tagName === 'P' && (el.textContent && el.textContent.trim()));
  }

  // Compose cell: heading element (if exists), then all <p> elements in order
  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...textEls);

  // 4. Compose and create the table
  const cells = [
    headerRow,
    imageRow,
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the block
  element.replaceWith(table);
}
