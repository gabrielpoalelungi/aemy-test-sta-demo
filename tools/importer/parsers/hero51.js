/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Reference only direct children where needed
  // 1. Find headline: .cmp-content-block__headline (typically an <h2>)
  const headline = element.querySelector('.cmp-content-block__headline');

  // 2. Find any CTA (call-to-action) (ignore for now, as none in this case)

  // 3. Find the detailed text (description) that appears in the right column in the screenshot
  // This is inside .cmp-section > .aem-Grid > .cmp-text
  const mainText = element.querySelector('.cmp-text');

  // 4. Background image: none in this case, so leave the cell blank
  // Row 1: Table header, must exactly match the example
  const headerRow = ['Hero'];
  // Row 2: Background image cell (empty string as in the example)
  const imageRow = [''];
  // Row 3: Cell containing headline and main text as siblings (preserve order)
  const contentArr = [];
  if (headline) contentArr.push(headline);
  if (mainText) contentArr.push(mainText);
  // If both are missing, insert empty string to avoid empty cell
  if (contentArr.length === 0) contentArr.push('');

  const cells = [
    headerRow,
    imageRow,
    [contentArr],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
