/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must EXACTLY match the example
  const rows = [['Cards (cards23)']];

  // Find all .cmp-teaser elements (each is a card)
  const teasers = element.querySelectorAll('.cmp-teaser');

  teasers.forEach((teaser) => {
    // First cell: the card image (or empty string if not found)
    let imageCell = '';
    const img = teaser.querySelector('img');
    if (img) imageCell = img;

    // Second cell: card text content (title + description)
    // Retain semantics: use heading and description if present, or fallback to any content in .cmp-teaser__content
    let textCellContent = [];
    const contentRoot = teaser.querySelector('.cmp-teaser__content') || teaser;

    // Title
    const title = contentRoot.querySelector('.cmp-teaser__title');
    if (title) {
      // Use the full heading element (usually h4)
      textCellContent.push(title);
    }
    // Description (may not exist)
    const desc = contentRoot.querySelector('.cmp-teaser__description');
    if (desc) {
      // Use all child nodes to preserve <p> etc
      desc.childNodes.forEach((node) => textCellContent.push(node));
    }

    // If neither title nor description, fallback to all content children
    if (textCellContent.length === 0) {
      Array.from(contentRoot.childNodes).forEach((node) => {
        if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
          textCellContent.push(node);
        }
      });
    }

    rows.push([imageCell, textCellContent]);
  });

  // Create and replace with the Cards table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
