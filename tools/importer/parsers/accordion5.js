/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion5)'];
  // The menu wrapper ul contains the nav tree
  const menuWrapper = element.querySelector('ul[data-component="menu-wrapper"]');
  if (!menuWrapper) return;
  const accordionRows = [];
  // Each top-level li is a main nav (an accordion item)
  const topLis = menuWrapper.querySelectorAll(':scope > li');
  topLis.forEach((li) => {
    // The clickable title is the link text (including step and title)
    const a = li.querySelector(':scope > a');
    if (!a) return;
    // Compose the title: Step + title text
    const step = a.querySelector('.menu-subtitle');
    const title = a.querySelector('.menu-item-title');
    let titleFragment;
    if (step && title) {
      // Use a fragment for the title, referencing the actual child elements
      titleFragment = document.createElement('div');
      if (step.textContent.trim()) {
        const stepSpan = document.createElement('span');
        stepSpan.textContent = step.textContent.trim();
        titleFragment.appendChild(stepSpan);
        titleFragment.appendChild(document.createTextNode(' '));
      }
      if (title.textContent.trim()) {
        const titleSpan = document.createElement('span');
        titleSpan.textContent = title.textContent.trim();
        titleFragment.appendChild(titleSpan);
      }
    } else {
      // If missing, just use the anchor's text
      titleFragment = document.createElement('span');
      titleFragment.textContent = a.textContent.trim();
    }
    // Content cell: The sub-menu is an inner ul, each li is a link
    const dropdown = li.querySelector(':scope > ul.dropdown-menu');
    let contentFragment = document.createElement('div');
    if (dropdown) {
      dropdown.querySelectorAll(':scope > li').forEach((subLi) => {
        const subA = subLi.querySelector('a');
        if (subA) {
          const subTitle = subA.querySelector('.menu-item-title');
          // Build sub-link (preserve text, href)
          const link = document.createElement('a');
          link.href = subA.href;
          link.textContent = subTitle ? subTitle.textContent.trim() : subA.textContent.trim();
          const p = document.createElement('p');
          p.appendChild(link);
          contentFragment.appendChild(p);
        }
      });
      // If dropdown has no items, leave contentFragment as empty div
    }
    accordionRows.push([
      titleFragment,
      contentFragment
    ]);
  });

  const cells = [headerRow, ...accordionRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
