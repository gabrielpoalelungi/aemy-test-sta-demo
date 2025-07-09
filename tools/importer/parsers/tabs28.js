/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child anchors, each representing a tab label
  const tabLinks = Array.from(element.querySelectorAll(':scope > a'));

  // Extract the tab labels from the anchors, using their visible text
  const tabLabels = tabLinks.map((a) => {
    // Usually the label is inside a div within the anchor
    const labelDiv = a.querySelector('div');
    if (labelDiv) {
      return labelDiv.textContent.trim();
    }
    return a.textContent.trim();
  });

  // Table header; matches exactly the spec: Tabs
  const headerRow = ['Tabs'];
  // For each tab, create a row: [tab label, empty content cell]
  const rows = tabLabels.map(label => [label, '']);

  // Assemble the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the generated table
  element.replaceWith(table);
}
