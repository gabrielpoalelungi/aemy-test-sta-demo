/* global WebImporter */
export default function parse(element, { document }) {
  // Block header exactly as in the example
  const headerRow = ['Accordion (accordion6)'];

  // Find the accordion widget within the element
  const accordionWidget = element.querySelector('.elementor-widget-accordion');
  if (!accordionWidget) return;

  // Find the accordion container with all items
  const accordionContainer = accordionWidget.querySelector('.elementor-accordion');
  if (!accordionContainer) return;

  // Extract all accordion items (each is a row)
  const items = Array.from(accordionContainer.querySelectorAll(':scope > .elementor-accordion-item'));
  const rows = items.map(item => {
    // Title cell: use the <a class="elementor-accordion-title"> if present for semantics
    let titleCell = '';
    const titleWrap = item.querySelector('.elementor-tab-title');
    if (titleWrap) {
      const titleLink = titleWrap.querySelector('.elementor-accordion-title');
      titleCell = titleLink ? titleLink : titleWrap.textContent.trim();
    }

    // Content cell: use all child elements of .elementor-tab-content (retaining original elements)
    let contentCell = '';
    const contentWrap = item.querySelector('.elementor-tab-content');
    if (contentWrap) {
      if (contentWrap.children.length === 1) {
        contentCell = contentWrap.firstElementChild;
      } else if (contentWrap.children.length > 1) {
        contentCell = Array.from(contentWrap.children);
      } else {
        // fallback to textContent for empty containers
        contentCell = contentWrap.textContent.trim();
      }
    }
    return [titleCell, contentCell];
  });

  // Compose the table for the block
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
