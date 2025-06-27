/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel component
  const carouselSection = element.querySelector('.cmp-carousel');
  if (!carouselSection) return;

  // Grab all slides
  const slideNodes = carouselSection.querySelectorAll('.cmp-carousel__item');
  const rows = [ [ 'Carousel (carousel27)' ] ];

  slideNodes.forEach((slide) => {
    // First column: the image in the slide
    const imgEl = slide.querySelector('img');

    // Second column: any text content (headings, paragraphs, lists, links, etc.) not inside image wrappers
    let textContent = '';
    let contentContainer = slide.querySelector('.cmp-carousel-slide__content') || slide;
    // Gather all allowed text elements at any depth (excluding inside cmp-image/picture/figure)
    const allowedTags = ['H1','H2','H3','H4','H5','H6','P','A','UL','OL','LI'];
    let textEls = [];
    function walk(node) {
      node.childNodes.forEach(child => {
        if (child.nodeType === 1) { // element
          if (
            allowedTags.includes(child.tagName) &&
            !child.closest('.cmp-image, picture, figure')
          ) {
            textEls.push(child);
          }
          walk(child);
        }
      });
    }
    walk(contentContainer);
    if (textEls.length > 0) {
      textContent = textEls.length === 1 ? textEls[0] : textEls;
    }
    rows.push([
      imgEl,
      textContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
