/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by spec
  const headerRow = ['Cards (cards35)'];
  // Each card is a div.utility-aspect-1x1 containing an image only.
  // To structurally match the example (always two columns: image, text),
  // we must always produce two columns, the second cell being empty if there's no text.
  const cards = Array.from(element.querySelectorAll(':scope > .utility-aspect-1x1'));
  const rows = cards.map(card => {
    const img = card.querySelector('img');
    // Always two columns: first is image, second is empty (since no text present)
    return [img, ''];
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
