/* Detalhes da trajetória: o conteúdo e os caminhos das imagens são editados
   diretamente nos <template> de cada cartão no index.html. */
(() => {
  const modal = document.querySelector("#journey-modal");
  if (!modal) return;

  const closeButton = modal.querySelector(".journey-modal-close");
  const mainImage = modal.querySelector(".journey-modal-image");
  const placeholder = modal.querySelector(".journey-modal-placeholder");
  const badgeWrap = modal.querySelector(".journey-modal-badge-wrap");
  const badge = modal.querySelector(".journey-modal-badge");
  let lastTrigger = null;

  function updateImage(img, path, alt, onMissing) {
    img.hidden = !path;
    img.removeAttribute("src");
    img.alt = alt || "";
    if (!path) {
      onMissing();
      return;
    }
    img.onerror = () => {
      img.hidden = true;
      onMissing();
    };
    img.src = path;
  }

  document.querySelectorAll(".journey-card .journey-open").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".journey-card");
      const details = card?.querySelector("template.journey-details");
      if (!card || !details) return;

      lastTrigger = button;
      modal.querySelector(".journey-modal-category").textContent =
        card.querySelector(".journey-label")?.textContent || "";
      modal.querySelector("#journey-modal-title").textContent =
        card.querySelector("h4")?.textContent || "";
      modal.querySelector(".journey-modal-period").textContent =
        button.textContent.replace("↗", "").trim();
      modal.querySelector(".journey-modal-summary").textContent =
        card.querySelector(":scope > p:not(.journey-note)")?.textContent || "";

      const more = modal.querySelector(".journey-modal-extra");
      more.replaceChildren(...Array.from(details.content.children).map(node => node.cloneNode(true)));
      const imagePath = details.dataset.image?.trim() || "";
      const badgePath = details.dataset.badge?.trim() || "";
      placeholder.hidden = Boolean(imagePath);
      updateImage(mainImage, imagePath, details.dataset.imageAlt, () => {
        placeholder.hidden = false;
      });
      badgeWrap.hidden = !badgePath;
      updateImage(badge, badgePath, details.dataset.badgeAlt, () => {
        badgeWrap.hidden = true;
      });

      if (typeof modal.showModal === "function") modal.showModal();
    });
  });

  closeButton.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
  modal.addEventListener("close", () => {
    mainImage.removeAttribute("src");
    badge.removeAttribute("src");
    lastTrigger?.focus();
  });
})();
