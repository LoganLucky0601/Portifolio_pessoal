/* Carrosséis de formação e experiência, no mesmo padrão dos projetos */
document.querySelectorAll(".journey-group").forEach((grupo) => {
    const carrossel = grupo.querySelector(".journey-carousel");
    const controles = grupo.querySelector(".journey-controls");

    if (!carrossel || !controles) return;

    const cards = Array.from(carrossel.querySelectorAll(".journey-card"));
    if (cards.length < 2) return;

    const anterior = controles.querySelector('[data-step="-1"]');
    const proximo = controles.querySelector('[data-step="1"]');
    const posicao = controles.querySelector(".journey-position");
    let atual = 0;

    function distancia(card) {
        const quadro = carrossel.getBoundingClientRect();
        const cartao = card.getBoundingClientRect();
        return cartao.left - quadro.left;
    }

    function atualizar() {
        atual = cards.reduce((maisProximo, card, indice) =>
            Math.abs(distancia(card)) < Math.abs(distancia(cards[maisProximo]))
                ? indice : maisProximo, 0);

        cards.forEach((card, indice) => {
            card.classList.toggle("is-current", indice === atual);
        });

        anterior.disabled = carrossel.scrollLeft <= 1;
        proximo.disabled =
            carrossel.scrollLeft >= carrossel.scrollWidth - carrossel.clientWidth - 1;

        const texto = (proximo.disabled ? cards.length : atual + 1) + " de " + cards.length;
        if (posicao.textContent !== texto) posicao.textContent = texto;
    }

    function navegar(passo) {
        const card = cards[atual + passo];
        if (!card) return;

        const reduzirMovimento =
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        carrossel.scrollBy({
            left: distancia(card),
            behavior: reduzirMovimento ? "auto" : "smooth"
        });
    }

    anterior.addEventListener("click", () => navegar(-1));
    proximo.addEventListener("click", () => navegar(1));
    carrossel.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);

    controles.hidden = false;
    atualizar();
});
