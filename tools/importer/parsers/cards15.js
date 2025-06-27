/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as defined in the requirements
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Select all items
  const items = element.querySelectorAll(':scope > div');

  items.forEach(item => {
    // Get the image element (reference, not a clone)
    const img = item.querySelector('img');
    // Get the content container
    const content = item.querySelector('.text-image-item__content');
    if (!img || !content) return; // skip if either is missing

    // Get the title div
    const titleDiv = content.querySelector('.text-image-item__title');
    // Get the description div
    const descDiv = content.querySelector('.text-image-item__description');

    // Prepare content cell
    const cellContent = [];
    if (titleDiv) {
      // Use <strong> to match visual emphasis from example
      const strong = document.createElement('strong');
      strong.textContent = titleDiv.textContent.trim();
      cellContent.push(strong);
    }
    if (descDiv) {
      // Keep paragraphs and all structure in description
      Array.from(descDiv.childNodes).forEach(node => {
        if (node.nodeType === 1 || node.nodeType === 3) {
          // Only add element and text nodes
          cellContent.push(node);
        }
      });
    }
    rows.push([img, cellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
