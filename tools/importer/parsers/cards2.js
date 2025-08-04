/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];
  // Select all card links
  const cards = element.querySelectorAll(':scope > a');
  cards.forEach(card => {
    // Get the image (first img inside the first child div)
    let img = null;
    const aspectDiv = card.querySelector('div.utility-aspect-2x3');
    if (aspectDiv) {
      img = aspectDiv.querySelector('img');
    }
    // Get the meta (tag/date)
    const metaDiv = card.querySelector('.flex-horizontal');
    // Get the heading (title)
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');

    // Compose text cell content
    const cellContent = [];
    if (metaDiv && metaDiv.textContent.trim()) cellContent.push(metaDiv);
    if (heading && heading.textContent.trim()) cellContent.push(heading);

    // If neither meta nor heading, prevent empty cell
    let textCell;
    if (cellContent.length === 1) {
      textCell = cellContent[0];
    } else if (cellContent.length > 1) {
      textCell = cellContent;
    } else {
      // Fallback: maybe there's still some text content
      textCell = card.textContent.trim() ? card.textContent.trim() : '';
    }

    rows.push([
      img ? img : '',
      textCell
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
