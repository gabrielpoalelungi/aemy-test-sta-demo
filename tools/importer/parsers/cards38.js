/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example: 'Cards (cards38)'
  const headerRow = ['Cards (cards38)'];
  // Find the container holding all cards
  const container = element.querySelector('.container');
  if (!container) return;
  // Gather all card elements (utility-link-content-block)
  // Need to handle nested grids as in provided HTML
  let allCards = [];
  // Get all .w-layout-grid in container
  const grids = container.querySelectorAll(':scope > .w-layout-grid');
  for (const grid of grids) {
    // Add direct card links from this grid
    const directCards = Array.from(grid.querySelectorAll(':scope > a.utility-link-content-block'));
    allCards.push(...directCards);
    // Look for any nested grids and add card links from them
    const nestedGrids = grid.querySelectorAll(':scope > .w-layout-grid');
    for (const subgrid of nestedGrids) {
      const nestedCards = Array.from(subgrid.querySelectorAll(':scope > a.utility-link-content-block'));
      allCards.push(...nestedCards);
    }
  }
  // Compose table rows: each card gets [image, text block]
  const rows = [headerRow];
  allCards.forEach(card => {
    // image: first <img> inside card (inside aspect-ratio div)
    let img = card.querySelector('img');
    // text: Compose array of heading, description, CTA if present
    let textContent = [];
    // Find first heading (h2/h3/h4 with possible custom classes)
    let heading = card.querySelector('h2, h3, h4, .h2-heading, .h4-heading');
    if (heading) textContent.push(heading);
    // Description: first <p>
    let desc = card.querySelector('p');
    if (desc) textContent.push(desc);
    // CTA: div.button (keep div as is, do not convert to link, per requirements)
    let cta = card.querySelector('.button');
    if (cta) textContent.push(cta);
    // If nothing, leave empty cell
    if (textContent.length === 0) textContent = [''];
    rows.push([img, textContent.length === 1 ? textContent[0] : textContent]);
  });
  // Create the cards table and replace original block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
