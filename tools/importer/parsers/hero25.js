/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row, exactly as block name
  const headerRow = ['Hero (hero25)'];

  // 2. Extract the image (background/decorative image)
  // Find the first img anywhere in the section, reference it directly
  const image = element.querySelector('img');

  // 3. Extract the content block (title, paragraph, CTA)
  // Find the innermost grid or section containing the h2 (title)
  let textBlock = null;
  // Find all possible grids
  const grids = element.querySelectorAll(':scope .w-layout-grid');
  for (const grid of grids) {
    if (grid.querySelector('h2')) {
      // The section div inside this grid contains the text + buttons
      textBlock = grid.querySelector('div.section');
      if (textBlock) break;
    }
  }
  // Fallback: if not found, try direct child section
  if (!textBlock) {
    textBlock = element.querySelector('div.section');
  }

  // Defensive: If image or textBlock is missing, still create the structure, but leave cell empty
  const imageCell = image ? [image] : [''];
  const textCell = textBlock ? [textBlock] : [''];

  // 4. Compose the table rows as in block specification: header, image, then text/CTA
  const rows = [
    headerRow,
    imageCell,
    textCell
  ];
  // 5. Create and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
