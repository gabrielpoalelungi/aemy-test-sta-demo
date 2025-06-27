/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards18)'];
  const cardEls = element.querySelectorAll(':scope > .teaser-icon-item');
  const rows = Array.from(cardEls).map(card => {
    const img = card.querySelector('.teaser-icon-item__icon');
    const col2 = document.createElement('div');
    const title = card.querySelector('.teaser-icon-item__title');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      col2.appendChild(strong);
      col2.appendChild(document.createElement('br'));
    }
    const desc = card.querySelector('.teaser-icon-item__desc');
    if (desc) {
      desc.childNodes.forEach(node => {
        col2.appendChild(node.cloneNode(true));
      });
    }
    const ctaBtn = card.querySelector('.teaser-icon-item__cta .cta-link');
    if (ctaBtn) {
      const ctaText = ctaBtn.textContent.trim();
      if (ctaText) {
        col2.appendChild(document.createElement('br'));
        const ctaSpan = document.createElement('span');
        ctaSpan.textContent = ctaText;
        col2.appendChild(ctaSpan);
      }
    }
    return [img, col2];
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
