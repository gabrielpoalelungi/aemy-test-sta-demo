/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cardsNoImages38)'];
  const cells = [headerRow];

  // Helper to construct a fragment for a card cell
  function makeCardContent({ heading, description, cta }) {
    const frag = document.createDocumentFragment();
    if (heading) frag.appendChild(heading);
    if (description) {
      if (heading) frag.appendChild(document.createElement('br'));
      frag.appendChild(description);
    }
    if (cta) {
      if (heading || description) frag.appendChild(document.createElement('br'));
      frag.appendChild(cta);
    }
    return frag;
  }

  // 1. Download cards (each .download.aem-GridColumn)
  const downloadCards = Array.from(element.querySelectorAll('.download.aem-GridColumn'));
  downloadCards.forEach(card => {
    const cmpDownload = card.querySelector('.cmp-download');
    if (!cmpDownload) return;
    const h3 = cmpDownload.querySelector('h3');
    let heading = null;
    let description = null;
    let cta = null;
    if (h3 && h3.textContent.trim()) {
      // Use the existing <h3> as heading, but replace with <strong> for flatness
      heading = document.createElement('strong');
      heading.textContent = h3.textContent.trim();
    }
    const descDiv = cmpDownload.querySelector('.cmp-download__description');
    if (descDiv) {
      let descP = descDiv.querySelector('p');
      if (descP) {
        description = descP;
      } else if (descDiv.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = descDiv.textContent.trim();
        description = p;
      }
    }
    // No CTA for downloads in this design
    cells.push([makeCardContent({ heading, description, cta })]);
  });

  // 2. Section-based cards (each .section.cmp-section--background-color-primary-extralight)
  const sectionCards = Array.from(element.querySelectorAll('.section.cmp-section--background-color-primary-extralight'));
  sectionCards.forEach(section => {
    // Section content is inside .cmp-section__container
    const container = section.querySelector('.cmp-section__container');
    if (!container) return;
    let heading = null;
    let description = null;
    let cta = null;
    // Find text portion
    const textDiv = container.querySelector('.cmp-text');
    if (textDiv) {
      // Heading: try last h4 (skip empty ones)
      const h4s = textDiv.querySelectorAll('h4');
      for (let i = h4s.length - 1; i >= 0; i--) {
        const t = h4s[i].textContent.trim();
        if (t && t !== '\u00a0') {
          heading = document.createElement('strong');
          heading.textContent = t;
          break;
        }
      }
      const p = textDiv.querySelector('p');
      if (p && p.textContent.trim()) {
        description = p;
      }
    }
    // CTA: check for .cmp-button inside this section
    const button = container.querySelector('.cmp-button');
    if (button) {
      cta = button;
    }
    cells.push([makeCardContent({ heading, description, cta })]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
