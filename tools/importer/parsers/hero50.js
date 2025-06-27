/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all direct grids (for robustness)
  const grids = element.querySelectorAll('.aem-Grid');

  // Find the image element
  let imgEl = null;
  if (grids.length > 0) {
    imgEl = grids[grids.length - 1].querySelector('img');
  }
  if (!imgEl) {
    imgEl = element.querySelector('img');
  }

  // Get the content block: headline and description
  const contentBlock = element.querySelector('.cmp-content-block__content');
  let headings = [];
  let paragraphs = [];
  if (contentBlock) {
    // Get all heading elements (h1-h6)
    headings = Array.from(contentBlock.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    // Description paragraphs
    const desc = contentBlock.querySelector('.cmp-content-block__description');
    if (desc) {
      paragraphs = Array.from(desc.querySelectorAll('p'));
    } else {
      paragraphs = Array.from(contentBlock.querySelectorAll('p'));
    }
  }

  // Edge case: no headings or paragraphs, provide empty content
  const contentDiv = document.createElement('div');
  // Add headings with <br> between them if multiple
  headings.forEach((heading, idx) => {
    contentDiv.appendChild(heading);
    if (idx < headings.length - 1 || paragraphs.length > 0) {
      contentDiv.appendChild(document.createElement('br'));
    }
  });
  // Add paragraphs with <br> between them if multiple
  paragraphs.forEach((p, idx) => {
    contentDiv.appendChild(p);
    if (idx < paragraphs.length - 1) {
      contentDiv.appendChild(document.createElement('br'));
    }
  });
  // If nothing, ensure empty div is used

  // Compose table rows as per the example: header, image, content
  const rows = [
    ['Hero'],
    [imgEl ? imgEl : ''],
    [contentDiv],
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Section Metadata: none in the example, so do NOT add
  // Replace the original element with the table
  element.replaceWith(table);
}
