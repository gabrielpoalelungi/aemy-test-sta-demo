/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards19)'];
  // Get all direct '.teaser-item' elements (the cards)
  const cardEls = element.querySelectorAll(':scope > .swiper-wrapper > .teaser-item');
  const rows = [headerRow];
  cardEls.forEach((card) => {
    // First cell: image (as element)
    const img = card.querySelector('img');
    // Second cell: card text content (as element)
    // Defensive: if textContainer is missing, use an empty div
    let textContainer = card.querySelector('.teaser-item__desc');
    if (!textContainer) {
      textContainer = document.createElement('div');
    }
    rows.push([img, textContainer]);
  });
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
