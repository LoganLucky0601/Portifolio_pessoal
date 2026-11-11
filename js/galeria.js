// Instantes congelados: substitua image: null por "img/galeria/nome-da-foto.jpg"
// e personalize título, categoria e descrições quando as fotos estiverem disponíveis.
document.addEventListener('DOMContentLoaded', () => {
  const entries = [
    { image: null, category: 'Registro pessoal', title: 'Instante 01', description: 'Um espaço reservado para contar a história deste momento.', detail: 'Aqui você poderá compartilhar quando e onde a fotografia foi registrada, o contexto e por que ela é especial.' },
    { image: null, category: 'Minha trajetória', title: 'Instante 02', description: 'Cada fotografia guarda uma história para revisitar.', detail: 'Uma lembrança, um aprendizado ou uma conquista que mereça ficar registrada.' },
    { image: null, category: 'Experiências', title: 'Instante 03', description: 'Momentos que fazem parte de uma trajetória única.', detail: 'Descreva as pessoas, as experiências ou as descobertas que marcaram esta ocasião.' },
    { image: null, category: 'Memórias', title: 'Instante 04', description: 'Detalhes de um dia que merece ser lembrado.', detail: 'Compartilhe o significado por trás desse registro, com suas próprias palavras.' },
    { image: null, category: 'Fragmentos do tempo', title: 'Instante 05', description: 'Um novo capítulo entre tantas histórias.', detail: 'Conte o que aconteceu nesse momento e o que ele representa para você.' }
  ];
  const track = document.querySelector('#memories-track');
  const modal = document.querySelector('#memory-modal');
  if (!track || !modal) return;
  const dots = document.querySelector('#memories-dots');
  const count = document.querySelector('#memories-count');
  const prev = document.querySelector('#memories-prev');
  const next = document.querySelector('#memories-next');
  const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const media = (entry, index) => entry.image
    ? '<img src="' + escapeHtml(entry.image) + '" alt="' + escapeHtml(entry.title) + '" loading="lazy">'
    : '<span class="memory-placeholder-symbol" aria-hidden="true">▧</span><span class="memory-placeholder-label">Sua fotografia ' + String(index + 1).padStart(2, '0') + '</span>';
  track.innerHTML = entries.map((entry, index) =>
    '<article class="memory-card"><button type="button" class="memory-open" data-index="' + index + '" aria-label="Ampliar ' + escapeHtml(entry.title) + '">' +
    '<div class="memory-media">' + media(entry, index) + '</div><div class="memory-body"><p class="memory-category">' + escapeHtml(entry.category) +
    '</p><h3>' + escapeHtml(entry.title) + '</h3><p class="memory-description">' + escapeHtml(entry.description) +
    '</p></div></button></article>'
  ).join('');
  dots.innerHTML = entries.map((_, i) =>
    '<button type="button" class="memories-dot" data-index="' + i + '" aria-label="Ir para fotografia ' + (i+1) + '"></button>'
  ).join('');
  const cards = [...track.querySelectorAll('.memory-card')];
  const dotButtons = [...dots.querySelectorAll('.memories-dot')];
  let current = 0;
  function update(index) {
    current = Math.max(0, Math.min(entries.length - 1, index));
    count.textContent = String(current + 1).padStart(2,'0') + ' / ' + String(entries.length).padStart(2,'0');
    dotButtons.forEach((d,i) => d.setAttribute('aria-current', String(i === current)));
    prev.disabled = current === 0;
    next.disabled = current === entries.length - 1;
  }
  function go(index) {
    index = Math.max(0,Math.min(entries.length-1,index));
    track.scrollTo({left:cards[index].offsetLeft - cards[0].offsetLeft, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    update(index);
  }
  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  dots.addEventListener('click', e => { const b=e.target.closest('[data-index]'); if(b) go(Number(b.dataset.index)); });
  track.addEventListener('scroll', () => {
    const left=track.scrollLeft;
    let nearest=0,dist=Infinity;
    cards.forEach((card,i)=> {const d=Math.abs((card.offsetLeft-cards[0].offsetLeft)-left);if(d<dist){nearest=i;dist=d;}});
    update(nearest);
  }, {passive:true});
  track.addEventListener('click', e => {
    const btn=e.target.closest('.memory-open');if(!btn)return;
    const i=Number(btn.dataset.index),entry=entries[i];
    modal.querySelector('.memory-modal-media').innerHTML=media(entry,i);
    modal.querySelector('.memory-modal-category').textContent=entry.category;
    modal.querySelector('.memory-modal-title').textContent=entry.title;
    modal.querySelector('.memory-modal-description').textContent=entry.detail;
    if(typeof modal.showModal==='function') modal.showModal();
  });
  modal.querySelector('.memory-modal-close').addEventListener('click',()=>modal.close());
  modal.addEventListener('click', e=>{if(e.target===modal)modal.close();});
  update(0);
});
