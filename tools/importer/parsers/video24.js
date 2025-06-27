/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to make <br> elements
  function makeBr() {
    return document.createElement('br');
  }

  const headerRow = ['Video (video24)'];
  let videoLink = null;
  let posterImg = null;

  // Find the player wrapper (Brightcove video)
  const videoWrapper = element.querySelector('.hero-banner-video__video-wrapper');
  if (videoWrapper) {
    const brightcoveDiv = videoWrapper.querySelector('[data-video-id]');
    if (brightcoveDiv) {
      const videoId = brightcoveDiv.getAttribute('data-video-id');
      const accountId = brightcoveDiv.getAttribute('data-account');
      if (videoId && accountId) {
        // Construct a Brightcove player URL (standard embed link)
        // https://players.brightcove.net/{accountId}/default_default/index.html?videoId={videoId}
        videoLink = document.createElement('a');
        videoLink.href = `https://players.brightcove.net/${accountId}/default_default/index.html?videoId=${videoId}`;
        videoLink.textContent = videoLink.href;
      }
    }
    // Find the poster image
    // Try to get the img from .vjs-poster img, fallback to <video poster>
    let posterSrc = '';
    let posterAlt = '';
    const posterImgEl = videoWrapper.querySelector('.vjs-poster img');
    if (posterImgEl && posterImgEl.src) {
      posterSrc = posterImgEl.src;
      posterAlt = posterImgEl.alt || '';
    } else {
      // fallback: see if video tag has poster attribute
      const videoEl = videoWrapper.querySelector('video[poster]');
      if (videoEl && videoEl.getAttribute('poster')) {
        posterSrc = videoEl.getAttribute('poster');
        posterAlt = '';
      }
    }
    if (posterSrc) {
      // Reference the existing <img> if possible
      if (posterImgEl) {
        posterImg = posterImgEl;
      } else {
        posterImg = document.createElement('img');
        posterImg.src = posterSrc;
        posterImg.alt = posterAlt;
      }
      // Example size: width=750, height=422
      posterImg.setAttribute('width', '750');
      posterImg.setAttribute('height', '422');
    }
  }

  // Compose the cell contents
  const cellContent = [];
  if (posterImg) cellContent.push(posterImg);
  if (videoLink) {
    if (posterImg) cellContent.push(makeBr());
    cellContent.push(videoLink);
  }

  // If no video found, fallback to nothing (still output a valid block)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent.length > 0 ? cellContent : '']
  ], document);

  element.replaceWith(table);
}
