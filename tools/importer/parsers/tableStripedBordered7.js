/* global WebImporter */
export default function parse(element, { document }) {
  // The example expects a single-column block table with header 'Table (striped, bordered)'
  // and all visible content from the block in the second row.

  // Collect all visible text content from within the element
  // (skip hidden elements for resilience)
  function getVisibleText(el) {
    // Only include text from visible elements
    if (el.nodeType === Node.TEXT_NODE) {
      return el.textContent;
    }
    if (el.nodeType === Node.ELEMENT_NODE) {
      const style = window.getComputedStyle ? window.getComputedStyle(el) : null;
      if (style && (style.display === 'none' || style.visibility === 'hidden')) {
        return '';
      }
      // Ignore script/style elements
      if (["SCRIPT","STYLE","NOSCRIPT"].includes(el.tagName)) return '';
      let text = '';
      for (const child of el.childNodes) {
        text += getVisibleText(child);
      }
      return text;
    }
    return '';
  }
  const allText = getVisibleText(element).replace(/\s+/g, ' ').trim();
  const cells = [
    ['Table (striped, bordered)']
  ];
  if (allText) {
    cells.push([allText]);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}