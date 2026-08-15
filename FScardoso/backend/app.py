"""
FS CARDOSO POKÉMON — backend/app.py
Sistema de pagamento simulado em Python (Flask) para a loja online.

Como executar:
    1. cd backend
    2. pip install -r requirements.txt
    3. python app.py
    4. O servidor sobe em http://localhost:5000
    5. Abra o site (produtos.html) normalmente no navegador e clique em
       "Finalizar Compra". O JavaScript (js/script.js) envia o pedido
       para http://localhost:5000/api/pagamento.

Observação: se o backend não estiver rodando, o site simula a confirmação
localmente no navegador para que a experiência de compra continue funcionando
em uma demonstração offline (ver função finalizarCompra em js/script.js).
"""

import random
import string
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # permite que o front-end (aberto como arquivo local) chame a API

# "Banco de dados" simples em memória, só para fins didáticos
PEDIDOS = []


def gerar_id_pedido():
    sufixo = ''.join(random.choices(string.digits, k=6))
    return f"FS-{sufixo}"


def validar_pedido(dados):
    if not dados or "itens" not in dados or not dados["itens"]:
        return "O carrinho está vazio."
    if "total" not in dados or dados["total"] <= 0:
        return "Valor total inválido."
    return None


@app.route("/api/pagamento", methods=["POST"])
def processar_pagamento():
    dados = request.get_json(silent=True)
    erro = validar_pedido(dados)
    if erro:
        return jsonify({"status": "recusado", "mensagem": erro}), 400

    # Simulação de processamento de pagamento (aprovação automática).
    # Em um cenário real, aqui entraria a integração com um gateway
    # de pagamento (Pix, cartão, boleto etc).
    pedido_id = gerar_id_pedido()
    registro = {
        "pedido_id": pedido_id,
        "status": "aprovado",
        "itens": dados["itens"],
        "total": dados["total"],
        "data": datetime.now().isoformat(timespec="seconds"),
    }
    PEDIDOS.append(registro)

    return jsonify({
        "status": "aprovado",
        "pedido_id": pedido_id,
        "mensagem": "Pagamento aprovado com sucesso! Obrigado pela compra."
    }), 200


@app.route("/api/pedidos", methods=["GET"])
def listar_pedidos():
    """Endpoint auxiliar para conferir os pedidos processados (uso interno)."""
    return jsonify(PEDIDOS), 200


@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({"servico": "FS Cardoso Pokémon - Pagamentos", "online": True})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
