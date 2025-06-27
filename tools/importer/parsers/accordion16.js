/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name, one cell
  const rows = [['Accordion (accordion16)']];

  // Extract group title from .purpose h4, if present
  let groupTitle = '';
  const purposeH4 = element.querySelector('.purpose h4');
  if (purposeH4) groupTitle = purposeH4.textContent.trim();

  // Get all direct children except the .purpose block
  const children = Array.from(element.children).filter(div => !div.classList.contains('purpose'));

  // Find all blocks starting with .name, then .retention and .function
  for (let i = 0; i < children.length; i++) {
    const curr = children[i];
    if (curr.classList.contains('name')) {
      const nameDiv = curr;
      let retentionDiv = null;
      let functionDiv = null;
      // Search for the next .retention and .function
      for (let j = i + 1; j < children.length; j++) {
        if (!retentionDiv && children[j].classList.contains('retention')) retentionDiv = children[j];
        else if (!functionDiv && children[j].classList.contains('function')) { functionDiv = children[j]; break; }
      }

      // Title cell: reference the existing .name div
      const titleCell = nameDiv;

      // Content cell: combine all relevant content, referencing existing elements, preserving text
      const contentParts = [];
      if (groupTitle) {
        const strong = document.createElement('strong');
        strong.textContent = groupTitle;
        contentParts.push(strong);
        contentParts.push(document.createElement('br'));
      }
      if (retentionDiv && retentionDiv.textContent.trim()) {
        contentParts.push(document.createTextNode('Expirare: ' + retentionDiv.textContent.trim()));
        contentParts.push(document.createElement('br'));
      }
      if (functionDiv && functionDiv.textContent.trim()) {
        contentParts.push(document.createTextNode('Funcție: ' + functionDiv.textContent.trim()));
      }
      // If all fields are empty, at least add an empty string
      if (!contentParts.length) contentParts.push('');
      // Remove trailing <br>, if present
      if (contentParts.length && contentParts[contentParts.length - 1].tagName === 'BR') {
        contentParts.pop();
      }
      rows.push([titleCell, contentParts]);
    }
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
