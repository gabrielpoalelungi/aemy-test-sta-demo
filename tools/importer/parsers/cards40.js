/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards40)'];
  const rows = [headerRow];

  // Find the innermost .cmp-grid-container__items (cards container)
  let mainCardContainer = null;
  const gridContainers = element.querySelectorAll('.cmp-grid-container__items');
  if (gridContainers.length) {
    mainCardContainer = gridContainers[gridContainers.length - 1];
  } else {
    mainCardContainer = element;
  }

  // Collect both info cards and download blocks
  const cardBlocks = Array.from(mainCardContainer.querySelectorAll(':scope > .aem-Grid > .section.cmp-section--background-color-primary-extralight, :scope > .download'));

  cardBlocks.forEach(block => {
    if (block.classList.contains('section')) {
      // Gather all .cmp-text and .cmp-button in DOM order
      const content = [];
      // For all .cmp-text, push all children (including text nodes, headings, paragraphs, etc.)
      const textEls = block.querySelectorAll('.cmp-text');
      textEls.forEach(te => {
        // Remove empty or all-&nbsp; <h4> elements
        Array.from(te.querySelectorAll('h4')).forEach(h => {
          if (!h.textContent.trim() || h.textContent.replace(/\xa0|\u00a0| |\s/g, '') === '') {
            h.remove();
          }
        });
        // Add all child nodes (preserving elements, text, etc.)
        Array.from(te.childNodes).forEach(node => {
          if (node.nodeType === 3 && !node.textContent.trim()) return; // skip empty text
          content.push(node);
        });
      });
      // Add all CTAs (cmp-button)
      const btnEls = block.querySelectorAll('.cmp-button');
      btnEls.forEach(btn => content.push(btn));
      if (content.length > 0) {
        rows.push(['', content]);
      }
    } else if (block.classList.contains('download')) {
      const link = block.querySelector('a.cmp-download__title-link');
      if (link && link.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = link.textContent.trim();
        rows.push(['', [strong]]);
      }
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
