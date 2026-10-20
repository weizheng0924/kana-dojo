// js/router.js

export function createRouter(routes, mountEl) {
  function render() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const view = routes[hash] || routes.dashboard;
    mountEl.innerHTML = '';
    view(mountEl);
  }

  function navigate(name) {
    window.location.hash = name;
  }

  window.addEventListener('hashchange', render);

  return { start: render, navigate };
}
