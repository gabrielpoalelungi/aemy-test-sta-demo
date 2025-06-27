/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image url from style or data-src
  function getBackgroundImageUrl(container) {
    if (!container) return null;
    let url = null;
    if (container.style && container.style.backgroundImage) {
      // style.backgroundImage = url("...")
      const match = /url\((['"]?)(.*?)\1\)/.exec(container.style.backgroundImage);
      if (match && match[2]) {
        url = match[2];
      }
    }
    if (!url && container.dataset && container.dataset.src) {
      url = container.dataset.src;
      // Make absolute if needed
      const a = document.createElement('a');
      a.href = url;
      url = a.href;
    }
    return url;
  }

  // Helper to create image element reference
  function createImgEl(url) {
    if (!url) return '';
    const img = document.createElement('img');
    img.src = url;
    return img;
  }

  // 1. Find the elements inside the hero
  const container = element.querySelector('.cmp-hero-banner__container');
  const bgImgUrl = getBackgroundImageUrl(container);
  const backgroundImgEl = bgImgUrl ? createImgEl(bgImgUrl) : '';

  // Find content (title, etc.)
  const content = element.querySelector('.cmp-hero-banner__content');
  let contentElements = [];
  if (content) {
    // Find .cmp-hero-banner__text (usually only one)
    const textWrappers = content.querySelectorAll('.cmp-hero-banner__text');
    textWrappers.forEach(wrapper => {
      // Use all child nodes (so that heading, subheading, paragraph if present)
      Array.from(wrapper.childNodes).forEach(child => {
        if (
          (child.nodeType === 1 && child.textContent.trim()) ||
          (child.nodeType === 3 && child.textContent.trim())
        ) {
          contentElements.push(child);
        }
      });
    });
    // Optionally, add CTA if present and not empty
    const cta = content.querySelector('.cmp-hero-banner__cta');
    if (cta && cta.textContent.trim()) {
      contentElements.push(cta);
    }
  }

  // Always make 3 rows: header, background, content
  const table = [
    ['Hero'],
    [backgroundImgEl],
    [contentElements.length > 0 ? contentElements : ''],
  ];

  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
