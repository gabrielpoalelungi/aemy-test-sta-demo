/* global WebImporter */
export default function parse(element, { document }) {
  // Build rows for table
  const rows = [];
  rows.push(['Cards (cards22)']);

  // Find all .w-tab-pane (panes)
  const panes = element.querySelectorAll('.w-tab-pane');
  panes.forEach((pane) => {
    const grid = pane.querySelector('.w-layout-grid');
    if (!grid) return;
    // Each card is an <a> direct child of the grid
    const cards = grid.querySelectorAll('a');
    cards.forEach((card) => {
      // IMAGE: Try for .utility-aspect-3x2 > img, else ''
      let img = null;
      const aspectDiv = card.querySelector('.utility-aspect-3x2');
      if (aspectDiv) {
        img = aspectDiv.querySelector('img');
      }
      // If no image, cell is empty string
      let imgCell = img ? img : '';

      // TEXT: Heading (h3), then paragraph (div.paragraph-sm)
      let heading = card.querySelector('h3, .h4-heading');
      let desc = card.querySelector('.paragraph-sm');
      // Compose as fragment (existing elements), skip nulls
      const cellContent = [];
      if (heading) cellContent.push(heading);
      if (desc) cellContent.push(desc);

      // Support for extra CTA link (not present in sample, but in spec)
      // Only grabs direct descendants to avoid duplication
      let cta = Array.from(card.children).find(el => el.classList && (el.classList.contains('button') || el.classList.contains('cta-link') || el.classList.contains('btn') || el.classList.contains('link')));
      if (cta) cellContent.push(cta);

      // If nothing, cell is empty
      let textCell = cellContent.length ? cellContent : '';
      rows.push([imgCell, textCell]);
    });
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
