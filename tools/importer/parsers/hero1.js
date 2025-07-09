/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero1)'];

  // 2. Second row: Background images - collect all images in the grid
  const gridItems = Array.from(element.querySelectorAll(':scope > div'));
  const images = gridItems.map(div => div.querySelector('img')).filter(Boolean);
  const imagesRow = [images];

  // 3. Third row: No text elements present in the given HTML, so the cell is empty
  const contentRow = [''];

  // 4. Assemble the table
  const cells = [
    headerRow,
    imagesRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
