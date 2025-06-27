/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, exactly as required
  const cells = [
    ['Accordion (accordion32)'],
  ];

  // Find the accordion container
  const accordion = element.querySelector('[data-cmp-is="accordion"]');
  if (!accordion) return;

  // Get all accordion item wrappers
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // 1. Extract the title: should be a <strong> containing the visible button text
    let titleCell = '';
    const headerBtn = item.querySelector('.cmp-accordion__item-header button');
    if (headerBtn) {
      // Remove indicator (SVGs) from the button
      const btnContentNodes = Array.from(headerBtn.childNodes).filter(n => n.nodeType === 3 || (n.nodeType === 1 && n.tagName !== 'DIV'));
      // Join text nodes (preserves sub-elements if ever present)
      const strong = document.createElement('strong');
      strong.textContent = btnContentNodes.map(n => n.textContent).join('').trim();
      titleCell = strong;
    }
    // 2. Extract the content: preserve the rich content as in the source
    let contentCell = '';
    const contentPanel = item.querySelector('.cmp-accordion__item-content');
    if (contentPanel) {
      // Find all cmp-text blocks inside contentPanel
      const textBlocks = contentPanel.querySelectorAll('.cmp-text');
      if (textBlocks.length > 0) {
        // contentCell is array of each cmp-text div (referenced directly)
        contentCell = Array.from(textBlocks);
      } else {
        // If no cmp-text, find all direct children with meaningful content
        const nonEmptyChildren = Array.from(contentPanel.children).filter(child => child.textContent.trim().length > 0);
        contentCell = nonEmptyChildren.length > 0 ? nonEmptyChildren : contentPanel;
      }
    }
    // Add the row only if both cells have content
    if (titleCell && contentCell) {
      cells.push([titleCell, contentCell]);
    }
  });
  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
