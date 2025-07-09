/* global WebImporter */
export default function parse(element, { document }) {
  // Header must be a single-cell row with the block name
  const headerRow = ['Columns (columns39)'];

  // Each column is a direct child div
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each column div, use its main content (here: the image)
  const contentRow = columnDivs.map(div => {
    const img = div.querySelector('img');
    if (img) return img;
    return div; // fallback in case there is no image
  });

  // Build the table structure according to the block rules
  const rows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
