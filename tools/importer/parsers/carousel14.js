/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel section within the given element
  const carouselSection = element.querySelector('.cmp-carousel');
  if (!carouselSection) return;

  // Find the slides wrapper
  const slidesWrapper = carouselSection.querySelector('.cmp-carousel__slides');
  if (!slidesWrapper) return;

  // Collect all slides
  const slideEls = slidesWrapper.querySelectorAll('.cmp-carousel__item');

  // Compose table header row
  const headerRow = ['Carousel (carousel14)'];
  const rows = [headerRow];

  // Iterate over each slide
  slideEls.forEach((slide) => {
    // Try to find the quote figure in the slide
    const figure = slide.querySelector('figure.cmp-quote');
    if (figure) {
      // We'll reference the existing blockquote and attribution content directly
      const cellContent = [];
      const blockquote = figure.querySelector('blockquote.cmp-quote__text');
      if (blockquote) {
        // Use strong for bold heading effect, matching the example
        const strong = document.createElement('strong');
        strong.textContent = blockquote.textContent.trim();
        cellContent.push(strong);
      }
      const name = figure.querySelector('.cmp-quote__name');
      const title = figure.querySelector('.cmp-quote__title');
      if (name && title) {
        // Add a line break between quote and attribution
        cellContent.push(document.createElement('br'));
        const attrib = document.createElement('span');
        attrib.textContent = `${name.textContent.trim()} | ${title.textContent.trim()}`;
        attrib.style.fontSize = 'smaller';
        cellContent.push(attrib);
      }
      // This carousel only has quote content, so leave first cell blank
      rows.push(['', cellContent]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
