/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import hero2Parser from './parsers/hero2.js';
import hero7Parser from './parsers/hero7.js';
import hero3Parser from './parsers/hero3.js';
import hero6Parser from './parsers/hero6.js';
import hero10Parser from './parsers/hero10.js';
import carousel12Parser from './parsers/carousel12.js';
import cards4Parser from './parsers/cards4.js';
import hero13Parser from './parsers/hero13.js';
import columns11Parser from './parsers/columns11.js';
import hero14Parser from './parsers/hero14.js';
import cards15Parser from './parsers/cards15.js';
import cards5Parser from './parsers/cards5.js';
import columns16Parser from './parsers/columns16.js';
import columns8Parser from './parsers/columns8.js';
import columns17Parser from './parsers/columns17.js';
import cards20Parser from './parsers/cards20.js';
import accordion21Parser from './parsers/accordion21.js';
import accordion18Parser from './parsers/accordion18.js';
import cards22Parser from './parsers/cards22.js';
import hero25Parser from './parsers/hero25.js';
import carousel24Parser from './parsers/carousel24.js';
import hero29Parser from './parsers/hero29.js';
import hero31Parser from './parsers/hero31.js';
import cards26Parser from './parsers/cards26.js';
import hero23Parser from './parsers/hero23.js';
import columns30Parser from './parsers/columns30.js';
import hero33Parser from './parsers/hero33.js';
import cards34Parser from './parsers/cards34.js';
import columns32Parser from './parsers/columns32.js';
import hero36Parser from './parsers/hero36.js';
import cards35Parser from './parsers/cards35.js';
import cards38Parser from './parsers/cards38.js';
import hero40Parser from './parsers/hero40.js';
import columns27Parser from './parsers/columns27.js';
import columns39Parser from './parsers/columns39.js';
import columns19Parser from './parsers/columns19.js';
import carousel37Parser from './parsers/carousel37.js';
import embedVideo1Parser from './parsers/embedVideo1.js';
import tabs28Parser from './parsers/tabs28.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  TableBuilder,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  hero2: hero2Parser,
  hero7: hero7Parser,
  hero3: hero3Parser,
  hero6: hero6Parser,
  hero10: hero10Parser,
  carousel12: carousel12Parser,
  cards4: cards4Parser,
  hero13: hero13Parser,
  columns11: columns11Parser,
  hero14: hero14Parser,
  cards15: cards15Parser,
  cards5: cards5Parser,
  columns16: columns16Parser,
  columns8: columns8Parser,
  columns17: columns17Parser,
  cards20: cards20Parser,
  accordion21: accordion21Parser,
  accordion18: accordion18Parser,
  cards22: cards22Parser,
  hero25: hero25Parser,
  carousel24: carousel24Parser,
  hero29: hero29Parser,
  hero31: hero31Parser,
  cards26: cards26Parser,
  hero23: hero23Parser,
  columns30: columns30Parser,
  hero33: hero33Parser,
  cards34: cards34Parser,
  columns32: columns32Parser,
  hero36: hero36Parser,
  cards35: cards35Parser,
  cards38: cards38Parser,
  hero40: hero40Parser,
  columns27: columns27Parser,
  columns39: columns39Parser,
  columns19: columns19Parser,
  carousel37: carousel37Parser,
  embedVideo1: embedVideo1Parser,
  tabs28: tabs28Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.entries(transformers).forEach(([, transformerFn]) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  const tableBuilder = TableBuilder(WebImporter.DOMUtils.createTable);
  // transform all elements using parsers
  [...blockElements, ...pageElements].forEach((item) => {
    const { element = main, ...pageBlock } = item;
    const isBlockElement = blockElements.includes(item);
    const parserName = WebImporter.Import.getParserName(pageBlock);
    const parserFn = parsers[parserName];
    if (!parserFn) return;
    try {
      let parserElement = element;
      if (typeof parserElement === 'string') {
        parserElement = main.querySelector(parserElement);
      }
      // before parse hook
      WebImporter.Import.transform(TransformHook.beforeParse, parserElement, { ...source });
      // parse the element
      if (isBlockElement) {
        WebImporter.DOMUtils.createTable = tableBuilder.build(parserName);
      }
      parserFn.call(this, parserElement, { ...source });
      if (isBlockElement) {
        WebImporter.DOMUtils.createTable = tableBuilder.restore();
      }
      // after parse hook
      WebImporter.Import.transform(TransformHook.afterParse, parserElement, { ...source });
    } catch (e) {
      console.warn(`Failed to parse block: ${parserName}`, e);
    }
  });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    const tableBuilder = TableBuilder(WebImporter.DOMUtils.createTable);

    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          WebImporter.DOMUtils.createTable = tableBuilder.build(parserName);
          parserFn.call(this, element, source);
          WebImporter.DOMUtils.createTable = tableBuilder.restore();
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    // sanitize the original URL
    /* eslint-disable no-param-reassign */
    source.params.originalURL = new URL(originalURL).href;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
