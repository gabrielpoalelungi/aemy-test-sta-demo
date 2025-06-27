/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the key parts
  const title = element.querySelector('.text-with-bg__title');
  const bgDesktop = element.querySelector('.text-with-bg__bg:not(.mobile)');
  const logo = element.querySelector('.text-with-bg__logo');
  const content = element.querySelector('.text-with-bg__content');

  // -- Header row --
  // Must match the example header exactly
  const headerRow = ['Hero'];

  // -- Second row: Background image + logo --
  // Extract the desktop background image from style attribute
  let secondRowContent = [];
  if (bgDesktop && bgDesktop.style && bgDesktop.style.backgroundImage) {
    const urlMatch = bgDesktop.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (urlMatch && urlMatch[1]) {
      const bgImg = document.createElement('img');
      bgImg.src = urlMatch[1];
      bgImg.alt = '';
      secondRowContent.push(bgImg);
    }
  }
  if (logo) {
    secondRowContent.push(logo);
  }
  if (secondRowContent.length === 0) {
    secondRowContent = [''];
  }

  // -- Third row: Heading, text, CTA --
  let thirdRowContent = [];
  // The heading is present outside the colored box, so we display it as a heading
  if (title) {
    const h1 = document.createElement('h1');
    h1.innerHTML = title.innerHTML;
    thirdRowContent.push(h1);
  }
  if (content) {
    // Description (multiple paragraphs)
    const desc = content.querySelector('.text-with-bg__desc');
    if (desc) {
      // Add each paragraph individually (only element nodes)
      Array.from(desc.children).forEach(el => {
        thirdRowContent.push(el);
      });
    }
    // CTA button
    const cta = content.querySelector('a.button');
    if (cta) {
      thirdRowContent.push(cta);
    }
  }
  if (thirdRowContent.length === 0) {
    thirdRowContent = [''];
  }

  // Compose table rows per example: header, bg image+logo, content
  const cells = [
    headerRow,
    [secondRowContent],
    [thirdRowContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
