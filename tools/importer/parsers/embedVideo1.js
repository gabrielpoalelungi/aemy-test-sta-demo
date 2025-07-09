/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row
  const headerRow = ['Embed'];

  // Find all <img> elements that are direct or indirect descendants of the block
  const images = Array.from(element.querySelectorAll('img'));

  // The Embed block expects: images (as poster(s)), and/or a video/link (which is not present here)
  // Only images exist in the provided HTML, so place them all in the content cell
  // Reference the existing image elements directly (no cloning)
  const cellContent = images.length === 1 ? images[0] : images;

  const rows = [headerRow, [cellContent]];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
