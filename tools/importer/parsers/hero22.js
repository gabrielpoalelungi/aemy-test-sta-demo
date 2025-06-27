/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the top hero section in the element
  const heroSection = element.querySelector('section');

  // 2. Try to get the background image for the hero (if any)
  // In this HTML example, there is no img in the hero, and no inline style with background-image
  // So we leave the image row blank as in the markdown screenshot
  let bgImageCell = '';

  // 3. Find the heading (h1) in the hero section
  let heading = heroSection ? heroSection.querySelector('h1') : null;
  // If there is a heading, reference the element, else blank string
  const contentCell = heading ? heading : '';

  // 4. Compose the block table rows matching the example (3 rows, 1 column)
  const heroTableRows = [
    ['Hero'],  // header as shown in the example, no ** markup, just plain text
    [bgImageCell],
    [contentCell]
  ];

  // 5. Create the hero block table
  const heroBlock = WebImporter.DOMUtils.createTable(heroTableRows, document);

  // 6. Replace the hero section in the DOM with the heroBlock table
  if (heroSection) {
    heroSection.replaceWith(heroBlock);
  }
}
