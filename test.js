const express = require('express')
const app = express()
const port = 3000

var os = require('os')
var hostname = os.hostname()

app.get('/', (req, res) => {
    res.send('Hello Virtual Machine! \n The hostname of the current node is: '+hostname)
})

const amqp = require('amqplib/callback_api');
const exchange = 'logs';
let channel = null;

//connect to rabbitmq
 amqp.connect('amqp://test:test@20.108.23.201', function(error0, connection) {
   if (error0) { throw error0;}
   connection.createChannel(function(error1, ch) {
       //setup the exchange
       if (error1) { throw error1; }
       channel = ch;
       ch.assertExchange(exchange, 'fanout', { durable: false });

       //listener
       channel.assertQueue('', {exclusive: true}, function(error2, q) {
         if (error2) { throw error2; }
         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
         channel.bindQueue(q.queue, exchange, '');
         channel.consume(q.queue, function(msg){
           if(msg.content) {
             console.log(" [x] %s", msg.content.toString());
           }
         }, {noAck: true});
       });
     });
   });

   // close the connection on exit
   process.on('exit', (code) => {
     if(channel!=null){
       channel.close();
       console.log("closing rabbitmq channel");
     }
   });

// publisher - message every 3 seconds
 setInterval(function() {
   let message = "Hello world!!!";
   if(channel){
     channel.publish(exchange, '', Buffer.from(message));
     console.log("console log test");
   }
 }, 3000);
