var http = require('http');
var url = require('url');
var path = require('path');

var fs = require('fs');

var server = http.createServer(handleRequest);
var port = process.env.PORT || 8080;
server.listen(port);

console.log('Server start on port 8080!');

function handleRequest(req, res) {
    var pathname = req.url;
    if (pathname == '/') {
        pathname = '/index.html';
    }

    var ext = path.extname(pathname)

    var typeExt = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript'
    }

    var contentType = typeExt[ext] || 'text/plain';

    fs.readFile(__dirname + pathname, (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading' + pathname);
        }

        res.writeHead(200, { "Content-Type": contentType });
        res.end(data)
    })
}

var io = require("socket.io").listen(server);
io.sockets.on("connection", socket => {
    console.log('we have a new client:' + socket.id);
    socket.on('mouse', data => {
        console.log('received: ' + data.x0 + ' ' + data.y0 + ',' + data.x1 + ' ' + data.y1)
        socket.broadcast.emit('drawing', data)
    })

    socket.on('disconnect', () => {
        console.log('Client has disconnect!')
    })
})