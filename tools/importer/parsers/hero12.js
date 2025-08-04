/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing hero structure
  const mainGrid = element.querySelector(':scope > .w-layout-grid');
  if (!mainGrid) return;

  // Find the hero image (optional background/decorative image)
  const img = mainGrid.querySelector('img');

  // Find the content container (title, text, ctas)
  let contentDiv = null;
  const childDivs = mainGrid.querySelectorAll(':scope > div');
  for (const div of childDivs) {
    if (div.querySelector('h1, h2, h3, h4, h5, h6')) {
      contentDiv = div;
      break;
    }
  }
  if (!contentDiv && childDivs.length > 0) {
    contentDiv = childDivs[0];
  }

  // Gather all content in contentDiv, preserving document elements
  let contentElements = [];
  if (contentDiv) {
    // Heading(s)
    const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentElements.push(heading);

    // Subheading - look for any other heading after the first heading
    const allHeadings = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (allHeadings.length > 1) {
      for (let i = 1; i < allHeadings.length; i++) {
        contentElements.push(allHeadings[i]);
      }
    }

    // Paragraphs, but only those not inside any .button-group
    const buttonGroup = contentDiv.querySelector('.button-group');
    const paragraphs = contentDiv.querySelectorAll('p');
    paragraphs.forEach(p => {
      if (!buttonGroup || !buttonGroup.contains(p)) {
        contentElements.push(p);
      }
    });

    // Call-to-action links (all <a> inside .button-group)
    if (buttonGroup) {
      const ctas = buttonGroup.querySelectorAll('a');
      ctas.forEach(a => contentElements.push(a));
    }
  }

  // Compose the table cells: block name, image, content
  const cells = [
    ['Hero (hero12)'],
    [img ? img : ''],
    [contentElements]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
