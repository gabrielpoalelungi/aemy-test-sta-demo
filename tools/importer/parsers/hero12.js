/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section with .hero-banner-image
  const section = element.querySelector('.hero-banner-image');

  // Find the background image (from inline style and the <img>)
  let bgImgUrl = '';
  if (section && section.style && section.style.backgroundImage) {
    const bg = section.style.backgroundImage;
    const match = bg.match(/url\(['"]?([^'"]+)['"]?\)/i);
    if (match) bgImgUrl = match[1];
  }
  let imgElem = section ? section.querySelector('img') : null;
  // Prefer the image element if present
  let heroImage = null;
  if (imgElem && imgElem.src) {
    heroImage = imgElem;
  } else if (bgImgUrl) {
    // create an img element (in extremely rare case)
    heroImage = document.createElement('img');
    heroImage.src = bgImgUrl;
    heroImage.alt = '';
  }

  // Get content: title, description
  const textBlock = section ? section.querySelector('.hero-banner-image__text') : null;
  // Compose all text elements (h1, paragraph, etc)
  const contentElements = [];
  if (textBlock) {
    const title = textBlock.querySelector('.hero-banner-image__title');
    if (title) {
      // Convert to <h1> for Hero heading
      const h1 = document.createElement('h1');
      h1.innerHTML = title.innerHTML;
      contentElements.push(h1);
    }
    const desc = textBlock.querySelector('.hero-banner-image__desc');
    if (desc) {
      Array.from(desc.children).forEach(node => contentElements.push(node)); // Reference existing <p>
    }
  }

  // Build the table structure: 1 column, 3 rows; header is EXACTLY 'Hero' (without formatting)
  const cells = [
    ['Hero'],
    [heroImage ? heroImage : ''],
    [contentElements.length ? contentElements : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
