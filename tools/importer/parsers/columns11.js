/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main footer element
  const footer = element.querySelector('footer.footer');
  if (!footer) return;
  const cmpFooter = footer.querySelector('.cmp-footer');
  if (!cmpFooter) return;

  // Top section: logo, nav and social
  const topSection = cmpFooter.querySelector('.cmp-footer__top-section');
  let col1 = '', col2 = '', col3 = '';
  if (topSection) {
    // Column 1: logo and copyright desktop
    const logoBlock = topSection.querySelector('.cmp-footer__logo-link');
    if (logoBlock) col1 = logoBlock;
    // Column 2: nav
    const navBlock = topSection.querySelector('.cmp-footer__nav');
    if (navBlock) col2 = navBlock;
    // Column 3: social
    const socialBlock = topSection.querySelector('.cmp-footer__social-links');
    if (socialBlock) col3 = socialBlock;
  }

  // Copyright links (bottom row of links)
  let copyrightLinksRow = ['', '', ''];
  const copyrightLinks = cmpFooter.querySelector('.cmp-footer__copyright-links');
  if (copyrightLinks) copyrightLinksRow = [copyrightLinks, '', ''];

  // Copyright text (prefer desktop, fallback to mobile)
  let copyrightTextRow = ['', '', ''];
  let copyrightText = cmpFooter.querySelector('.cmp-footer__copyright-text-desktop');
  if (!copyrightText) copyrightText = cmpFooter.querySelector('.cmp-footer__copyright-text-mobile');
  if (copyrightText) copyrightTextRow = [copyrightText, '', ''];

  // The correct header row must be a single cell
  const headerRow = ['Columns (columns11)'];

  // Compose columns row
  const columnsRow = [col1, col2, col3];

  // Build the 2D cells array with the header as a single cell in its own row
  const cells = [
    headerRow,         // 1 cell (header)
    columnsRow,        // 3 cells (content columns)
    copyrightLinksRow, // 3 cells (links row)
    copyrightTextRow   // 3 cells (copyright text row)
  ];

  // Use createTable, then manually set colspan on the header row th
  const table = WebImporter.DOMUtils.createTable(cells, document);
  const headerTh = table.querySelector('tr:first-child > th');
  if (headerTh) {
    headerTh.setAttribute('colspan', '3');
  }
  // Remove any extra th in header row if they exist
  const headerTr = table.querySelector('tr:first-child');
  if (headerTr) {
    while (headerTr.children.length > 1) {
      headerTr.removeChild(headerTr.lastChild);
    }
  }
  element.replaceWith(table);
}
