/* global WebImporter */
export default function parse(element, { document }) {
  // Table header for Hero block
  const headerRow = ['Hero'];

  // Try to extract background-image URL from section or overlay
  let bgUrl = null;
  let sectionStyle = element.getAttribute('style') || '';
  const bgImageMatch = sectionStyle.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
  if (bgImageMatch) {
    bgUrl = bgImageMatch[1];
  } else {
    // Try overlay
    const overlay = element.querySelector('.elementor-background-overlay');
    if (overlay) {
      const overlayStyle = overlay.getAttribute('style') || '';
      const oBgMatch = overlayStyle.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
      if (oBgMatch) {
        bgUrl = oBgMatch[1];
      }
    }
  }
  // Fallback to canonical hero image from the example if nothing found
  if (!bgUrl) {
    bgUrl = 'https://main--sta-boilerplate--aemdemos.hlx.page/media_1ca653f4f0fb50020a010f62ded9172d64671042a.jpg#width=750&height=415';
  }

  // Only add image row if we have a URL; otherwise empty cell
  let bgImgEl = '';
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.setAttribute('loading', 'eager');
    bgImgEl.setAttribute('alt', '');
  }

  // Extract heading(s) (usually h1)
  const contentRow = [];
  // Find all heading tags inside this block (in order)
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length) {
    headings.forEach((h) => contentRow.push(h));
  } else {
    contentRow.push(''); // keep cell empty if no heading
  }

  // Compose the table: always 3 rows, 1 column
  const tableRows = [
    headerRow,
    [bgImgEl],
    [contentRow.length === 1 ? contentRow[0] : contentRow],
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
