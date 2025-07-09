/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as required
  const headerRow = ['Cards (cards39)'];

  // Locate the outer container (.container) and the main grid
  const container = element.querySelector('.container');
  if (!container) return;
  const mainGrid = container.querySelector('.grid-layout');
  if (!mainGrid) return;

  // Helper: recursively collect all card anchor blocks (a.utility-link-content-block),
  // even if they are nested inside grid-layouts
  function collectCardAnchors(gridElem) {
    const cards = [];
    gridElem.childNodes.forEach(node => {
      if (node.nodeType === 1 && node.classList.contains('utility-link-content-block')) {
        cards.push(node);
      } else if (node.nodeType === 1 && node.classList.contains('grid-layout')) {
        cards.push(...collectCardAnchors(node));
      }
    });
    return cards;
  }

  // Gather all card elements (anchor blocks)
  const cards = collectCardAnchors(mainGrid);
  if (!cards.length) return;

  // For each card, extract [image, text content] columns
  const rows = cards.map(card => {
    // Find image: look for a child div.utility-aspect-2x3 or .utility-aspect-1x1 with an <img>
    let imgWrap = card.querySelector('.utility-aspect-2x3, .utility-aspect-1x1');
    let image = null;
    if (imgWrap) {
      image = imgWrap.querySelector('img');
    }

    // For text: get heading (h2/h3/h4), description (first <p>), CTA (button, .button, etc.)
    const fragments = [];
    const heading = card.querySelector('h2, h3, h4, h5, h6');
    if (heading) fragments.push(heading);
    const desc = card.querySelector('p');
    if (desc) fragments.push(desc);
    // Call-to-action: .button (may be e.g. <div class="button">Explore</div>)
    const cta = card.querySelector('.button, .button-like');
    if (cta) fragments.push(cta);
    // If no heading, description, or CTA: fallback to blank
    let textCell;
    if (fragments.length === 1) {
      textCell = fragments[0];
    } else if (fragments.length > 1) {
      // Combine in a <div>, preserving order
      const div = document.createElement('div');
      fragments.forEach(frag => div.appendChild(frag));
      textCell = div;
    } else {
      textCell = document.createTextNode('');
    }
    // Provide image cell (may be null if missing image in card)
    return [image, textCell];
  });

  // Compose the final block table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
