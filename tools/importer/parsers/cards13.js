/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Cards (cards13)'];
  // The card columns are the immediate child columns of the section > container
  const columns = element.querySelectorAll(':scope > div > div');

  const rows = Array.from(columns).map(col => {
    // Each col has a widget-wrap > widget > widget-container > a.elementor-cta
    const cta = col.querySelector('a.elementor-cta');
    // Get image from background-image style attribute
    let img = null;
    if (cta) {
      const bg = cta.querySelector('.elementor-cta__bg');
      if (bg && bg.style.backgroundImage) {
        const urlMatch = bg.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        if (urlMatch && urlMatch[1]) {
          img = document.createElement('img');
          img.src = urlMatch[1];
          img.alt = bg.getAttribute('aria-label') || '';
        }
      }
    }
    // Prepare text content cell
    const textContent = [];
    if (cta) {
      // Title (Heading)
      const title = cta.querySelector('.elementor-cta__title');
      if (title) {
        // Use existing element for semantic heading if possible
        // But in this HTML it's always an <h3>, which is fine
        textContent.push(title);
      }
      // Description
      const desc = cta.querySelector('.elementor-cta__description');
      if (desc) {
        // Use the existing description element
        textContent.push(desc);
      }
      // Call to Action (link)
      const button = cta.querySelector('.elementor-cta__button');
      if (button && cta.getAttribute('href')) {
        const link = document.createElement('a');
        link.href = cta.getAttribute('href');
        link.textContent = button.textContent.trim();
        // Place CTA in its own div for consistent vertical spacing
        const wrapper = document.createElement('div');
        wrapper.appendChild(link);
        textContent.push(wrapper);
      }
    }
    return [img, textContent];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
