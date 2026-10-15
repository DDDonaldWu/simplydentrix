(function () {
    const compare = document.getElementById('htzCompare');
    if (!compare) return;

    compare.addEventListener('click', function () {
      const switched = compare.classList.toggle('is-switched');
      compare.setAttribute('aria-pressed', String(switched));
    });
  })();
