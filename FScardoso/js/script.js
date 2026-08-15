/* =====================================================================
   FS CARDOSO POKÉMON — script.js
   - Efeito de navbar ao rolar a página
   - Animação de "reveal" ao entrar na viewport
   - Catálogo de produtos + carrinho de compras (persistido em localStorage)
   - Integração do "Finalizar Compra" com o backend Python (Flask)
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar com sombra ao rolar ---------- */
  const nav = document.querySelector('.navbar-fs');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 20 ? '0 8px 24px rgba(0,0,0,.45)' : 'none';
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll('.ano-atual').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- Validação simples do formulário de contato ---------- */
  const contatoForm = document.getElementById('formContato');
  if (contatoForm) {
    contatoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contatoForm.checkValidity()) {
        e.stopPropagation();
        contatoForm.classList.add('was-validated');
        return;
      }
      const alertBox = document.getElementById('contatoAlert');
      alertBox.classList.remove('d-none');
      contatoForm.reset();
      contatoForm.classList.remove('was-validated');
      setTimeout(() => alertBox.classList.add('d-none'), 6000);
    });
  }

  /* ---------- Carrinho ---------- */
  if (typeof CARRINHO !== 'undefined') CARRINHO.init();
});

/* =====================================================================
   CATÁLOGO — usado em produtos.html
   ===================================================================== */
const CATALOGO = [
  { id: 'p1', nome: 'Booster Pack — Chamas Ancestrais', tipo: 'Pacote', energia: 'Fogo', preco: 24.90, img: 'img/pacote1.svg', numero: '001/060' },
  { id: 'p2', nome: 'Booster Pack — Correntes de Água Profunda', tipo: 'Pacote', energia: 'Água', preco: 24.90, img: 'img/pacote2.svg', numero: '014/060' },
  { id: 'p3', nome: 'Carta Ultra Rara — Fera do Vulcão', tipo: 'Avulsa', energia: 'Fogo', preco: 89.90, img: 'img/carta1.svg', numero: '025/060' },
  { id: 'p4', nome: 'Carta Holográfica — Guardião da Floresta', tipo: 'Avulsa', energia: 'Grama', preco: 74.50, img: 'img/carta2.svg', numero: '033/060' },
  { id: 'p5', nome: 'Deck Temático Completo — Trovão Elétrico', tipo: 'Deck', energia: 'Elétrico', preco: 129.90, img: 'img/deck1.svg', numero: '045/060' },
  { id: 'p6', nome: 'Álbum Fichário 9-Bolsos (180 cartas)', tipo: 'Acessório', energia: '—', preco: 69.90, img: 'img/binder1.svg', numero: '058/060' },
];

/* =====================================================================
   CARRINHO DE COMPRAS
   ===================================================================== */
const CARRINHO = {
  KEY: 'fscardoso_carrinho',

  ler() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch (e) { return []; }
  },

  salvar(itens) {
    localStorage.setItem(this.KEY, JSON.stringify(itens));
    this.atualizarBadge();
  },

  adicionar(id) {
    const produto = CATALOGO.find(p => p.id === id);
    if (!produto) return;
    const itens = this.ler();
    const existente = itens.find(i => i.id === id);
    if (existente) existente.qtd += 1;
    else itens.push({ id, qtd: 1 });
    this.salvar(itens);
    this.renderOffcanvas();
    this.mostrarToast(`${produto.nome} adicionada ao carrinho!`);
  },

  remover(id) {
    const itens = this.ler().filter(i => i.id !== id);
    this.salvar(itens);
    this.renderOffcanvas();
  },

  alterarQtd(id, delta) {
    const itens = this.ler();
    const item = itens.find(i => i.id === id);
    if (!item) return;
    item.qtd += delta;
    if (item.qtd <= 0) return this.remover(id);
    this.salvar(itens);
    this.renderOffcanvas();
  },

  total() {
    return this.ler().reduce((soma, i) => {
      const p = CATALOGO.find(p => p.id === i.id);
      return soma + (p ? p.preco * i.qtd : 0);
    }, 0);
  },

  quantidadeTotal() {
    return this.ler().reduce((soma, i) => soma + i.qtd, 0);
  },

  atualizarBadge() {
    document.querySelectorAll('.cart-badge').forEach(b => b.textContent = this.quantidadeTotal());
  },

  mostrarToast(msg) {
    const el = document.getElementById('cartToast');
    if (!el) return;
    el.querySelector('.toast-body').textContent = msg;
    new bootstrap.Toast(el, { delay: 2200 }).show();
  },

  renderOffcanvas() {
    const lista = document.getElementById('cartItemsList');
    const totalEl = document.getElementById('cartTotal');
    if (!lista) return;
    const itens = this.ler();
    if (itens.length === 0) {
      lista.innerHTML = '<p class="text-paper-dim text-center py-4">Seu carrinho está vazio. Explore os produtos e adicione suas cartas favoritas!</p>';
    } else {
      lista.innerHTML = itens.map(i => {
        const p = CATALOGO.find(p => p.id === i.id);
        if (!p) return '';
        return `
        <div class="cart-item">
          <img src="${p.img}" alt="${p.nome}">
          <div class="flex-grow-1">
            <div class="small fw-bold">${p.nome}</div>
            <div class="text-paper-dim small">R$ ${p.preco.toFixed(2).replace('.', ',')}</div>
            <div class="d-flex align-items-center gap-2 mt-1">
              <button class="qty-btn" onclick="CARRINHO.alterarQtd('${p.id}',-1)">−</button>
              <span>${i.qtd}</span>
              <button class="qty-btn" onclick="CARRINHO.alterarQtd('${p.id}',1)">+</button>
              <button class="btn btn-sm btn-link text-danger ms-auto p-0" onclick="CARRINHO.remover('${p.id}')">remover</button>
            </div>
          </div>
        </div>`;
      }).join('');
    }
    if (totalEl) totalEl.textContent = `R$ ${this.total().toFixed(2).replace('.', ',')}`;
    this.atualizarBadge();
  },

  init() {
    this.atualizarBadge();
    this.renderOffcanvas();
    const offcanvasEl = document.getElementById('offcanvasCarrinho');
    if (offcanvasEl) offcanvasEl.addEventListener('show.bs.offcanvas', () => this.renderOffcanvas());
  },

  /* ---------- Finalizar compra: integra com o backend Python (Flask) ---------- */
  async finalizarCompra() {
    const itens = this.ler();
    if (itens.length === 0) {
      alert('Seu carrinho está vazio! Adicione cartas antes de finalizar a compra.');
      return;
    }
    const btn = document.getElementById('btnFinalizarCompra');
    const textoOriginal = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Processando pagamento...';

    const pedido = {
      itens: itens.map(i => {
        const p = CATALOGO.find(p => p.id === i.id);
        return { id: i.id, nome: p.nome, preco: p.preco, qtd: i.qtd };
      }),
      total: this.total()
    };

    try {
      const resposta = await fetch('http://localhost:5000/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });
      if (!resposta.ok) throw new Error('Servidor de pagamento indisponível');
      const dados = await resposta.json();
      this.exibirConfirmacao(dados, pedido);
    } catch (erro) {
      /* Backend Python (backend/app.py) não está rodando localmente —
         simula a confirmação no navegador para fins de demonstração. */
      console.warn('Backend de pagamento (Flask) não respondeu, simulando localmente:', erro);
      const dadosSimulados = {
        status: 'aprovado',
        pedido_id: 'FS-' + Math.floor(100000 + Math.random() * 899999),
        mensagem: 'Pagamento simulado localmente (backend Python offline).'
      };
      this.exibirConfirmacao(dadosSimulados, pedido);
    } finally {
      btn.disabled = false;
      btn.innerHTML = textoOriginal;
    }
  },

  exibirConfirmacao(dados, pedido) {
    localStorage.setItem('fscardoso_ultimo_pedido', JSON.stringify({ ...dados, pedido }));
    localStorage.removeItem(this.KEY);
    window.location.href = 'pagamento.html';
  }
};
