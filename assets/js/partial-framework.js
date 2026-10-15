(function () {
    const compare = document.getElementById('pfwCompare');
    if (!compare) return;

    compare.addEventListener('click', function () {
      const switched = compare.classList.toggle('is-switched');
      compare.setAttribute('aria-pressed', String(switched));
    });
  })();
