/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches exactly the block name from markdown
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // Get all cards (direct children <a> elements)
  const cardLinks = element.querySelectorAll(':scope > a.card-link');
  cardLinks.forEach((card) => {
    // -----------------
    // FIRST CELL: Image
    // -----------------
    // Find the first <img> in the card for the image cell. If missing, put null.
    let imageEl = null;
    const imgWrapper = card.querySelector('.utility-aspect-3x2');
    if (imgWrapper) {
      imageEl = imgWrapper.querySelector('img');
    }
    // ---------------
    // SECOND CELL: Text content
    // ---------------
    // Use the text content container (includes tag, heading, and paragraph)
    const textContent = card.querySelector('.utility-padding-all-1rem');
    // If missing, handle gracefully
    // Structure a row for this card
    rows.push([
      imageEl || '',
      textContent || ''
    ]);
  });
  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
