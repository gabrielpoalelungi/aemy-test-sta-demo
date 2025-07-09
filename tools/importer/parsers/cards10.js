/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row exactly as in the example
  const cells = [['Cards (cards10)']];

  // Get the image grid and all images for the cards
  const imageGrid = element.querySelector('.grid-layout.desktop-3-column');
  const images = imageGrid ? Array.from(imageGrid.querySelectorAll('img')) : [];

  // Get the hero text content area
  const heroContent = element.querySelector('.container.small-container');
  let heading = null, description = null, ctas = [];
  if (heroContent) {
    heading = heroContent.querySelector('h1, h2, h3, h4, h5, h6');
    description = heroContent.querySelector('p');
    ctas = Array.from(heroContent.querySelectorAll('a'));
  }

  // For each image, create a row: [image, text content (only on first card)]
  images.forEach((img, idx) => {
    let textCell = '';
    if (idx === 0) {
      // Only the first card gets the heading, description, and any CTAs
      const content = [];
      if (heading) content.push(heading);
      if (description) content.push(description);
      if (ctas.length) {
        // Group CTAs in a div to keep them together, as shown visually
        const ctaDiv = document.createElement('div');
        ctaDiv.append(...ctas);
        content.push(ctaDiv);
      }
      textCell = content.length === 1 ? content[0] : content;
    }
    cells.push([
      img,
      textCell
    ]);
  });

  // Replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
