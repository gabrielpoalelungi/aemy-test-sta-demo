/* global WebImporter */
export default function parse(element, { document }) {
  // Find the navigation tab list
  const nav = element.querySelector('nav');
  if (!nav) return;
  const ul = nav.querySelector('ul');
  if (!ul) return;

  // Get all immediate li elements
  const lis = Array.from(ul.children).filter(li => li.matches('li'));

  // For each li, get the link or active tab
  const columns = lis.map(li => {
    const a = li.querySelector('a');
    if (!a) return '';
    if (!a.hasAttribute('href')) {
      // If it's the active tab (no href), use a <span> with the text
      const span = document.createElement('span');
      span.textContent = a.textContent.trim();
      return span;
    }
    // Otherwise, use the original link element
    return a;
  });

  // Header row: single cell as required by the block spec
  const headerRow = ['Columns (columns26)'];

  // Compose the rows array: header row, then a single row with all columns as cells
  const cells = [headerRow, columns];

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
