/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards29)'];

  // Find the bios container
  const biosLanding = element.querySelector('.cmp-bio__landing');
  if (!biosLanding) return;

  // Get all a.cmp-bio__landing-items (each is a card)
  const cardLinks = Array.from(biosLanding.querySelectorAll('.cmp-bio__landing-items'));
  const rows = cardLinks.map(card => {
    // Get image (must reference original, not clone)
    const img = card.querySelector('img');
    // Compose text cell contents
    const name = card.querySelector('.cmp-bio__landing-items--name');
    const title = card.querySelector('.cmp-bio__landing-items--title');
    // Build text cell: name in <strong>, then title in <div>
    const frag = document.createDocumentFragment();
    if (name) {
      const strong = document.createElement('strong');
      strong.textContent = name.textContent;
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }
    if (title) {
      const div = document.createElement('div');
      div.textContent = title.textContent;
      frag.appendChild(div);
    }
    // For the table row, use references to original img element and fragment
    return [img, frag];
  });

  // Compose the table array
  const tableRows = [headerRow, ...rows];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
