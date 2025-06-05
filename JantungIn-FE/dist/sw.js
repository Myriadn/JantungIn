/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-47da91e0'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "api-test.html",
    "revision": "fe731ff1e09d6c7cc99d92740c44cc39"
  }, {
    "url": "assets/AccountAdminPage-CPHJSeul.js",
    "revision": null
  }, {
    "url": "assets/AccountAdminPage-CuaYK_tE.css",
    "revision": null
  }, {
    "url": "assets/AccountPage-BqIFipTL.js",
    "revision": null
  }, {
    "url": "assets/AccountPage-CzbEay14.css",
    "revision": null
  }, {
    "url": "assets/ChatbotComponent-BdOrRHoV.css",
    "revision": null
  }, {
    "url": "assets/ChatbotComponent-KlukNhEg.js",
    "revision": null
  }, {
    "url": "assets/DiagnoseAdminPage-B7UBhymp.js",
    "revision": null
  }, {
    "url": "assets/DiagnoseAdminPage-CzLEo9XE.css",
    "revision": null
  }, {
    "url": "assets/errorHandler-CvrVlmz5.js",
    "revision": null
  }, {
    "url": "assets/Footer-component-B4qbvjz3.css",
    "revision": null
  }, {
    "url": "assets/Footer-component-Jen5bCQl.js",
    "revision": null
  }, {
    "url": "assets/HistoryAdminPage-CyFC15OD.css",
    "revision": null
  }, {
    "url": "assets/HistoryAdminPage-DQNmoD7V.js",
    "revision": null
  }, {
    "url": "assets/HistoryPage-DEZiJ1w5.css",
    "revision": null
  }, {
    "url": "assets/HistoryPage-DN0ZnV9R.js",
    "revision": null
  }, {
    "url": "assets/HomeAdminPage-C13m33FZ.js",
    "revision": null
  }, {
    "url": "assets/HomeAdminPage-CLGYkTu3.css",
    "revision": null
  }, {
    "url": "assets/HomeUserPage-DN7heBCS.css",
    "revision": null
  }, {
    "url": "assets/HomeUserPage-DTHfHZCL.js",
    "revision": null
  }, {
    "url": "assets/ImagePreloader-CF5kY67s.js",
    "revision": null
  }, {
    "url": "assets/index-BnM7wWtF.css",
    "revision": null
  }, {
    "url": "assets/index-Dy1_wJKI.js",
    "revision": null
  }, {
    "url": "assets/LazyImage-CTPPnyAo.js",
    "revision": null
  }, {
    "url": "assets/LazyImage-jstHcpEQ.css",
    "revision": null
  }, {
    "url": "assets/Login-doctor-CEIdAd5Y.css",
    "revision": null
  }, {
    "url": "assets/Login-doctor-VEqOBj7r.js",
    "revision": null
  }, {
    "url": "assets/Login-user-DGaYxBkD.css",
    "revision": null
  }, {
    "url": "assets/Login-user-SZ5okpYD.js",
    "revision": null
  }, {
    "url": "assets/logo-CabL2Gcj.png",
    "revision": null
  }, {
    "url": "assets/NetworkErrorComponent-BwqVMyze.js",
    "revision": null
  }, {
    "url": "assets/NetworkErrorComponent-tpzkUx-i.css",
    "revision": null
  }, {
    "url": "assets/NewsAdminPage-DM1YGouQ.js",
    "revision": null
  }, {
    "url": "assets/NewsAdminPage-DnGnBzZv.css",
    "revision": null
  }, {
    "url": "assets/NewsPage-BZxa113Q.css",
    "revision": null
  }, {
    "url": "assets/NewsPage-mFzWIILm.js",
    "revision": null
  }, {
    "url": "assets/PatientService-B6JXPRBQ.js",
    "revision": null
  }, {
    "url": "assets/Register-user-DfkMofMQ.css",
    "revision": null
  }, {
    "url": "assets/Register-user-jkRkn9zc.js",
    "revision": null
  }, {
    "url": "assets/ResultAdminPage-CFGyg6Oy.js",
    "revision": null
  }, {
    "url": "assets/ResultAdminPage-Dc_FKcVA.css",
    "revision": null
  }, {
    "url": "images/Account (Desktop).png",
    "revision": "6f39c1202c1ad282fd23091d70168602"
  }, {
    "url": "images/Account (Mobile).png",
    "revision": "2a533733e4526b107c6f30cb9f4dfb85"
  }, {
    "url": "images/apple-touch-icon.png",
    "revision": "9619b6bda2c493a59ea1fcb3ba9fe904"
  }, {
    "url": "images/azwin.jpg",
    "revision": "1bd7b6be3e0bdcd5042541e38cac0086"
  }, {
    "url": "images/cegah.jpg",
    "revision": "d5b1b4441bafee10d9680dc2398c902d"
  }, {
    "url": "images/error-placeholder.svg",
    "revision": "1775d9859ac93c95d0afad6d27d94e58"
  }, {
    "url": "images/haidar.jpg",
    "revision": "24b938fb64a5367a4fe69b19c147c248"
  }, {
    "url": "images/heart1.jpg",
    "revision": "1d51e872d72acff9794cbd8cf501cb98"
  }, {
    "url": "images/heart2.jpg",
    "revision": "a542b331e10184db264f6c99b48184e5"
  }, {
    "url": "images/heart3.jpg",
    "revision": "998554198b9462c97b430abc9873437e"
  }, {
    "url": "images/History (Desktop).png",
    "revision": "bff036b72b3cca8b009e6d72e4fbe248"
  }, {
    "url": "images/History (Mobile).png",
    "revision": "15a1b4c0ddde5b35f50b8245f4ad0d81"
  }, {
    "url": "images/hostipal.jpg",
    "revision": "6e3a1f365e2de101caf6546e7671ea9e"
  }, {
    "url": "images/ike.jpg",
    "revision": "3ce9e703bf0d9038cfa68989e0d26f97"
  }, {
    "url": "images/king.jpg",
    "revision": "52f5fb6dd5acffaea0e59c35832fc8ab"
  }, {
    "url": "images/loading-placeholder.svg",
    "revision": "7cdb64743312ad55f5e8656f91d2879c"
  }, {
    "url": "images/Login  Patient (Desktop).png",
    "revision": "6ad99ebdf927c9e325ea1764d87c603e"
  }, {
    "url": "images/Login Patient (Mobile).png",
    "revision": "62bc1ca9b00be4422a3c9fbf8e148ed3"
  }, {
    "url": "images/lovee.jpg",
    "revision": "e4b66ac60c8d454e90df2e42d6b30109"
  }, {
    "url": "images/mask-icon.svg",
    "revision": "70d4f2c34aa84cdbf5700fbab93d482c"
  }, {
    "url": "images/News (Desktop).png",
    "revision": "981e759c7da73118c9667e0f5afd9b53"
  }, {
    "url": "images/News (Mobile).png",
    "revision": "acca19ce275487700c0e348248240ffe"
  }, {
    "url": "images/OIP.jpg",
    "revision": "57f99df4629e5c32561b66aafbe28103"
  }, {
    "url": "images/picu.jpg",
    "revision": "3fe575a97290512395aa8b69b4d3c66d"
  }, {
    "url": "images/pwa-192x192.png",
    "revision": "7814a9a70526fc7ecb50cbbe45578260"
  }, {
    "url": "images/pwa-512x512.png",
    "revision": "70d4f2c34aa84cdbf5700fbab93d482c"
  }, {
    "url": "images/ridho.jpg",
    "revision": "d881651d1b7a425f39361e4adedd8002"
  }, {
    "url": "images/sakit.png",
    "revision": "fbadfcb05c364e2761e9abfe442083d9"
  }, {
    "url": "images/ui.jpg",
    "revision": "0309273889eabbdb3f4b0fc99d12e843"
  }, {
    "url": "index.html",
    "revision": "6b24baac36a3e550181d317157dfce7c"
  }, {
    "url": "logo.png",
    "revision": "7be513fffe21d8b82444695b38165f4b"
  }, {
    "url": "offline.html",
    "revision": "cba5c5b7ca5cff7687581a329b938e2e"
  }, {
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "images/pwa-192x192.png",
    "revision": "7814a9a70526fc7ecb50cbbe45578260"
  }, {
    "url": "images/pwa-512x512.png",
    "revision": "70d4f2c34aa84cdbf5700fbab93d482c"
  }, {
    "url": "manifest.webmanifest",
    "revision": "fc430bb7d9a4569afd4e47ffed16466f"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/jantungin-api\.up\.railway\.app\/.*/i, new workbox.NetworkFirst({
    "cacheName": "api-cache",
    "networkTimeoutSeconds": 5,
    plugins: [new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
