(function () {
    const buttons = document.querySelectorAll(".sd-tab-btn");
    const panels = document.querySelectorAll(".sd-tab-panel");

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const tabId = button.getAttribute("data-tab");

        buttons.forEach(function (btn) {
          btn.classList.remove("active");
        });

        panels.forEach(function (panel) {
          panel.classList.remove("active");
        });

        button.classList.add("active");

        const activePanel = document.getElementById("sd-tab-" + tabId);
        if (activePanel) {
          activePanel.classList.add("active");
        }
      });
    });
  })();
