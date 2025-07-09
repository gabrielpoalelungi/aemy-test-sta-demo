/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find all direct children of the grid
  const cards = Array.from(element.querySelectorAll(':scope > div'));

  cards.forEach((card) => {
    // Find the first img inside this card
    const img = card.querySelector('img');

    // Find a text container: look for a div that contains an h3 or p
    // If not found, look for h3 or p themselves
    let textContainer = null;
    // Try to find a div that contains either h3 or p
    let textDiv = card.querySelector('div:has(h3), div:has(p)');
    if (textDiv) {
      textContainer = textDiv;
    } else {
      // fallback: see if there's h3 or p at all
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (h3 && p && h3.parentElement !== p.parentElement) {
        const frag = document.createElement('div');
        frag.appendChild(h3);
        frag.appendChild(p);
        textContainer = frag;
      } else if (h3) {
        textContainer = h3;
      } else if (p) {
        textContainer = p;
      }
    }

    // Only push rows for cards that have both img and text content
    if (img && textContainer) {
      rows.push([img, textContainer]);
    }
  });

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
