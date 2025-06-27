/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container for all cards
  const landing = element.querySelector('.cmp-bio__landing');
  if (!landing) return;

  const cards = Array.from(landing.querySelectorAll(':scope > a.cmp-bio__landing-items'));
  const rows = [
    ['Cards (cards28)'],
  ];

  cards.forEach(card => {
    // Image: reference existing <img> (if present)
    const img = card.querySelector('img');
    
    // Text content: preserve structure and all text
    const textParts = [];
    // Name: always bold
    const name = card.querySelector('.cmp-bio__landing-items--name');
    if (name && name.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = name.textContent.trim();
      textParts.push(strong);
      textParts.push(document.createElement('br'));
    }
    // Title: below name
    const title = card.querySelector('.cmp-bio__landing-items--title');
    if (title && title.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = title.textContent.trim();
      textParts.push(span);
    }
    // Compose cell content, ensuring all text is included
    const textCell = document.createElement('div');
    textParts.forEach(el => textCell.appendChild(el));

    rows.push([
      img,
      textCell
    ]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
