/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the block header
  const headerRow = ['Carousel (carousel12)'];
  // Get all immediate slide container divs
  const slideDivs = Array.from(element.querySelectorAll(':scope > .utility-aspect-1x1'));
  // Each slide: first cell is the <img> element, second cell is blank (no text in provided HTML)
  const rows = slideDivs.map(div => {
    const img = div.querySelector('img');
    return [img, ''];
  });
  // Compose table data
  const cells = [headerRow, ...rows];
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
