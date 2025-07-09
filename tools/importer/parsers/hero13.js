/* global WebImporter */
export default function parse(element, { document }) {
  // --- Header row
  const header = ['Hero (hero13)'];

  // --- Row 2: Background Image
  // The background image is the absolute-positioned image
  let bgImg = element.querySelector('img.cover-image.utility-position-absolute');
  if (!bgImg) {
    // Fallback to first image if absolute not found
    bgImg = element.querySelector('img');
  }
  
  // --- Row 3: Main Content (headline, subheading, cta, etc.)
  // This is all the content inside the card
  // It is nested under .container > .card
  let mainContent = null;
  const container = element.querySelector('.container');
  if (container) {
    const card = container.querySelector('.card');
    if (card) {
      mainContent = card;
    } else {
      mainContent = container;
    }
  }

  // Edge case: if none found, fallback to the main element
  if (!mainContent) {
    mainContent = element;
  }

  // --- Build the rows array
  const rows = [
    header,
    [bgImg || ''],
    [mainContent]
  ];

  // --- Create and insert the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
