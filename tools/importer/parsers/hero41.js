/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: Must match exactly
  const headerRow = ['Hero (hero41)'];

  // Find top-level grid blocks
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;
  const gridChildren = grid.querySelectorAll(':scope > div');

  // Row 2: Background image (optional)
  let bgImage = null;
  for (const div of gridChildren) {
    const img = div.querySelector('img');
    if (img) {
      bgImage = img;
      break;
    }
  }

  // Row 3: text content (title, subheading/paragraph, CTA)
  let contentCellContent = [];
  let contentDiv = null;
  for (const div of gridChildren) {
    if (div.classList.contains('container')) {
      contentDiv = div;
      break;
    }
  }
  if (contentDiv) {
    // Find the main grid inside contentDiv
    const innerGrid = contentDiv.querySelector('.w-layout-grid');
    if (innerGrid) {
      // Title (h1)
      const h1 = innerGrid.querySelector('h1');
      if (h1) contentCellContent.push(h1);
      // Paragraph and button in the .flex-vertical
      const flexVertical = innerGrid.querySelector('.flex-vertical');
      if (flexVertical) {
        // Paragraph
        const para = flexVertical.querySelector('p');
        if (para) contentCellContent.push(para);
        // Button
        const cta = flexVertical.querySelector('a.button');
        if (cta) contentCellContent.push(cta);
      }
    }
  }
  // Fallback for empty content
  if (contentCellContent.length === 0) contentCellContent = [''];

  // Build the table
  const rows = [
    headerRow,
    [bgImage ? bgImage : ''],
    [contentCellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
