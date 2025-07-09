/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the columns
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;
  // Get direct children of the grid (columns)
  const columns = Array.from(grid.children);
  // We expect two main columns: left (info, contacts), right (image)

  // Identify which child is the contact info block (should be a <ul>) and which is the image
  let leftBlock = null; // Contains the heading/subheading/contacts
  let contactsList = null;
  let imageBlock = null;
  // Find <ul> (contacts list), <img> (image), the rest (headings/text)
  for (const c of columns) {
    if (c.tagName === 'UL') {
      contactsList = c;
    } else if (c.tagName === 'IMG') {
      imageBlock = c;
    } else {
      leftBlock = c;
    }
  }

  // Build left column: leftBlock (eyebrow, h2, subheading) + contacts list
  const leftColumn = [];
  if (leftBlock) leftColumn.push(leftBlock);
  if (contactsList) leftColumn.push(contactsList);
  // Build right column: image
  const rightColumn = imageBlock ? [imageBlock] : [];

  // Compose the columns row
  const headerRow = ['Columns (columns19)'];
  const contentRow = [leftColumn, rightColumn];
  const cells = [ headerRow, contentRow ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
