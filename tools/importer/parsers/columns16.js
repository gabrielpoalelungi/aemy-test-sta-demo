/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Columns (columns16)'];

  // 2. Get the main columns grid (two columns: title/eyebrow and summary/author/cta)
  const sectionContainer = element.querySelector(':scope > .container');
  if (!sectionContainer) return;
  const topGrid = sectionContainer.querySelector(':scope > .w-layout-grid.grid-layout.tablet-1-column');
  if (!topGrid) return;

  // Get the two columns in the top grid
  const topGridCols = topGrid.querySelectorAll(':scope > div');
  if (topGridCols.length < 2) return;
  const leftCol = topGridCols[0]; // eyebrow + h1
  const rightCol = topGridCols[1]; // summary, author, button

  // 3. Get the images grid (two columns of images)
  const imageGrid = sectionContainer.querySelector('.w-layout-grid.grid-layout.mobile-portrait-1-column');
  if (!imageGrid) return;
  const imageCells = Array.from(imageGrid.querySelectorAll(':scope > div'));
  // Defensive: only take first two images in case of extra
  const imagesRow = imageCells.slice(0, 2);

  // 4. Build the block table
  const rows = [
    headerRow,
    [leftCol, rightCol],
    imagesRow
  ];
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace the original element
  element.replaceWith(block);
}
