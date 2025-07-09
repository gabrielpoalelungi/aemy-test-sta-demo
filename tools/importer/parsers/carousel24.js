/* global WebImporter */
export default function parse(element, { document }) {
  // Set up the header row exactly as in the example
  const headerRow = ['Carousel (carousel24)'];

  // Find the slide content within the input element
  // The content is nested within several divs; the relevant content is inside .card-body
  let cardBody = element.querySelector('.card-body');

  // Fallback if cardBody is not found
  if (!cardBody) cardBody = element;

  // Find the image (mandatory, first cell)
  let img = cardBody.querySelector('img');

  // For the text cell, look for heading (optional)
  let heading = cardBody.querySelector('.h4-heading, h1, h2, h3, h4, h5, h6');
  let textCellContent = [];
  if (heading) {
    // Preserve heading level if it is a heading tag, otherwise wrap as <h3>
    let headingEl;
    if (/^H[1-6]$/i.test(heading.tagName)) {
      headingEl = heading;
    } else {
      headingEl = document.createElement('h3');
      headingEl.textContent = heading.textContent;
    }
    textCellContent.push(headingEl);
  }
  // No further text content or CTA found in this HTML, but allow for future expansion
  if (textCellContent.length === 0) textCellContent = [''];

  // Each slide is a row: [image, text cell]
  const cells = [
    headerRow,
    [img, textCellContent],
  ];

  // Create the carousel block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
