var {WAConnection} = require('@adiwajshing/baileys');
var {StringSession} = require('./whatsasena/');

class printqr{
    constructor(){
        this.conn = new WAConnection();
        this.Session = new StringSession();
        this.conn.logger.level = 'warn';
        this.conn.regenerateQRIntervalMs = 50000;
        this.qrstring = "";
        
    }
    
    iniciar(){
        this.conn.on('connecting', async () => {
            console.log('Connecting to Whatsapp... Please Wait.');
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

        
        return this.Session.createStringSession(this.conn.base64EncodedAuthInfo());
    }
    
}

const express = require('express');;
const app = express();
var path = require('path');
const port = 3000;
user1 = new printqr();
iniciado = false


app.get('/', (req, res) => {
    if (iniciado == false){
        user1.iniciar()
        res.sendFile(path.join(__dirname + '/index.html'))
        iniciado = true
    }
    else{
        res.sendFile(path.join(__dirname + '/index.html'))
    }
});

app.get('/qr', (req, res) => {
    
    res.send(user1.pegarqr());
});

app.get('/string', (req, res) => {
        
    res.send(user1.string());

});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
});

