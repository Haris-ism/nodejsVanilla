const http = require('http')
const mainRoutes = require('./routes/mainRoutes')
const server = http.createServer(mainRoutes.mainRoutes)
server.listen(6969, () => console.log("server starts"))