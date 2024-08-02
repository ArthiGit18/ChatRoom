const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    fs.stat(filePath, (err, stat) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }

        if (stat.isFile()) {
            let extname = path.extname(filePath);
            let contentType = 'text/html';

            switch (extname) {
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.js':
                    contentType = 'application/javascript';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.jpg':
                    contentType = 'image/jpeg';
                    break;
                case '.gif':
                    contentType = 'image/gif';
                    break;
            }

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error loading file');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(403);
            res.end('Forbidden');
        }
    });
});

const io = require('socket.io')(server);
const port = 5000;

io.on('connection', (socket) => {
    socket.on('send name', (user) => {
        io.emit('send name', user);
    });

    socket.on('send message', (chat) => {
        io.emit('send message', chat);
    });
});

server.listen(port, () => {
    console.log(`Server is listening at the port: ${port}`);
});
