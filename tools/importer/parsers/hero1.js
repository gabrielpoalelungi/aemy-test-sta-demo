/* global WebImporter */
export default function parse(element, { document }) {
  // Get both columns (image and content columns)
  const columns = Array.from(element.querySelectorAll(':scope > .elementor-container > .elementor-column'));

  // Row 2: Image (if present)
  let imageElem = null;
  if (columns.length > 0) {
    imageElem = columns[0].querySelector('img');
  }

  // Row 3: Content (all heading, paragraphs, lists, cta, etc.)
  let contentParts = [];
  if (columns.length > 1) {
    // Find all widget containers in the right column (handles varied order/structure)
    const wrap = columns[1].querySelector('.elementor-widget-wrap');
    if (wrap) {
      Array.from(wrap.children).forEach(widget => {
        const container = widget.querySelector('.elementor-widget-container');
        if (container) {
          // For each container, push all its childNodes (preserves elements and text, avoids missing text)
          Array.from(container.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              contentParts.push(node);
            } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              // Wrap non-empty text nodes in a <span>
              const span = document.createElement('span');
              span.textContent = node.textContent;
              contentParts.push(span);
            }
          });
        }
      });
    }
  }

  // Build the table: 1 column, 3 rows
  const cells = [
    ['Hero'],
    [imageElem ? imageElem : ''],
    [contentParts]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
