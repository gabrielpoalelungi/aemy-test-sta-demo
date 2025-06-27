/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column containers (should be 4 for columns5)
  const columnContainers = Array.from(element.querySelectorAll(':scope > div > div'));

  // Create one cell per column, each cell containing the relevant content from that column
  const colCells = columnContainers.map((col) => {
    // Find the elementor-widget-wrap (the direct content holder)
    const widgetWrap = col.querySelector('.elementor-widget-wrap');
    if (!widgetWrap) return '';
    // Collect all widgets (skip script/link)
    const widgets = Array.from(widgetWrap.children).filter(child =>
      child.nodeType === 1 && child.tagName !== 'SCRIPT' && child.tagName !== 'LINK'
    );
    // For each widget, reference its .elementor-widget-container if present, otherwise itself
    const content = widgets.map(widget => {
      const container = widget.querySelector('.elementor-widget-container');
      return container ? container : widget;
    });
    // Flatten: if only one content, return just it, else array
    if (content.length === 1) return content[0];
    if (content.length === 0) return '';
    return content;
  });

  // Table header, as specified (block name and variant)
  const headerRow = ['Columns (columns5)'];
  const tableRows = [
    headerRow,
    colCells
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
