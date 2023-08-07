const express = require('express');
const app = express();
require("dotenv").config();
const Router = require('./routes/routes')
const connection = require('./db/config')
app.use (express.json());

app.get('/',(req,res)=>{
  res.send(`<h1>Hello this is watup server </h1>`)
})
app.use('/', Router)
const PORT = process.env.PORT || 3000

connection().then(
  app.listen(PORT,(req,res)=>{
    console.log(`🚀server is running at http://localhost:${PORT}/🚀`)

  })
)


// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// app.get('/', (req, res) => {
//   res.send('<h1>Hello world</h1>');
// });
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
//   });
//   io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
//   });
//   io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//       console.log('message: ' + msg);
//     });
//   });
//   io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); 
//   io.on('connection', (socket) => {
//     socket.broadcast.emit('hi');
//   });
//   io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//       io.emit('chat message', msg);
//     });
//   });
// server.listen(3000, () => {
//   console.log('listening on Port:3000');
// });