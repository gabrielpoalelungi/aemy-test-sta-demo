/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Prepare table header matching the markdown example
  const headerRow = ['Hero'];

  // Step 2: Image extraction (2nd row)
  let imageCell = '';
  // Find the main <img> in the hero block (preferably inside .cmp-article-header__img-container or similar)
  const imageContainer = element.querySelector('.cmp-article-header__img-container, .leadImage, .cmp-image');
  let img = null;
  if (imageContainer) {
    img = imageContainer.querySelector('img');
  }
  if (!img) {
    img = element.querySelector('img');
  }
  if (img) imageCell = img;

  // Step 3: Gather content for the 3rd row
  // This should be ALL text content after the image, including headings, time, and paragraphs beneath headline
  const contentParts = [];

  // Get any headline container
  const headlineContainer = element.querySelector('.headline');
  if (headlineContainer) {
    // Push all children that are block or have text
    Array.from(headlineContainer.children).forEach(child => {
      if (child.textContent.trim()) contentParts.push(child);
    });
  }

  // Add time/date if present
  const dateTime = element.querySelector('time');
  if (dateTime) contentParts.push(dateTime);

  // Add all non-empty paragraphs (excluding eyebrow/empty)
  Array.from(element.querySelectorAll('p')).forEach(p => {
    if (!p.classList.contains('cmp-article-header___eyebrow') && p.textContent.trim()) {
      // Only push if not already present
      if (!contentParts.includes(p)) contentParts.push(p);
    }
  });

  // Add any extra text in .text or .cmp-text elements
  Array.from(element.querySelectorAll('.text, .cmp-text')).forEach(block => {
    if (block.textContent.trim() && !contentParts.includes(block)) {
      contentParts.push(block);
    }
  });

  // Edge case: If contentParts is still empty, fall back to all h1-h6
  if (!contentParts.length) {
    Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach(h => {
      if (h.textContent.trim()) contentParts.push(h);
    });
  }

  // Step 4: Create the table rows (header, image, content)
  const tableRows = [
    headerRow,
    [imageCell],
    [contentParts]
  ];

  // Step 5: Create the table using the helper and replace the original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
