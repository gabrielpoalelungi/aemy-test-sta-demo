/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards10)'];
  const cards = Array.from(element.querySelectorAll(':scope > .teaser-item'));

  const rows = cards.map(card => {
    // Image
    const img = card.querySelector('img');

    // Title (as heading)
    const titleDiv = card.querySelector('.teaser-item__title');
    let titleEl = null;
    if (titleDiv && titleDiv.textContent.trim().length > 0) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleDiv.textContent.trim();
    }

    // Description (may be paragraph)
    const descDiv = card.querySelector('.teaser-item__desc');
    let descEls = [];
    if (descDiv) {
      descEls = Array.from(descDiv.childNodes).filter(n => {
        return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
      });
    }

    // CTA (button/link)
    const cta = card.querySelector('a');

    // Compose content cell
    const cellContent = [];
    if (titleEl) cellContent.push(titleEl);
    if (descEls.length > 0) {
      if (titleEl) cellContent.push(document.createElement('br'));
      descEls.forEach((desc, idx) => {
        if ((titleEl || idx > 0)) cellContent.push(document.createElement('br'));
        cellContent.push(desc);
      });
    }
    if (cta) {
      cellContent.push(document.createElement('br'));
      cellContent.push(cta);
    }

    return [img, cellContent];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
