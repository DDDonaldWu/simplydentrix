/* Preserve native form submission when an endpoint is configured. */
(() => {
  const form = document.querySelector('form');
  const endpoint = window.SIMPLY_DENTRIX_CONFIG.contactFormEndpoint;
  if (endpoint) form.action = endpoint;
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  form.append(status);
  form.addEventListener('submit', event => {
    if (endpoint) return;
    event.preventDefault();
    status.textContent = 'Online inquiries are currently unavailable. Please email simplydentrix@gmail.com or call 714-588-7030.';
  });
})();
