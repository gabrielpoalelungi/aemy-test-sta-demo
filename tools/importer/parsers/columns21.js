/* global WebImporter */
export default function parse(element, { document }) {
  // Find the nav block that contains the tabs
  const navContainer = element.querySelector('.page-tab-navigation');
  if (!navContainer) return;
  const nav = navContainer.querySelector('nav');
  if (!nav) return;
  // Each tab is a <li> containing an <a>
  const ul = nav.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');
  // Each column is the <a> element inside the <li> (reference the actual element)
  const columns = lis.map(li => {
    const a = li.querySelector('a');
    return a || '';
  });
  // Block table: header row is one cell, then one row with each column as a cell
  const cells = [
    ['Columns (columns21)'],
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
