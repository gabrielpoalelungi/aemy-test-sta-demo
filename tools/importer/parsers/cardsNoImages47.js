/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Cards (cardsNoImages47)'];
  const cells = [headerRow];

  // Find the cards in the HTML structure
  const itemsContainer = element.querySelector('.cmp-grid-container__items');
  if (!itemsContainer) return;

  // Each ".download" inside this is a card
  const downloads = itemsContainer.querySelectorAll('.download');
  downloads.forEach(download => {
    // The semantic card is the inner .cmp-download
    const card = download.querySelector('.cmp-download');
    if (card) {
      // We'll use the <h3> (with <a>) as is, since the card is just a heading with a link, no description
      // This preserves the heading and the link, as seen in the source HTML
      const h3 = card.querySelector('h3');
      if (h3) {
        // Reference the existing element
        cells.push([h3]);
      }
    }
  });

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
