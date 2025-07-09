/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Carousel (carousel37)'];

  // Get the grid columns (should be 2: left for text, right for images)
  const gridLayout = element.querySelector('.grid-layout');
  if (!gridLayout) return;
  // Get the two direct children: [textCol, imagesCol]
  const gridCols = gridLayout.querySelectorAll(':scope > div');
  if (gridCols.length < 2) return;
  const textCol = gridCols[0];
  const imagesCol = gridCols[1];

  // Get images from imagesCol (all direct child imgs)
  let images = imagesCol.querySelectorAll('img');
  if (!images.length) return;

  // Find the heading, subheading, button group from textCol
  const heading = textCol.querySelector('.h1-heading');
  const subheading = textCol.querySelector('.subheading');
  const btnGroup = textCol.querySelector('.button-group');

  // Compose the cell for the first image (with text and ctas)
  let firstTextCell = null;
  if (heading || subheading || btnGroup) {
    // Use a <div> to wrap content, but reference the actual elements
    const textDiv = document.createElement('div');
    if (heading) textDiv.appendChild(heading);
    if (subheading) textDiv.appendChild(subheading);
    if (btnGroup) textDiv.appendChild(btnGroup);
    firstTextCell = textDiv.childNodes.length === 1 ? textDiv.firstChild : textDiv;
  }

  // Build the rows: one per image. Only the first row gets the text content
  const rows = [headerRow];
  images.forEach((img, idx) => {
    const cells = [img];
    if (idx === 0 && firstTextCell) {
      cells.push(firstTextCell);
    } else if (idx !== 0) {
      cells.push('');
    }
    rows.push(cells);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
