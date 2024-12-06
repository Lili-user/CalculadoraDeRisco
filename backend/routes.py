import tempfile
from flask import Flask, request, jsonify, send_file
from openpyxl import Workbook
from models import Userdata
from app import db, app
import os

# Rota para obter todos os usuários
@app.route("/api/usuarios", methods=["GET"])
def get_usuarios():
    usuarios = Userdata.query.all()
    result = [usuario.to_json() for usuario in usuarios]
    return jsonify(result)

# Rota para criar um novo usuário
@app.route("/api/usuarios", methods=["POST"])
def create_usuarios():
    try:
        data = request.json
        required_fields = ["nome", "idade", "expressao"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f"Está faltando informação: {field}"}), 400

        new_usuario = Userdata(
            nome=data["nome"],
            idade=data["idade"],
            expressao=data["expressao"]
        )
        db.session.add(new_usuario)
        db.session.commit()

        return jsonify(new_usuario.to_json()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Rota para calcular risco
@app.route("/api/calcular", methods=["POST"])
def calcular():
    try:
        data = request.json
        expressao = data.get("expressao")
        idade = data.get("idade")

        if expressao is None or idade is None:
            return jsonify({"error": "Os campos 'expressao' e 'idade' são obrigatórios."}), 400

        classe_risco = calcular_classe_risco(expressao, idade)
        mensagem = gerar_mensagem(classe_risco)

        return jsonify({
            "classe_risco": classe_risco,
            "mensagem": mensagem
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Rota para exportar os dados para uma planilha Excel
@app.route("/api/exportar-planilha", methods=["GET"])
def exportar_planilha():
    try:
        usuarios = Userdata.query.all()
        if not usuarios:
            return jsonify({"error": "Nenhum dado disponível para exportação."}), 400

        wb = Workbook()
        ws = wb.active
        ws.title = "Dados de Risco"

        # Cabeçalho da planilha
        ws.append(["Nome", "Idade", "Expressão", "Classe de Risco", "Mensagem"])

        for usuario in usuarios:
            classe_risco = calcular_classe_risco(usuario.expressao, usuario.idade)
            mensagem = gerar_mensagem(classe_risco)
            ws.append([usuario.nome, usuario.idade, usuario.expressao, classe_risco, mensagem])

        # Usar um arquivo temporário com a função tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as temp_file:
            temp_file_path = temp_file.name
            wb.save(temp_file_path)

        return send_file(
            temp_file_path,
            as_attachment=True,
            download_name="dados_risco.xlsx",
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

    except Exception as e:
        return jsonify({"error": f"Erro ao gerar a planilha: {str(e)}"}), 500
    finally:
        try:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
        except Exception as e:
            print(f"Erro ao excluir o arquivo temporário: {str(e)}")
            
# Rota para atualizar dados de múltiplos usuários com cálculos
@app.route("/api/usuarios/atualizar-dados", methods=["POST"])
def atualizar_dados_calculados():
    try:
        data = request.json
        if not isinstance(data, list):
            return jsonify({"error": "Os dados enviados devem estar em formato de lista."}), 400

        for item in data:
            usuario = Userdata.query.get(item["id"])
            if usuario:
                usuario.classe_risco = item.get("classe_risco")
                usuario.mensagem = item.get("mensagem")

        db.session.commit()

        return jsonify({"message": "Dados atualizados com sucesso!"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Rota para atualizar um usuário específico
@app.route("/api/usuarios/<int:id>", methods=["PATCH"])
def update_usuario(id):
    try:
        usuario = Userdata.query.get(id)
        if not usuario:
            return jsonify({"error": "Usuário não encontrado."}), 404

        data = request.json
        usuario.nome = data.get("nome", usuario.nome)
        usuario.idade = data.get("idade", usuario.idade)
        usuario.expressao = data.get("expressao", usuario.expressao)

        db.session.commit()

        return jsonify(usuario.to_json()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Rota para deletar um usuário
@app.route("/api/usuarios/<int:id>", methods=["DELETE"])
def delete_usuario(id):
    try:
        usuario = Userdata.query.get(id)
        if not usuario:
            return jsonify({"error": "Usuário não encontrado."}), 404

        db.session.delete(usuario)
        db.session.commit()
        return jsonify({"message": "Usuário deletado com sucesso!"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Funções auxiliares
def calcular_classe_risco(expressao, idade):
    if expressao < 25 and idade < 25:
        return 1
    elif 25 <= expressao < 50 and 25 <= idade < 40:
        return 2
    elif 50 <= expressao < 75 and 40 <= idade < 60:
        return 3
    elif expressao >= 75 and idade >= 60:
        return 4
    else:
        return 2

def gerar_mensagem(classe_risco):
    mensagens = {
        1: "Baixo risco.",
        2: "Risco moderado.",
        3: "Alto risco.",
        4: "Risco elevado."
    }
    return mensagens.get(classe_risco, "Risco desconhecido.")
