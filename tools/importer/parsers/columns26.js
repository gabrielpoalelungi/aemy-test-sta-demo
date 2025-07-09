/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const headerRow = ['Columns (columns26)'];

  // This grid has 6 direct children (in order):
  // 1. Tennis court cool (img + text)
  // 2. Beach day energy (img + text)
  // 3. Adventure spots (img)
  // 4. Night out sparkle (img + text)
  // 5. Music fans at concert (img)
  // 6. Live music event (img)

  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Helper to extract cell content: image + text if present, else image
  function extractContent(child) {
    const img = child.querySelector('img');
    const textBox = child.querySelector('.utility-padding-all-2rem');
    if (img && textBox) {
      // Return both, in order (image, then text)
      return [img, textBox];
    } else if (img) {
      return img;
    } else if (textBox) {
      return textBox;
    } else {
      return child;
    }
  }

  // The columns layout is 3 columns per row
  // Build second row (first content row): children[0], children[1], children[2]
  // Build third row (second content row): children[3], children[4], children[5]
  const row1 = [];
  const row2 = [];
  for (let i = 0; i < 3; i++) {
    if (children[i]) row1.push(extractContent(children[i]));
  }
  for (let i = 3; i < 6; i++) {
    if (children[i]) row2.push(extractContent(children[i]));
  }

  // The table matches the example: header, 1st row, 2nd row
  const tableCells = [headerRow, row1, row2];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
