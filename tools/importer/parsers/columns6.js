/* global WebImporter */
export default function parse(element, { document }) {
  // Find gridContainer that holds the columns
  const gridContainer = element.querySelector('.cmp-grid-container__items > .aem-Grid');
  let col1 = null;
  let col2 = null;

  if (gridContainer) {
    const children = Array.from(gridContainer.children);
    // Expecting two children, one with class 'image', one with class 'content-block'
    col1 = children.find((el) => el.classList.contains('image'));
    col2 = children.find((el) => el.classList.contains('content-block'));
  }

  // Fallback for unexpected HTML structure
  if (!col1 || !col2) {
    const allDivs = Array.from(element.querySelectorAll('.cmp-grid-container__items > .aem-Grid > div'));
    col1 = col1 || allDivs[0] || document.createElement('div');
    col2 = col2 || allDivs[1] || document.createElement('div');
  }

  // Compose the table with exactly one header cell in the header row
  const cells = [
    ['Columns (columns6)'], // one header cell spanning columns
    [col1, col2]            // one row with two columns
  ];
  
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
