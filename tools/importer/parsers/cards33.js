/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cards33)'];

  // Each card: direct children with .utility-aspect-1x1 (contain an img)
  const cardDivs = element.querySelectorAll(':scope > .utility-aspect-1x1');

  // For each card, extract the image element. No text content is present in source.
  // Per block structure, image goes in first cell, second cell remains empty
  const rows = Array.from(cardDivs).map(cardDiv => {
    const img = cardDiv.querySelector('img');
    return [img, ''];
  });

  // Build the block table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
