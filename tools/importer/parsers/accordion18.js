/* global WebImporter */
export default function parse(element, { document }) {
  // Get all accordion items (immediate children with class 'accordion')
  const accordionItems = element.querySelectorAll(':scope > .accordion');
  const rows = [];

  // The header row: single cell, but we will set colspan=2 on the resulting <th>
  const headerRow = ['Accordion (accordion18)'];
  rows.push(headerRow);

  accordionItems.forEach((item) => {
    // Get the title cell: inside .w-dropdown-toggle, .paragraph-lg
    let titleCell = '';
    const toggle = item.querySelector('.w-dropdown-toggle');
    if (toggle) {
      const titleDiv = toggle.querySelector('.paragraph-lg');
      if (titleDiv) {
        titleCell = titleDiv;
      }
    }
    // Get the content cell: inside nav.accordion-content > .utility-padding-all-1rem > .rich-text
    let contentCell = '';
    const contentNav = item.querySelector('nav.accordion-content');
    if (contentNav) {
      const wrapper = contentNav.querySelector('.utility-padding-all-1rem');
      if (wrapper) {
        const rich = wrapper.querySelector('.rich-text');
        contentCell = rich || wrapper;
      } else {
        contentCell = contentNav;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Fix the header row's colspan to span both columns
  // The first row is the header, first <tr>, first child <th>
  const headerTh = table.querySelector('tr:first-child th');
  if (headerTh) {
    headerTh.setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
