/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table Header
  const headerRow = ['Hero (hero6)'];

  // 2. Background Image: find first <img> descendant of the grid's image area
  let bgImg = null;
  const gridDivs = element.querySelectorAll(':scope > div.w-layout-grid > div');
  for (const div of gridDivs) {
    const img = div.querySelector('img');
    if (img) {
      bgImg = img;
      break;
    }
  }
  const bgImgRow = [bgImg ? bgImg : ''];

  // 3. Content: headline, subheading, ctas
  let contentRow = [''];
  for (const div of gridDivs) {
    const card = div.querySelector('.card');
    if (card) {
      const content = [];
      const h1 = card.querySelector('h1');
      if (h1) content.push(h1);
      const subheading = card.querySelector('p.subheading');
      if (subheading) content.push(subheading);
      const btnGroup = card.querySelector('.button-group');
      if (btnGroup) content.push(btnGroup);
      // Only add if there is content
      if (content.length) contentRow = [content];
      break;
    }
  }

  // 4. Assemble table
  const cells = [headerRow, bgImgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
