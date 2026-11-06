/* Controles independentes dos carrosséis de formação e experiência */
document.querySelectorAll(".journey-group").forEach((grupo) => {
    const carrossel = grupo.querySelector(".journey-carousel");
    const controles = grupo.querySelector(".journey-controls");

    if (!carrossel || !controles) return;

    const cards = Array.from(carrossel.querySelectorAll(".journey-card"));
    if (cards.length < 2) return;

    const anterior = controles.querySelector('[data-step="-1"]');
    const proximo = controles.querySelector('[data-step="1"]');
    const indicador = controles.querySelector(".journey-position");

    function indiceAtual() {
        // Seleciona o card mais próximo da margem esquerda do carrossel.
        let indice = 0;
        let menorDistancia = Infinity;
        cards.forEach((card, i) => {
            const distancia = Math.abs(card.offsetLeft - carrossel.offsetLeft - carrossel.scrollLeft);
            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                indice = i;
            }
        });
        return indice;
    }

    function atualizar() {
        const atual = indiceAtual();
        const final = carrossel.scrollLeft >= carrossel.scrollWidth - carrossel.clientWidth - 2;
        anterior.disabled = carrossel.scrollLeft <= 2;
        proximo.disabled = final;
        indicador.textContent = (final ? cards.length : atual + 1) + " de " + cards.length;
    }

    function navegar(passo) {
        const destino = cards[Math.max(0, Math.min(cards.length - 1, indiceAtual() + passo))];
        const distancia = destino.getBoundingClientRect().left - carrossel.getBoundingClientRect().left;
        const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        carrossel.scrollBy({ left: distancia, behavior: reduzir ? "instant" : "smooth" });
    }

    anterior.addEventListener("click", () => navegar(-1));
    proximo.addEventListener("click", () => navegar(1));
    carrossel.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    controles.hidden = false;
    atualizar();
});
