from app import db 

class Userdata(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    idade = db.Column(db.Integer, nullable=False)
    expressao = db.Column(db.Integer, nullable=False)
    
    def to_json(self):
        return {
            "id":self.id,
            "nome":self.nome,
            "idade":self.idade,
            "expressao":self.expressao
        }

 