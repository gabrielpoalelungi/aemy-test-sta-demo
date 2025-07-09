/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row as in the example (with exact casing)
  const headerRow = ['Cards (cards15)'];
  const cells = [headerRow];

  // Find all direct children <a> (each card)
  const cardLinks = Array.from(element.querySelectorAll(':scope > a'));
  cardLinks.forEach((card) => {
    // Left cell: image element (mandatory)
    let imageEl = null;
    const aspectBox = card.querySelector(':scope > .utility-aspect-2x3');
    if (aspectBox) {
      const img = aspectBox.querySelector('img');
      if (img) imageEl = img;
    }

    // Right cell: group tag(s), date, title (in order)
    const content = [];
    // Tag and date (usually inside a flex row)
    const tagRow = card.querySelector(':scope > .flex-horizontal');
    if (tagRow) {
      // Tag
      const tag = tagRow.querySelector('.tag');
      if (tag) content.push(tag);
      // Date
      const date = tagRow.querySelector('.paragraph-sm');
      if (date) content.push(date);
    }
    // Heading as title (mandatory)
    const heading = card.querySelector('h3, .h4-heading');
    if (heading) content.push(heading);

    // Only add row if image and at least one text element (to avoid empty rows)
    if (imageEl && content.length) {
      cells.push([imageEl, content]);
    }
  });

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
