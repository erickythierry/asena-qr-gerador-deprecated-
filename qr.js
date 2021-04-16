/*
        author: Thierry
        repository: https://github.com/erickythierry/asena-qr-gerador

*/
var {WAConnection} = require('@adiwajshing/baileys');
var {StringSession} = require('./whatsasena/');

class printqr{
    constructor(){
        this.conn = new WAConnection();
        this.Session = new StringSession();
        this.conn.logger.level = 'warn';
        this.qrstring = "";
        this.iniciado = false
        this.conectado = false
    }
    
    iniciar(){
        this.conn.on('connecting', async () => {
            console.log('Connecting to Whatsapp... Please Wait.');
            this.iniciado = true
        });
        
        this.conn.on('qr', qr => {
            this.qrstring = qr;
        });
        
        this.conn.on('credentials-updated', () => {
            this.conectado = true;
        });
            
        this.conn.connect();
    }
    pegarqr(){
        return this.qrstring;
    }
    string(){
        var texto = this.Session.createStringSession(this.conn.base64EncodedAuthInfo());
        this.conn.close();
        return texto;
    }
    rodando(){
        return this.iniciado;
    }
    conectado(){
        return this.conectado
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
    if (user.conectado){
        res.send(user.string());
    }else{
        res.send('escaneie o QR code');
    }
    

});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`listening on port ${PORT}`)
});

