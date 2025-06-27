/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate columns (Elementor structure)
  const columnEls = Array.from(element.querySelectorAll(':scope > div > div'));
  // For each column, extract the image box wrapper or fallback to column
  const contentCells = columnEls.map((col) => {
    const wrapper = col.querySelector('.elementor-image-box-wrapper');
    if (wrapper) return wrapper;
    return col;
  });
  // The table structure: header row (single cell), content row (one per column)
  const rows = [
    ['Columns (columns15)'],
    contentCells
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
