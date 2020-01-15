const server = require('./server/server.js');


const port = 8000;
server.listen(port, () => console.log(`Server listening on port: ${port}`))