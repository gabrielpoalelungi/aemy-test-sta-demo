/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row must exactly match the example
  const headerRow = ['Hero (hero6)'];

  // Find the grid layout direct children
  const gridLayout = element.querySelector(':scope > .w-layout-grid');
  const gridDivs = gridLayout ? gridLayout.querySelectorAll(':scope > div') : [];

  // --- Row 2: Background image ---
  let backgroundImg = '';
  if (gridDivs.length > 0) {
    const img = gridDivs[0].querySelector('img');
    if (img) backgroundImg = img;
  }
  const bgImgRow = [backgroundImg];

  // --- Row 3: Content (heading, subheading, CTA) ---
  let contentCell = [];
  if (gridDivs.length > 1) {
    // The card contains all text/buttons
    const card = gridDivs[1].querySelector('.card');
    if (card) {
      // Heading (use the first heading in card)
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) contentCell.push(heading);
      // Subheading (find subheading class, else first p that isn't in button group)
      let subheading = card.querySelector('.subheading');
      if (!subheading) {
        // fallback: first p not in .button-group
        const paragraphs = Array.from(card.querySelectorAll('p'));
        subheading = paragraphs.find(p => !p.closest('.button-group'));
      }
      if (subheading) contentCell.push(subheading);
      // CTAs (all <a> inside the button group)
      const buttonGroup = card.querySelector('.button-group');
      if (buttonGroup) {
        const ctas = Array.from(buttonGroup.querySelectorAll('a'));
        if (ctas.length > 0) contentCell.push(...ctas);
      }
    }
  }
  const contentRow = [contentCell.length > 0 ? contentCell : ''];

  // Compose the block table
  const cells = [
    headerRow,
    bgImgRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
