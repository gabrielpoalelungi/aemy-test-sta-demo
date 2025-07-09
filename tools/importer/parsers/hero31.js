/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required (exactly matches the block name)
  const headerRow = ['Hero (hero31)'];

  // This example has no background image, so provide empty cell for row 2
  const bgImageRow = [''];

  // Extract the main content container (grid)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // The content for the third row is the main heading and the rich text block
  // Get heading (h2.h1-heading)
  const heading = grid.querySelector('h2.h1-heading');
  // Get the description paragraphs (rich text, all p's inside)
  const richText = grid.querySelector('.rich-text');

  // Compose content array for the cell
  const cellContent = [];
  if (heading) cellContent.push(heading);
  if (richText) cellContent.push(richText);
  if (cellContent.length === 0) cellContent.push('');

  const contentRow = [cellContent];

  // Compose the table data
  const cells = [
    headerRow,
    bgImageRow,
    contentRow
  ];

  // Create and replace the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
