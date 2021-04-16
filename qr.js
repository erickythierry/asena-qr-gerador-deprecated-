var {WAConnection} = require('@adiwajshing/baileys');
var {StringSession} = require('./whatsasena/');

class printqr{
    constructor(){
        this.conn = new WAConnection();
        this.Session = new StringSession();
        this.conn.logger.level = 'warn';
        this.qrstring = "";
        this.iniciado = false
    }
    
    iniciar(){
        this.conn.on('connecting', async () => {
            console.log('Connecting to Whatsapp... Please Wait.');
            this.iniciado = true
        });
        this.conn.on('qr', qr => {
            this.qrstring = qr;
        });
            
        this.conn.connect();
    }
    pegarqr(){
        return this.qrstring;
    }
    string(){
        texto = this.Session.createStringSession(this.conn.base64EncodedAuthInfo());
        this.conn.close();
        return texto;
    }
    rodando(){
        return this.iniciado;
    }
    
}

const express = require('express');;
const app = express();
var path = require('path');
const PORT = process.env.PORT || 5000;
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    user = new printqr();
    if (user.rodando() == false){
        user.iniciar()
        res.sendFile(path.join(__dirname + '/index.html'))
    }
    else{
        res.sendFile(path.join(__dirname + '/index.html'))
    }
});

app.get('/qr', (req, res) => {
    
    res.send(user.pegarqr());
});

app.get('/string', (req, res) => {
        
    res.send(user.string());

});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`listening on port ${PORT}`)
});

