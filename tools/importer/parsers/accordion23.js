/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block. There may be multiple widgets; we pick the correct one.
  const accordionWidget = element.querySelector('.elementor-widget-accordion .elementor-widget-container .elementor-accordion');
  if (!accordionWidget) return;

  // Build header row as in the example
  const rows = [['Accordion (accordion23)']];

  // Each accordion item becomes a row
  const items = accordionWidget.querySelectorAll(':scope > .elementor-accordion-item');
  items.forEach(item => {
    // Title cell: get the a.elementor-accordion-title (use element)
    let titleEl = item.querySelector('.elementor-tab-title .elementor-accordion-title');
    let titleCell = titleEl ? titleEl : '';
    // Content cell: container div
    let contentDiv = item.querySelector('.elementor-tab-content');
    let contentCell = '';
    if (contentDiv) {
      // If there are child elements, preserve structure; otherwise, use text
      if (contentDiv.childNodes.length > 0) {
        // Array of nodes (Elements and text nodes) except comments
        contentCell = Array.from(contentDiv.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
        // If only whitespace text nodes, fallback to textContent
        if (contentCell.length === 0) {
          contentCell = contentDiv.textContent.trim();
        }
      } else {
        contentCell = contentDiv.textContent.trim();
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
