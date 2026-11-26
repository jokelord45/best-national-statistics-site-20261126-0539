/* StatAtlas bootstrap — start the router and the header search. */
(function () {
  'use strict';

  window.addEventListener('hashchange', window.STATATLAS_VIEWS.route);
  window.STATATLAS_VIEWS.initSearch();
  window.STATATLAS_VIEWS.route();
})();
