/* Navegação independente para cada carrossel que utiliza o visual de projetos.
   Funciona tanto na seção Recomendações quanto em Projetos e Soluções. */
document.querySelectorAll(".projects-section").forEach((secao) => {
    const carrossel = secao.querySelector(".projects-carousel");
    const controles = secao.querySelector(".projects-controls");
    if (!carrossel || !controles) return;

    const cartoes = Array.from(carrossel.querySelectorAll(".project-card"));
    if (cartoes.length < 2) return;

    const anterior = controles.querySelector('[data-step="-1"]');
    const proximo = controles.querySelector('[data-step="1"]');
    const posicao = controles.querySelector(".projects-position");
    if (!anterior || !proximo || !posicao) return;

    let atual = 0;

    function distancia(cartao) {
        return cartao.getBoundingClientRect().left -
               carrossel.getBoundingClientRect().left;
    }

    function atualizar() {
        atual = cartoes.reduce((maisProximo, cartao, indice) =>
            Math.abs(distancia(cartao)) < Math.abs(distancia(cartoes[maisProximo]))
                ? indice : maisProximo, 0);

        cartoes.forEach((cartao, indice) => {
            cartao.classList.toggle("is-current", indice === atual);
        });

        anterior.disabled = carrossel.scrollLeft <= 1;
        proximo.disabled =
            carrossel.scrollLeft >= carrossel.scrollWidth - carrossel.clientWidth - 1;

        const texto = (proximo.disabled ? cartoes.length : atual + 1) +
                      " de " + cartoes.length;
        if (posicao.textContent !== texto) posicao.textContent = texto;
    }

    function navegar(passo) {
        const cartao = cartoes[atual + passo];
        if (!cartao) return;

        const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        carrossel.scrollBy({
            left: distancia(cartao),
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
