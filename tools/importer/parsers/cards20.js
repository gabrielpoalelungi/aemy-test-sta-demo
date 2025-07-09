/* global WebImporter */
export default function parse(element, { document }) {
  // Header should match exactly
  const headerRow = ['Cards (cards20)'];
  // Get all card wrapper divs (immediate children)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  const rows = cardDivs.map(card => {
    // Icon cell: find .icon and take the SVG (reference, not clone)
    let iconCell = '';
    const iconWrapper = card.querySelector('.icon');
    if (iconWrapper) {
      const svg = iconWrapper.querySelector('svg');
      if (svg) {
        iconCell = svg;
      } else {
        iconCell = iconWrapper;
      }
    }
    // Text cell: in this markup, it's just the <p>, but if more, collect all direct text elements (headings, paragraphs)
    const textParts = [];
    // Heading (optional, not present in this HTML, so we only search for <p>)
    const p = card.querySelector('p');
    if (p) textParts.push(p);
    // If no <p>, cell will be empty but still filled
    const textCell = textParts.length ? textParts : '';
    return [iconCell, textCell];
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
