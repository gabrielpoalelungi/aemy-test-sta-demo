/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: find the first image in the block
  function findImageEl(el) {
    // Find a .cmp-image img inside element
    const img = el.querySelector('.cmp-image img');
    return img || '';
  }

  // Helper: collect content block (headline, description, CTA)
  function getContentBlockContent(el) {
    if (!el) return '';
    const content = [];
    // Headline
    const headline = el.querySelector('.cmp-content-block__headline');
    if (headline) content.push(headline);
    // Description (may have nested .cmp-text)
    const desc = el.querySelector('.cmp-content-block__description .cmp-text');
    if (desc) {
      // Add all its children (paragraphs, links, etc.)
      content.push(...Array.from(desc.childNodes).filter(n => {
        return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
      }));
    }
    // CTA (button)
    const cta = el.querySelector('.cmp-content-block__cta .cmp-button');
    if (cta) content.push(cta);
    return content.length ? content : '';
  }

  // Find the grid items container
  let grid = element.querySelector('.cmp-grid-container__items .aem-Grid');
  // Fallback if not found
  if (!grid) grid = element;

  // Try to find both .image and .content-block columns
  const imageCol = grid.querySelector('.image') || grid.querySelector('.cmp-image');
  const contentCol = grid.querySelector('.content-block') || grid.querySelector('.cmp-content-block');

  // Extract image and content
  const imageEl = imageCol ? findImageEl(imageCol) : '';
  // For content block, support referencing .cmp-content-block even if no .content-block column
  let contentBlock = null;
  if (contentCol && contentCol.classList.contains('cmp-content-block')) {
    contentBlock = contentCol;
  } else if (contentCol) {
    contentBlock = contentCol.querySelector('.cmp-content-block');
  } else {
    contentBlock = grid.querySelector('.cmp-content-block');
  }
  const contentEls = getContentBlockContent(contentBlock);

  // Build the table as per the example
  const cells = [
    ['Hero'],
    [imageEl],
    [contentEls]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
