/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion19) block header
  const headerRow = ['Accordion (accordion19)'];
  const rows = [];

  // Find the accordion root
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;
  // Find all accordion items (top-level, do not descend recursively)
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  items.forEach((item) => {
    // Title cell: extract the text from the button inside the header
    let titleCell = '';
    const header = item.querySelector('.cmp-accordion__item-header');
    if (header) {
      // The header contains an h3, which contains a button, which is the visible title
      const btn = header.querySelector('button.cmp-accordion__item-button');
      if (btn) {
        // Remove all indicator icons or SVG (visual only)
        [ ...btn.querySelectorAll('.cmp-accordion__item-indicator, svg') ].forEach(e => e.remove());
        // Use only the text content
        titleCell = btn.textContent.trim();
      } else {
        // Fallback: get header text, excluding indicators
        titleCell = header.textContent.trim();
      }
    }

    // Content cell: all visible content in the panel
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // The content is typically inside a .cmp-accordion__item-content div, but sometimes it's direct children
      let itemContent = panel.querySelector('.cmp-accordion__item-content');
      // If not found, fallback to the panel itself
      if (!itemContent) itemContent = panel;
      // Gather all non-empty elements (preserve full blocks, e.g., tables)
      // Only reference existing elements, do NOT clone
      const contentNodes = [];
      itemContent.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.innerHTML.trim()) {
          contentNodes.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Wrap text node in a <span> for safe referencing
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          contentNodes.push(span);
        }
      });
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      } else {
        contentCell = '';
      }
    }

    rows.push([titleCell, contentCell]);
  });

  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);
  element.replaceWith(block);
}
