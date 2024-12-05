from app import app
from flask import request, jsonify
from models import Userdata
from app import db 

# Get all
@app.route("/api/usuarios", methods=["GET"])
def get_usuarios():
    usuarios = Userdata.query.all()
    result = [usuario.to_json() for usuario in usuarios]  
    return jsonify(result)

# Create 
@app.route("/api/usuarios", methods=["POST"])
def create_usuarios():
    try:
        data = request.json
        
        required_fields = ["nome", "idade", "expressao"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f'Está faltando informação: {field}'}), 400
        
        nome = data.get("nome")
        idade = data.get("idade")
        expressao = data.get("expressao")
    
        new_usuario = Userdata(nome=nome, idade=idade, expressao=expressao)
        db.session.add(new_usuario)
        db.session.commit()
        return jsonify(new_usuario.to_json()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
     
@app.route("/api/usuarios/<int:id>", methods=["DELETE"])
def delete_usuario(id):
    try:
        usuario = Userdata.query.get(id)  
        if usuario is None:
            return jsonify({"error": "Usuário não encontrado."}), 404
        
        db.session.delete(usuario)  
        db.session.commit()
        return jsonify({"msg": "usuario deletado com sucesso"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/usuarios/<int:id>", methods=["PATCH"])
def update_usuario(id):
    usuario = Userdata.query.get(id)
    if not usuario:
        return jsonify({"message": "Usuário não encontrado!"}), 404
    data = request.json
    usuario.nome = data.get("nome", usuario.nome)
    usuario.expressao = data.get("expressao", usuario.expressao)
    usuario.idade = data.get("idade", usuario.idade)
    
    db.session.commit()
    
    return jsonify(usuario.to_json()), 200


@app.route("/api/calcular", methods=["POST"])
def calcular_risco():
    data = request.json
    
    expressao = data.get("expressao")
    idade = data.get("idade")
    
    # Validação
    if expressao is None or idade is None:
        return jsonify({"message": "Por favor, forneça valores para expressão e idade."}), 400
    if not (1 <= expressao <= 100):
        return jsonify({"message": "O valor de expressão deve estar entre 1 e 100."}), 400
    if not (18 <= idade <= 80):
        return jsonify({"message": "A idade deve estar entre 18 e 80 anos."}), 400

    # Lógica
    if expressao < 25 and idade < 25:
        classe_risco = 1
        mensagem = "Baixo risco."
    elif 25 <= expressao < 50 and 25 <= idade < 40:
        classe_risco = 2
        mensagem = "Risco moderado."
    elif 50 <= expressao < 75 and 40 <= idade < 60:
        classe_risco = 3
        mensagem = "Alto risco."
    elif expressao >= 75 and idade >= 60:
        classe_risco = 4
        mensagem = "Risco elevado."
    else:
        classe_risco = 2  
        mensagem = "Risco moderado."

    # Retorna a resposta
    return jsonify({
        "classe_risco": classe_risco,
        "mensagem": mensagem
    }), 200
