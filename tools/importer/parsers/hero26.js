/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner section with two columns (image and content)
  const innerSection = element.querySelector('section.elementor-inner-section');
  let leftCol, rightCol;
  if (innerSection) {
    const cols = innerSection.querySelectorAll(':scope > .elementor-container > .elementor-column');
    leftCol = cols[0];
    rightCol = cols[1];
  }

  // Row 2: Background Image (optional)
  // Try to find an image in the left column if exists
  let backgroundImg = '';
  if (leftCol) {
    // Check for img
    const img = leftCol.querySelector('img');
    if (img) {
      backgroundImg = img;
    }
  }
  const row2 = [backgroundImg || ''];

  // Row 3: Title, subheading, text, price/list and CTA from rightCol
  let content = [];
  if (rightCol) {
    // Add all heading widgets (could be span or h3, etc)
    rightCol.querySelectorAll('.elementor-widget-heading .elementor-widget-container > *').forEach(el => content.push(el));
    // Add all paragraphs inside text editors
    rightCol.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container > *').forEach(el => content.push(el));
    // Add icon list (for price/info)
    const iconList = rightCol.querySelector('.elementor-widget-icon-list ul');
    if (iconList) content.push(iconList);
    // Add button (CTA)
    const cta = rightCol.querySelector('.elementor-widget-button .elementor-button-wrapper');
    if (cta) content.push(cta);
  }
  const row3 = [content];

  // Table header as in the markdown example
  const headerRow = ['Hero'];

  const cells = [headerRow, row2, row3];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
