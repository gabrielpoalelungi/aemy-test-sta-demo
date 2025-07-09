/* global WebImporter */
export default function parse(element, { document }) {
  // Create Header Row
  const headerRow = ['Carousel (carousel38)'];

  // Identify the two main grid columns
  const gridColumns = element.querySelectorAll('.w-layout-grid > div');

  // Handle text content (first grid column)
  let textContent = [];
  if (gridColumns.length > 0) {
    const leftCol = gridColumns[0];
    // Heading
    const heading = leftCol.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textContent.push(heading);
    // Paragraph (subheading)
    const para = leftCol.querySelector('p');
    if (para) textContent.push(para);
    // CTA Buttons
    const btnGroup = leftCol.querySelector('.button-group');
    if (btnGroup) textContent.push(btnGroup);
  }

  // Handle images (second grid column)
  let images = [];
  if (gridColumns.length > 1) {
    // Find the nested grid containing images
    const nestedGrid = gridColumns[1].querySelector('.w-layout-grid');
    if (nestedGrid) {
      images = Array.from(nestedGrid.querySelectorAll('img'));
    }
  }

  // Compose table rows: each slide is a row (image + text for first, just image for others)
  const rows = images.map((img, idx) => {
    if (idx === 0) {
      // First row: image + text content (array of elements)
      return [img, textContent];
    } else {
      // Other rows: image only, no text
      return [img, ''];
    }
  });

  // If no images found, skip table creation
  if (!images.length) return;

  // Final table array
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
