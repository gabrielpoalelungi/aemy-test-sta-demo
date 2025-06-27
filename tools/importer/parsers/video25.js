/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Video'];

  // Find the main inner container that holds all content (video, any text, etc.)
  const inner = element.querySelector('.cmp-video-external__inner') || element;

  // Gather all direct children and text nodes from the inner container
  const contentElements = [];
  inner.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      contentElements.push(node);
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      // Preserve text nodes by wrapping in a <span>
      const span = document.createElement('span');
      span.textContent = node.textContent;
      contentElements.push(span);
    }
  });

  // Attempt to extract the video source (prefer <source>, fallback to data-video-path)
  let videoSrc = '';
  const video = inner.querySelector('video');
  if (video) {
    const source = video.querySelector('source');
    if (source && source.src) {
      videoSrc = source.src;
    }
  }
  if (!videoSrc) {
    const cmp = element.querySelector('.cmp-video-external');
    if (cmp && cmp.dataset.videoPath) {
      videoSrc = cmp.dataset.videoPath;
    }
  }
  // Make the video url absolute if necessary
  let absVideoSrc = videoSrc;
  if (videoSrc && !/^([a-zA-Z][a-zA-Z0-9+.-]*:|\/\/)/.test(videoSrc)) {
    const a = document.createElement('a');
    a.href = videoSrc;
    absVideoSrc = a.href;
  }

  // Include a link to the video file if found (as required by the block)
  if (absVideoSrc) {
    const link = document.createElement('a');
    link.href = absVideoSrc;
    link.textContent = absVideoSrc;
    // Only add a line break if there is already content
    if (contentElements.length > 0) {
      contentElements.push(document.createElement('br'));
    }
    contentElements.push(link);
  }

  // Assemble the table rows
  const cells = [
    headerRow,
    [contentElements]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
