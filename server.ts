var net = require('net');
var db = require('./db')
var tokenizer = require('./tokenizer')
var parser = require('./parser')

var store = db.createStore()

var root = store.create()
root.name = 'root object'
root.motd = 'Cold virgin storage.\n'

var connections = []

function kick(socket) {
    var idx = connections.indexOf(socket)
    console.log('Removing jerk ' + socket.$$id + ' (index ' + idx + ')')
    connections.splice(idx, 1)
    console.log(connections.length + ' connections remaining')
}

function allow(socket) {
    socket.$$id = socket.remoteAddress + ':' + socket.remotePort
    connections.push(socket)
    console.log('Allowing new jerk from ' + socket.$$id + ', connections at ' + connections.length);
}

var server = net.createServer((socket) => {
    allow(socket)

    socket.on('data', (data) => {
        var tokens = tokenizer(data.toString())
        var cmd = parser(tokens)
        console.log(cmd)
        socket.write(data)
    })

    socket.on('close', () => {
        kick(socket)
    });

    socket.on('error', (err) => {
        // The `close` event will be called immediately afterwards:
        // http://nodejs.org/api/net.html#net_event_error_1
        console.log('Jerk from ' + socket.$$id + ' abandoned with: ' + err.toString())
    })
})

server.listen(8888)