const http = require('http');

const app = require('../app');

const HOST = '0.0.0.0'
const PORT = process.env.PORT || 8080;

app.set('port', PORT);

const server = http.createServer(app);

server.listen(PORT, HOST, () => console.log(`Server is running at http://localhost:${PORT} 🚀`));