/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const cells = [['Cards (cards21)']];

  // Select all the card columns inside the section
  const columns = element.querySelectorAll(':scope > div > div');
  columns.forEach((col) => {
    const cta = col.querySelector('.elementor-cta');
    if (!cta) return;

    // --- IMAGE ---
    let imgEl = null;
    const bg = cta.querySelector('.elementor-cta__bg');
    if (bg && bg.style.backgroundImage) {
      const urlMatch = bg.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        imgEl = document.createElement('img');
        imgEl.src = urlMatch[1];
        imgEl.alt = bg.getAttribute('aria-label') || '';
      }
    }

    // --- TEXT CONTENT ---
    const contentDiv = cta.querySelector('.elementor-cta__content');
    const textCell = document.createElement('div');

    // Title (strong, to match markdown bold)
    const title = contentDiv && contentDiv.querySelector('.elementor-cta__title');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }
    // Description (as paragraph)
    const desc = contentDiv && contentDiv.querySelector('.elementor-cta__description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCell.appendChild(p);
    }
    // CTA as link (from <a>, using button label if present)
    if (cta.hasAttribute('href')) {
      const btn = contentDiv && contentDiv.querySelector('.elementor-cta__button');
      const ctaLink = document.createElement('a');
      ctaLink.href = cta.getAttribute('href');
      ctaLink.textContent = btn ? btn.textContent.trim() : cta.getAttribute('href');
      // Add spacing before CTA if text present
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(ctaLink);
    }
    
    cells.push([
      imgEl,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
