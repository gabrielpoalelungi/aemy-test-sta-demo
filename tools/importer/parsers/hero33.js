/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row exactly as specified
  const headerRow = ['Hero (hero33)'];

  // Find the .container inside the section
  const container = element.querySelector('.container');
  let imgEl = null;
  let textBlock = null;

  if (container) {
    // Find the .grid-layout (the layout grid for this block)
    const grid = container.querySelector('.grid-layout');
    if (grid) {
      // The image and text block are both immediate children of .grid-layout
      const children = Array.from(grid.children);
      imgEl = children.find(child => child.tagName === 'IMG');
      textBlock = children.find(child => child !== imgEl);
    }
  }

  // Prepare the image row (row 2)
  const imageRow = [imgEl ? imgEl : ''];

  // Prepare the text row (row 3)
  const textRow = [textBlock ? textBlock : ''];

  // Compose the table data array
  const tableRows = [
    headerRow,
    imageRow,
    textRow
  ];

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with our block table
  element.replaceWith(table);
}
