/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid that contains the columns
  const grid = element.querySelector('.cmp-grid-container__items > .aem-Grid');
  if (!grid) return;

  // Get the two column elements
  let leftCol = null;
  let rightCol = null;
  for (const col of grid.children) {
    if (col.querySelector('.cmp-content-block')) leftCol = col;
    if (col.querySelector('.cmp-image')) rightCol = col;
  }

  // Left column content
  let leftContent = [];
  if (leftCol) {
    const contentBlock = leftCol.querySelector('.cmp-content-block');
    if (contentBlock) {
      const heading = contentBlock.querySelector('.cmp-content-block__headline');
      if (heading) leftContent.push(heading);
      const desc = contentBlock.querySelector('.cmp-content-block__description');
      if (desc) {
        desc.querySelectorAll('p').forEach(p => {
          if (p.textContent.trim()) leftContent.push(p);
        });
      }
      const cta = contentBlock.querySelector('.cmp-content-block__cta a.cmp-button');
      if (cta) leftContent.push(cta);
    }
  }
  if (leftContent.length === 0) leftContent = '';
  else if (leftContent.length === 1) leftContent = leftContent[0];

  // Right column content
  let rightContent = '';
  if (rightCol) {
    const cmpImage = rightCol.querySelector('.cmp-image');
    if (cmpImage) {
      const img = cmpImage.querySelector('img');
      if (img) rightContent = img;
    }
  }

  // The table must have a 1-cell header row, then a 2-cell content row
  const cells = [
    ['Columns (columns46)'],
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
