/* global WebImporter */
export default function parse(element, { document }) {
  // The block expects: header ['Embed'], then one cell with a link to video (and text, if any)

  // Gather all non-empty text and links or embeds from the content
  const contentItems = [];

  // 1. Collect any visible text content (even if not wrapped in <p>)
  // Loop through all children and traverse recursively for text nodes
  function collectTextAndElements(node, arr) {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const txt = child.textContent.trim();
        if (txt) {
          const p = document.createElement('p');
          p.textContent = txt;
          arr.push(p);
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // For the video, we want only the link to the file
        if (child.tagName === 'VIDEO') {
          const source = child.querySelector('source');
          if (source && source.getAttribute('src')) {
            let videoSrc = source.getAttribute('src');
            if (videoSrc.startsWith('/')) {
              try {
                videoSrc = new URL(videoSrc, document.baseURI || window.location.origin).href;
              } catch(e) {}
            }
            const a = document.createElement('a');
            a.href = videoSrc;
            a.textContent = videoSrc;
            arr.push(a);
          }
        } else {
          // Recurse for any other element, to include nested text, etc.
          collectTextAndElements(child, arr);
        }
      }
    }
  }

  collectTextAndElements(element, contentItems);

  // Remove empty text paragraphs if they occur (should be rare)
  for (let i = contentItems.length - 1; i >= 0; i--) {
    if (contentItems[i].nodeType === Node.ELEMENT_NODE && contentItems[i].tagName === 'P' && !contentItems[i].textContent.trim()) {
      contentItems.splice(i, 1);
    }
  }

  // If absolutely nothing was found, supply empty string
  if (contentItems.length === 0) {
    contentItems.push(document.createTextNode(''));
  }

  // Build the block table
  const rows = [
    ['Embed'],
    [contentItems.length === 1 ? contentItems[0] : contentItems]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
