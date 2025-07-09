/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row (matches example exactly)
  const headerRow = ['Hero (hero10)'];

  // 2. Background images row: gather all <img> in the image grid
  const imageGrid = element.querySelector('.ix-hero-scale-3x-to-1x .grid-layout');
  let images = [];
  if (imageGrid) {
    images = Array.from(imageGrid.querySelectorAll('img'));
  }
  // All images in one cell, as array
  const imagesRow = [images];

  // 3. Content row: headline, subheading, and CTA(s)
  const contentContainer = element.querySelector('.ix-hero-scale-3x-to-1x-content .container');
  let content = [];
  if (contentContainer) {
    // Find heading (always h1 for this hero)
    const heading = contentContainer.querySelector('h1');
    if (heading) content.push(heading);
    // Find subheading, usually a p
    const subheading = contentContainer.querySelector('p');
    if (subheading) content.push(subheading);
    // Find all CTAs (all <a> in .button-group)
    const buttonGroup = contentContainer.querySelector('.button-group');
    if (buttonGroup) {
      const buttons = Array.from(buttonGroup.querySelectorAll('a'));
      if (buttons.length) content.push(...buttons);
    }
  }
  const contentRow = [content];

  // Compose the table structure
  const cells = [headerRow, imagesRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}