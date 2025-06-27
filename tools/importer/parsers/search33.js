/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search component (cmp-site-search) or fallback to the given element
  const cmpSiteSearch = element.querySelector('.cmp-site-search') || element;

  // Extract the search data source URL, resolve to absolute
  let searchUrl = '';
  if (cmpSiteSearch.dataset && cmpSiteSearch.dataset.searchurl) {
    const tempA = document.createElement('a');
    tempA.href = cmpSiteSearch.dataset.searchurl;
    searchUrl = tempA.href;
  }

  // Collect all immediate children (including text nodes) of cmpSiteSearch
  // to retain all structure and visible content
  const nodes = [];
  cmpSiteSearch.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Only exclude elements that are intentionally hidden as results/pagination
      const style = node.getAttribute('style') || '';
      if (!style.includes('display:none')) {
        nodes.push(node);
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      // Wrap text in a span
      const span = document.createElement('span');
      span.textContent = node.textContent;
      nodes.push(span);
    }
  });

  // If nothing was found, fallback to the entire cmpSiteSearch block
  const contentCell = nodes.length ? nodes : [cmpSiteSearch];

  // Build the cells array precisely per the block example: header, searchUrl, content
  const cells = [
    ['Search (search33)'],
    [searchUrl],
    [contentCell],
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
