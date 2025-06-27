/* global WebImporter */
export default function parse(element, { document }) {
  // The block is a single table, one header row, one content row, one column, all text content included.

  // Get the two main columns
  const columns = element.querySelectorAll(':scope > div > div');

  // Container for all content in visual order (left then right)
  const contentEls = [];

  columns.forEach(col => {
    const widgetWrap = col.querySelector('.elementor-widget-wrap');
    if (widgetWrap) {
      // For each heading widget (could be <p> or <div> for text)
      widgetWrap.querySelectorAll('.elementor-widget-heading').forEach(widget => {
        const container = widget.querySelector('.elementor-widget-container');
        if (container) {
          // Typically the heading is <p> or <div>
          const title = container.querySelector('.elementor-heading-title');
          if (title) {
            contentEls.push(title);
          }
        }
      });
    }
  });

  // Defensive: If no content, skip replacing
  if (!contentEls.length) return;

  const table = WebImporter.DOMUtils.createTable([
    ['Embed'],
    [contentEls]
  ], document);

  element.replaceWith(table);
}
