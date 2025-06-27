/* global WebImporter */
export default function parse(element, { document }) {
  // Compose table header
  const headerRow = ['Carousel'];
  const rows = [];
  // Select all direct carousel slides
  const items = element.querySelectorAll(':scope > .sbi_item');
  items.forEach((item) => {
    // Find anchor containing the image and all text
    const photoWrap = item.querySelector('.sbi_photo_wrap');
    if (!photoWrap) return;
    const a = photoWrap.querySelector('a.sbi_photo');
    if (!a) return;
    const img = a.querySelector('img');
    if (!img) return;
    // --- Collect ALL relevant text content from this slide ---
    // 1. sbi-screenreader (usually a short description)
    const srSpan = a.querySelector('.sbi-screenreader');
    let srText = '';
    if (srSpan && srSpan.textContent.trim()) srText = srSpan.textContent.trim();
    // 2. The alt text of the image, which is the largest content block (the Instagram post text)
    let altText = img.getAttribute('alt') ? img.getAttribute('alt').trim() : '';
    // 3. Any other visible text nodes directly in the anchor (rare, but robust)
    let extraText = '';
    Array.from(a.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        extraText += node.textContent.trim() + '\n';
      }
    });
    // Combine, deduplicate, filter empty, preserve order
    const textSet = [];
    if (srText && !textSet.includes(srText)) textSet.push(srText);
    if (altText && !textSet.includes(altText)) textSet.push(altText);
    if (extraText) {
      extraText.split(/\n+/).map(t => t.trim()).filter(Boolean).forEach(t => {
        if (!textSet.includes(t)) textSet.push(t);
      });
    }
    // Compose text cell elements to preserve semantics and source structure
    let textCell = '';
    if (textSet.length) {
      const frag = document.createElement('div');
      // If the first line is a short summary and the second is a long text, treat first as heading
      if (textSet.length > 1) {
        const h2 = document.createElement('h2');
        h2.textContent = textSet[0];
        frag.appendChild(h2);
        const p = document.createElement('p');
        p.innerHTML = textSet.slice(1).map(l => l.replace(/\n/g, '<br>')).join('<br>');
        frag.appendChild(p);
      } else {
        // Only one text block, just use heading
        const h2 = document.createElement('h2');
        h2.textContent = textSet[0];
        frag.appendChild(h2);
      }
      textCell = frag;
    }
    // Reference the actual <img> element and the text cell
    rows.push([img, textCell]);
  });
  // Compose final table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
