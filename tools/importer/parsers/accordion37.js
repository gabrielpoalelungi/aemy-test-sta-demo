/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block within the element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Collect all accordion items
  const items = Array.from(accordion.querySelectorAll(':scope > .cmp-accordion__item'));

  // Compose the block table, with the correct header
  const rows = [
    ['Accordion (accordion37)'],
  ];

  items.forEach(item => {
    // Title cell
    const headerButton = item.querySelector('.cmp-accordion__item-header button');
    let titleCell;
    if (headerButton) {
      // Remove indicator icons in-place from the button (reference, not clone)
      const indicator = headerButton.querySelector('.cmp-accordion__item-indicator');
      if (indicator) indicator.remove();
      titleCell = headerButton;
    } else {
      titleCell = '';
    }
    // Content cell
    let contentCell;
    const contentPanel = item.querySelector('.cmp-accordion__item-content');
    if (contentPanel) {
      // Find all direct .cmp-text blocks in content (reference, not clone)
      const textBlocks = Array.from(contentPanel.querySelectorAll('.cmp-text'));
      if (textBlocks.length > 0) {
        contentCell = textBlocks.length === 1 ? textBlocks[0] : textBlocks;
      } else {
        // If no text blocks, take all children (reference, not clone)
        const children = Array.from(contentPanel.children).filter(n => n.nodeType === 1);
        contentCell = children.length === 1 ? children[0] : children;
      }
    } else {
      contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  // Create and replace with the new block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
