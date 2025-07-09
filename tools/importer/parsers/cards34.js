/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header
  const headerRow = ['Cards (cards34)'];
  const rows = [];
  // Each card is a top-level <a>
  const cards = Array.from(element.querySelectorAll(':scope > a'));
  cards.forEach(card => {
    // Image: always the first <img> in the card
    const img = card.querySelector('img');
    // The content is all content inside the 'text' area of the card (after image)
    // Find the parent grid/content div (second div inside 'a'),
    // which contains everything except the image
    let textCellContent;
    const innerGrids = card.querySelectorAll(':scope > div');
    if (innerGrids.length > 0) {
      // For robustness, we'll use the div that is NOT the one containing the image (i.e., the second one)
      let foundIndex = 0;
      for (let i = 0; i < innerGrids.length; i++) {
        if (innerGrids[i].querySelector('img')) continue;
        foundIndex = i;
        break;
      }
      textCellContent = innerGrids[foundIndex];
    } else {
      // fallback, if content not structured as expected
      // text is the rest of card minus the img
      textCellContent = document.createElement('div');
      Array.from(card.childNodes).forEach(n => {
        if (n !== img) textCellContent.appendChild(n);
      });
    }
    rows.push([
      img,
      textCellContent
    ]);
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
