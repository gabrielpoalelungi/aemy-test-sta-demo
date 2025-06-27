/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find direct children with a class
  function findGridColumns(grid) {
    return Array.from(grid.children).filter(child => child.classList.contains('aem-GridColumn'));
  }

  // 1. Identify the columns of this block
  const items = element.querySelector('.cmp-grid-container__items');
  if (!items) return;
  const grid = items.querySelector('.aem-Grid');
  if (!grid) return;
  const columns = findGridColumns(grid);

  let leftCol = null, rightCol = null;
  columns.forEach(col => {
    if (col.querySelector('.cmp-content-block')) {
      leftCol = col;
    } else if (col.querySelector('.cmp-image')) {
      rightCol = col;
    }
  });
  if (!leftCol && columns.length > 0) leftCol = columns[0];
  if (!rightCol && columns.length > 1) rightCol = columns[1];

  let leftContent = [];
  if (leftCol) {
    const block = leftCol.querySelector('.cmp-content-block');
    if (block) {
      const headline = block.querySelector('.cmp-content-block__headline');
      if (headline && headline.textContent.trim()) leftContent.push(headline);
      const description = block.querySelector('.cmp-content-block__description');
      if (description && description.textContent.trim()) leftContent.push(description);
      const cta = block.querySelector('.cmp-content-block__cta');
      if (cta && cta.textContent.trim()) leftContent.push(cta);
    } else if (leftCol.textContent.trim()) {
      leftContent.push(leftCol);
    }
  }

  let rightContent = [];
  if (rightCol) {
    const imgBlock = rightCol.querySelector('.cmp-image');
    if (imgBlock) {
      rightContent.push(imgBlock);
    } else if (rightCol.textContent.trim()) {
      rightContent.push(rightCol);
    }
  }

  // The correct structure: header row with 1 column, then a row with N columns (here 2)
  const headerRow = ['Columns (columns9)'];
  const secondRow = [
    leftContent.length === 1 ? leftContent[0] : leftContent,
    rightContent.length === 1 ? rightContent[0] : rightContent
  ];
  const tableRows = [headerRow, secondRow];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
