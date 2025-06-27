/* global WebImporter */
export default function parse(element, { document }) {
  // Find the icons/cards section in the provided HTML
  const iconsBlock = element.querySelector('.icons-block-item');
  if (!iconsBlock) return;
  const cardsWrapper = iconsBlock.querySelector('.icons-block-item__icons');
  if (!cardsWrapper) return;
  const cardEls = Array.from(cardsWrapper.querySelectorAll(':scope > .icon-item'));

  // Prepare the header row as in the example
  const rows = [['Cards (cards20)']];

  cardEls.forEach(cardEl => {
    // First cell: the icon image (can be null)
    const img = cardEl.querySelector('img');

    // Second cell: Heading and description/content
    const title = cardEl.querySelector('.icon-item__title');
    const content = cardEl.querySelector('.icon-item__content');
    const textCell = [];
    if (title) textCell.push(title);
    if (content) textCell.push(content);
    rows.push([
      img,
      textCell.length === 1 ? textCell[0] : textCell
    ]);
  });

  // Build and replace the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}