/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards1) block: 2 columns, header row, each card is a row
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  // The teaser cards are .cmp-teaser (NOT .teaser)
  // But some wrappers may have both classes
  // We'll get all .cmp-teaser as direct/descendant of the root .aem-Grid
  const teaserCards = Array.from(
    element.querySelectorAll('.cmp-teaser')
  );

  teaserCards.forEach((teaser) => {
    // Image cell: find the first <img> inside .cmp-teaser__image
    let imgCell = '';
    const imgWrapper = teaser.querySelector('.cmp-teaser__image');
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }

    // Text cell: prefer just the heading (with link if present)
    // The heading could be h4, h5, etc.
    let textCell;
    const content = teaser.querySelector('.cmp-teaser__content');
    if (content) {
      const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
      // Only put the heading itself (with link if present)
      if (heading) {
        textCell = heading;
      } else {
        // Fallback: use full content div if heading absent
        textCell = content;
      }
    } else {
      textCell = '';
    }
    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
