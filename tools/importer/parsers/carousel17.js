/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout containing the slides
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Collect all slide elements
  const slideDivs = Array.from(grid.children);

  // Build the block cells array
  const cells = [
    ['Carousel (carousel17)']
  ];

  slideDivs.forEach(slideDiv => {
    // Locate the image in each slide
    const img = slideDiv.querySelector('img');
    if (!img) return;
    // As there is no text content in the HTML, second cell is left blank
    cells.push([img, '']);
  });

  // Create the carousel block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
