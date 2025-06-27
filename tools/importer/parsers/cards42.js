/* global WebImporter */
export default function parse(element, { document }) {
  // Cards are .teaser.cmp-teaser--product-card inside cmp-grid-container__items
  const cardContainer = element.querySelector('.cmp-grid-container__items');
  if (!cardContainer) return;
  const cards = Array.from(cardContainer.querySelectorAll('.teaser.cmp-teaser--product-card'));

  // Header
  const rows = [['Cards (cards42)']];

  cards.forEach(card => {
    // Image: should be the <img> under .cmp-teaser__image
    const img = card.querySelector('.cmp-teaser__image img');
    const imgCell = img ? img : '';

    // Text cell
    const textCellEls = [];
    // Title: <h4 class="cmp-teaser__title"><span>...</span></h4>
    const titleH = card.querySelector('.cmp-teaser__content .cmp-teaser__title');
    if (titleH) textCellEls.push(titleH);

    // No description in this markup
    // CTA link: <a class="cmp-button">
    const ctaLink = card.querySelector('.cmp-teaser__teaser-actions a.cmp-button');
    if (ctaLink) {
      // Use only the text, not the icons
      const ctaText = ctaLink.querySelector('.cmp-button__text');
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.textContent = ctaText ? ctaText.textContent : ctaLink.textContent;
      if (ctaLink.target) link.target = ctaLink.target;
      if (ctaLink.rel) link.rel = ctaLink.rel;
      // Add line break only if something else is above
      if (textCellEls.length > 0) textCellEls.push(document.createElement('br'));
      textCellEls.push(link);
    }
    rows.push([imgCell, textCellEls]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
