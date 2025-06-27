/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check for the container
  const container = element.querySelector('.container');
  if (!container) return;

  // We expect two children: content and image wrapper
  const children = container.querySelectorAll(':scope > div');
  if (children.length < 2) return;

  // First child: left column (text/button)
  const leftCol = children[0];
  // Second child: right column (image)
  const rightCol = children[1];

  // For the left column, include all of its content (title, text, button)
  // For the right column, just the img (if present)
  let imageEl = rightCol.querySelector('img');
  // If no img, keep the rightCol (could contain other content)
  const rightColContent = imageEl ? imageEl : rightCol;

  // Build the header row: first cell with text, second cell empty (matches number of columns)
  const headerRow = ['Columns (columns23)', ''];

  // Build the table: header, then one row with two columns
  const cells = [
    headerRow,
    [leftCol, rightColContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
