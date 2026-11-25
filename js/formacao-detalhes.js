/* Janelas de formação e experiência.
   As imagens e informações são editadas diretamente no index.html.
   O JavaScript só controla a visualização; não define caminhos de arquivos. */
(() => {
  const modal = document.querySelector("#journey-modal");
  if (!modal) return;

  const closeButton = modal.querySelector(".journey-modal-close");
  const media = modal.querySelector(".journey-modal-media");
  const placeholder = modal.querySelector(".journey-modal-placeholder");
  const modalImage = modal.querySelector(".journey-modal-image");
  const extraContainer = modal.querySelector(".journey-modal-extra");
  let lastTrigger = null;

  const showPlaceholder = () => {
    modalImage.hidden = true;
    modalImage.removeAttribute("src");
    placeholder.hidden = false;
  };

  document.querySelectorAll(".journey-card").forEach((card) => {
    const badge = card.querySelector(".journey-card-badge");
    if (badge?.hasAttribute("src") && badge.getAttribute("src")?.trim()) {
      badge.addEventListener("error", () => { badge.hidden = true; });
      if (badge.complete && !badge.naturalWidth) badge.hidden = true;
    }

    const button = card.querySelector(".journey-open");
    const details = card.querySelector("template.journey-details");
    if (!button || !details) return;

    button.addEventListener("click", () => {
      lastTrigger = button;
      modal.querySelector(".journey-modal-category").textContent =
        card.querySelector(".journey-label")?.textContent || "";
      modal.querySelector("#journey-modal-title").textContent =
        card.querySelector("h4")?.textContent || "";
      modal.querySelector(".journey-modal-summary").textContent =
        card.querySelector(":scope > p")?.textContent || "";

      const sourceImage = details.content.querySelector(".journey-detail-image");
      const src = sourceImage?.getAttribute("src")?.trim();
      showPlaceholder();
      if (src) {
        modalImage.alt = sourceImage.getAttribute("alt") || "";
        modalImage.onerror = showPlaceholder;
        modalImage.onload = () => {
          placeholder.hidden = true;
          modalImage.hidden = false;
        };
        modalImage.src = src;
        if (modalImage.complete && modalImage.naturalWidth) {
          placeholder.hidden = true;
          modalImage.hidden = false;
        }
      }

      const extra = details.content.querySelector(".journey-detail-extra");
      extraContainer.replaceChildren(...(extra ? Array.from(extra.childNodes).map(n => n.cloneNode(true)) : []));
      if (typeof modal.showModal === "function") modal.showModal();
    });
  });

  closeButton.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
  modal.addEventListener("close", () => {
    modalImage.onload = null;
    modalImage.onerror = null;
    showPlaceholder();
    lastTrigger?.focus();
  });
})();
