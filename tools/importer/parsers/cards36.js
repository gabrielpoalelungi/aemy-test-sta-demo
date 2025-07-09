/* global WebImporter */
export default function parse(element, { document }) {
  // Because the example markdown and description specify 2 columns per card row (image, then text),
  // and the block expects this structure even if the second column is empty (for images-only),
  // we maintain two columns per row, with the second cell left empty.
  // This aligns with the block's layout for consistent downstream processing and CSS expectations.
  const headerRow = ['Cards (cards36)'];
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  // Create a row per card: image in first cell, blank in second cell
  const cardRows = cardDivs.map(div => [div.querySelector('img'), '']);
  const rows = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}