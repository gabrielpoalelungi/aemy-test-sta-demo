/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches example exactly
  const headerRow = ['Hero (hero14)'];

  // Row 2: Background image (optional)
  // Look for image tag as direct descendant of any child div
  let bgImg = null;
  const imgs = element.querySelectorAll('img');
  for (const img of imgs) {
    // In this block, a background should be a main image, not decorative
    if (
      img.classList.contains('cover-image') ||
      img.getAttribute('alt') ||
      img.getAttribute('src')
    ) {
      bgImg = img;
      break;
    }
  }
  const backgroundRow = [bgImg ? bgImg : ''];

  // Row 3: Title, subheading, CTA (the main content)
  // Grab the .container block, which includes all heading+button content
  let contentCell = '';
  const containers = element.querySelectorAll(':scope > .w-layout-grid > div');
  let contentDiv = null;
  for (const div of containers) {
    if (div.classList.contains('container')) {
      contentDiv = div;
      break;
    }
  }
  if (contentDiv) {
    contentCell = contentDiv;
  }

  const contentRow = [contentCell];

  // Compose the table and replace
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
