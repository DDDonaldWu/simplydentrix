(function () {
    const compare = document.getElementById("sdPfmCompare");
    if (!compare) return;

    function toggleCompare() {
      const switched = compare.classList.toggle("is-switched");
      compare.setAttribute("aria-pressed", String(switched));
    }

    compare.addEventListener("click", toggleCompare);
    compare.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCompare();
      }
    });
  })();
