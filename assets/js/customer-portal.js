/* PDF locations are configured once in config.js. */
(() => {
  const toast = document.getElementById('sdPdfToast');
  let timer;
  document.querySelectorAll('[data-rx-form]').forEach(link => {
    const url = window.SIMPLY_DENTRIX_CONFIG.rxForms[link.dataset.rxForm];
    if (url) link.href = url;
    link.addEventListener('click', event => {
      if (url) return;
      event.preventDefault();
      toast.textContent = 'This form is currently unavailable. Please contact Simply Dentrix for a copy.';
      toast.classList.add('sd-show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('sd-show'), 4200);
    });
  });
})();
