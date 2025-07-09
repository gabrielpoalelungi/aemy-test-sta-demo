/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for block table (must match exactly)
  const headerRow = ['Hero (hero7)'];

  // Block expects a 3-row, 1-column table:
  // Row 1: Block name header
  // Row 2: Background image (none present, so empty)
  // Row 3: Content (heading, subheading/paragraph, CTA)

  // --- Row 2 (background image) ---
  const imageRow = ['']; // No background image in provided HTML

  // --- Row 3 (content) ---
  // Find: heading, subheading/text, call-to-action
  // The layout is two columns in a grid: first column = h2, second column = text+button
  const grid = element.querySelector('.grid-layout');
  let content = [];
  if (grid) {
    // Capture all direct children of the grid in order:
    // Usually: h2, then a div containing text & button
    const children = Array.from(grid.children);
    for (const child of children) {
      // For h2, just append
      if (child.tagName.toLowerCase() === 'h2') {
        content.push(child);
      } else {
        // For other divs, append all their children (e.g., paragraph and CTA)
        content.push(...Array.from(child.children));
      }
    }
  }
  // Defensive: if no grid, fallback to all element children
  if (content.length === 0) {
    content = Array.from(element.children);
  }

  const contentRow = [content];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
