/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Select all card elements
  const cardElements = element.querySelectorAll('.teaser-item');
  cardElements.forEach((card) => {
    // The image for the card
    const img = card.querySelector('img');
    // The card text content
    let textContent = card.querySelector('.teaser-item__desc');
    // Fallback if .teaser-item__desc is not present
    if (!textContent) {
      textContent = card.querySelector('.teaser-item__content');
    }
    if (!textContent) {
      // fallback to the card itself (should not happen for this structure)
      textContent = document.createElement('div');
    }
    rows.push([
      img,
      textContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
