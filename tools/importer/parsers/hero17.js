/* global WebImporter */
export default function parse(element, { document }) {
  // Get the inner section (contains two columns: left = text, right = image)
  const innerSection = element.querySelector('section.elementor-inner-section');
  if (!innerSection) return;
  const innerColumns = innerSection.querySelectorAll(':scope > .elementor-container > .elementor-inner-column');
  if (innerColumns.length < 2) return;

  // Right column: try img or background image (none in source; leave blank)
  let imageCell = '';

  // Left column: collect heading, subheading, paragraphs, price, and CTA
  const leftCol = innerColumns[0];
  const contentParts = [];

  // Heading (span, styled as h1)
  const headingSpan = leftCol.querySelector('.elementor-element-b262a90 .elementor-heading-title');
  if (headingSpan) {
    const h1 = document.createElement('h1');
    h1.innerHTML = headingSpan.innerHTML;
    contentParts.push(h1);
  }

  // Subheading (h3)
  const subHeading = leftCol.querySelector('.elementor-element-e2c1986 .elementor-heading-title');
  if (subHeading) {
    const h3 = document.createElement('h3');
    h3.innerHTML = subHeading.innerHTML;
    contentParts.push(h3);
  }

  // Paragraphs
  const textEditor = leftCol.querySelector('.elementor-element-90bc1f8 .elementor-widget-container');
  if (textEditor) {
    // Use all paragraphs as is
    textEditor.querySelectorAll('p').forEach(p => {
      contentParts.push(p);
    });
  }

  // Price (icon list)
  const priceList = leftCol.querySelector('.elementor-element-c498c83 .elementor-icon-list-items');
  if (priceList) {
    priceList.querySelectorAll('.elementor-icon-list-item').forEach(li => {
      const text = li.querySelector('.elementor-icon-list-text');
      if (text) {
        // Place in a <p>
        const p = document.createElement('p');
        p.textContent = text.textContent;
        contentParts.push(p);
      }
    });
  }

  // CTA button
  const cta = leftCol.querySelector('.elementor-element-90a7ace a.elementor-button');
  if (cta) {
    contentParts.push(cta);
  }

  // Build the block table structure (header matches example: Hero)
  const cells = [
    ['Hero'],
    [imageCell],
    [contentParts]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
