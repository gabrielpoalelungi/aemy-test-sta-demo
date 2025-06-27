/* global WebImporter */
export default function parse(element, { document }) {
  // Get the inner cmp-content-block
  const block = element.querySelector('.cmp-content-block');
  if (!block) return;

  // Left: all content (eyebrow, headline, description)
  const leftItems = [];
  const content = block.querySelector('.cmp-content-block__content');
  if (content) {
    Array.from(content.children).forEach(child => {
      leftItems.push(child);
    });
  }

  // Right: CTA if it exists and is not empty
  let rightItems = [];
  const ctaBlock = block.querySelector('.cmp-content-block__cta');
  if (ctaBlock && ctaBlock.textContent.trim().length > 0) {
    rightItems.push(ctaBlock);
  }

  // Always create two columns in the second row for structure consistency,
  // but the header row MUST have only one column as per spec.
  const cells = [
    ['Columns (columns24)'],
    [leftItems, rightItems]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
