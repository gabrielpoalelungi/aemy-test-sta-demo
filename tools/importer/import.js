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
import cards1Parser from './parsers/cards1.js';
import columns10Parser from './parsers/columns10.js';
import hero5Parser from './parsers/hero5.js';
import columns6Parser from './parsers/columns6.js';
import columns4Parser from './parsers/columns4.js';
import columns3Parser from './parsers/columns3.js';
import hero8Parser from './parsers/hero8.js';
import columns9Parser from './parsers/columns9.js';
import columns13Parser from './parsers/columns13.js';
import columns12Parser from './parsers/columns12.js';
import columns16Parser from './parsers/columns16.js';
import accordion19Parser from './parsers/accordion19.js';
import columns2Parser from './parsers/columns2.js';
import columns22Parser from './parsers/columns22.js';
import hero15Parser from './parsers/hero15.js';
import columns17Parser from './parsers/columns17.js';
import columns20Parser from './parsers/columns20.js';
import columns18Parser from './parsers/columns18.js';
import columns11Parser from './parsers/columns11.js';
import cards28Parser from './parsers/cards28.js';
import columns7Parser from './parsers/columns7.js';
import cards29Parser from './parsers/cards29.js';
import columns24Parser from './parsers/columns24.js';
import cards23Parser from './parsers/cards23.js';
import hero35Parser from './parsers/hero35.js';
import columns21Parser from './parsers/columns21.js';
import columns26Parser from './parsers/columns26.js';
import columns36Parser from './parsers/columns36.js';
import accordion37Parser from './parsers/accordion37.js';
import accordion32Parser from './parsers/accordion32.js';
import columns41Parser from './parsers/columns41.js';
import embedVideo30Parser from './parsers/embedVideo30.js';
import columns39Parser from './parsers/columns39.js';
import cards42Parser from './parsers/cards42.js';
import columns46Parser from './parsers/columns46.js';
import search31Parser from './parsers/search31.js';
import cardsNoImages47Parser from './parsers/cardsNoImages47.js';
import columns48Parser from './parsers/columns48.js';
import columns49Parser from './parsers/columns49.js';
import hero51Parser from './parsers/hero51.js';
import hero50Parser from './parsers/hero50.js';
import columns52Parser from './parsers/columns52.js';
import columns44Parser from './parsers/columns44.js';
import video25Parser from './parsers/video25.js';
import carousel14Parser from './parsers/carousel14.js';
import columns53Parser from './parsers/columns53.js';
import columns45Parser from './parsers/columns45.js';
import carousel27Parser from './parsers/carousel27.js';
import search33Parser from './parsers/search33.js';
import cardsNoImages38Parser from './parsers/cardsNoImages38.js';
import cards40Parser from './parsers/cards40.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import { TransformHook } from './transformers/transform.js';
import {
  generateDocumentPath,
  handleOnLoad,
  TableBuilder,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  cards1: cards1Parser,
  columns10: columns10Parser,
  hero5: hero5Parser,
  columns6: columns6Parser,
  columns4: columns4Parser,
  columns3: columns3Parser,
  hero8: hero8Parser,
  columns9: columns9Parser,
  columns13: columns13Parser,
  columns12: columns12Parser,
  columns16: columns16Parser,
  accordion19: accordion19Parser,
  columns2: columns2Parser,
  columns22: columns22Parser,
  hero15: hero15Parser,
  columns17: columns17Parser,
  columns20: columns20Parser,
  columns18: columns18Parser,
  columns11: columns11Parser,
  cards28: cards28Parser,
  columns7: columns7Parser,
  cards29: cards29Parser,
  columns24: columns24Parser,
  cards23: cards23Parser,
  hero35: hero35Parser,
  columns21: columns21Parser,
  columns26: columns26Parser,
  columns36: columns36Parser,
  accordion37: accordion37Parser,
  accordion32: accordion32Parser,
  columns41: columns41Parser,
  embedVideo30: embedVideo30Parser,
  columns39: columns39Parser,
  cards42: cards42Parser,
  columns46: columns46Parser,
  search31: search31Parser,
  cardsNoImages47: cardsNoImages47Parser,
  columns48: columns48Parser,
  columns49: columns49Parser,
  hero51: hero51Parser,
  hero50: hero50Parser,
  columns52: columns52Parser,
  columns44: columns44Parser,
  video25: video25Parser,
  carousel14: carousel14Parser,
  columns53: columns53Parser,
  columns45: columns45Parser,
  carousel27: carousel27Parser,
  search33: search33Parser,
  cardsNoImages38: cardsNoImages38Parser,
  cards40: cards40Parser,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
};

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

const pageElements = [{ name: 'metadata' }];

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
  // transform all block elements using parsers
  [...pageElements, ...blockElements].forEach(({ element = main, ...pageBlock }) => {
    const parserName = WebImporter.Import.getParserName(pageBlock);
    const parserFn = parsers[parserName];
    if (!parserFn) return;
    try {
      // before parse hook
      WebImporter.Import.transform(TransformHook.beforeParse, element, { ...source });
      // parse the element
      WebImporter.DOMUtils.createTable = tableBuilder.build(parserName);
      parserFn.call(this, element, { ...source });
      WebImporter.DOMUtils.createTable = tableBuilder.restore();
      // after parse hook
      WebImporter.Import.transform(TransformHook.afterParse, element, { ...source });
    } catch (e) {
      console.warn(`Failed to parse block: ${pageBlock.key}`, e);
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
