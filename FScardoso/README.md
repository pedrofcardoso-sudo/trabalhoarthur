# FS CARDOSO POKÉMON — Site institucional + Loja Online

Projeto acadêmico (1º Bimestre) — site responsivo com Bootstrap 5 para a loja
fictícia FS CARDOSO POKÉMON (cartas colecionáveis), com carrinho de compras e
sistema de pagamento simulado em Python.

## Estrutura de pastas

```
site/
├── index.html          → Página inicial (navbar, carrossel, destaques, depoimentos, FAQ)
├── sobre.html           → Sobre Nós (história, missão/visão/valores, linha do tempo)
├── produtos.html         → Loja online (catálogo, filtros, carrinho, checkout)
├── equipe.html          → Página da equipe
├── contato.html          → Formulário de contato + mapa
├── pagamento.html        → Confirmação de pagamento (pós-checkout)
├── css/estilo.css        → Estilo próprio (paleta, tipografia, componente "holo-card")
├── js/script.js          → Catálogo, carrinho de compras e integração com o backend
├── img/                  → Logo e ilustrações originais (SVG)
├── assets/mapa.html      → Embed do Google Maps (Asa Sul, Brasília)
└── backend/
    ├── app.py            → API Flask que processa o pagamento simulado
    └── requirements.txt
```

## Como rodar o site

O site é 100% estático — basta abrir `index.html` no navegador ou usar a
extensão "Live Server" do VS Code.

## Como rodar o sistema de pagamento em Python (opcional)

O botão **Finalizar Compra** (ícone de sacola) tenta se conectar ao backend
Python. Se ele não estiver rodando, o site simula a aprovação do pagamento
localmente, então a demonstração funciona mesmo sem o backend ativo.

Para ativar o pagamento "de verdade" (processado pelo Flask):

```bash
cd backend
pip install -r requirements.txt
python app.py
```

O servidor sobe em `http://localhost:5000`. Deixe-o rodando e use o site
normalmente — o carrinho enviará o pedido para `POST /api/pagamento`.

## Observação sobre as imagens

Todas as ilustrações (logo, banners, cartas, avatares) são artes originais
em SVG criadas para este projeto, sem uso de artes ou logotipos oficiais da
franquia Pokémon, para evitar qualquer violação de direitos autorais/marca.
Sinta-se à vontade para substituí-las por fotos/artes próprias antes de
publicar o site.
