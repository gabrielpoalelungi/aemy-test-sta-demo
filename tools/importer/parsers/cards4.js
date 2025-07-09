/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child nodes of the grid
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(el => el.matches(selector));
  }

  const headerRow = ['Cards (cards4)'];
  const rows = [];

  // Locate grid container for cards
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // 1. Large left card (main feature)
  const cardLinks = getDirectChildren(grid, 'a.utility-link-content-block');
  if (cardLinks.length > 0) {
    const card = cardLinks[0];
    // Image (first child div containing img)
    const imgDiv = card.querySelector('div[class*="aspect"]');
    const img = imgDiv ? imgDiv.querySelector('img') : null;
    // Text content (tag group, heading, paragraph)
    const textEls = [];
    // Tag
    const tagGroup = card.querySelector('.tag-group');
    if (tagGroup) textEls.push(tagGroup);
    // Heading
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textEls.push(heading);
    // Paragraph
    const para = card.querySelector('p');
    if (para) textEls.push(para);
    rows.push([
      img || '',
      textEls
    ]);
  }

  // 2. Right column: two smaller image cards (Sport, Beach)
  // These are inside the first .flex-horizontal.flex-vertical.flex-gap-sm
  const flexGroups = grid.querySelectorAll(':scope > .flex-horizontal.flex-vertical.flex-gap-sm');
  if (flexGroups.length > 0) {
    const imageCards = flexGroups[0].querySelectorAll(':scope > a.utility-link-content-block');
    imageCards.forEach(card => {
      const imgDiv = card.querySelector('div[class*="aspect"]');
      const img = imgDiv ? imgDiv.querySelector('img') : null;
      const textEls = [];
      // Tag
      const tagGroup = card.querySelector('.tag-group');
      if (tagGroup) textEls.push(tagGroup);
      // Heading
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) textEls.push(heading);
      // Paragraph
      const para = card.querySelector('p');
      if (para) textEls.push(para);
      rows.push([
        img || '',
        textEls
      ]);
    });
  }

  // 3. Right-most column: text-only cards (Party after dark, etc)
  if (flexGroups.length > 1) {
    const textCards = flexGroups[1].querySelectorAll(':scope > a.utility-link-content-block');
    textCards.forEach(card => {
      const textEls = [];
      // Heading
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) textEls.push(heading);
      // Paragraph
      const para = card.querySelector('p');
      if (para) textEls.push(para);
      rows.push([
        '',
        textEls
      ]);
    });
  }

  // Compose table and replace original element
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
