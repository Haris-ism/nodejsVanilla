const fs = require('fs')
const path = require('path')
const pathDir = path.join(path.dirname(process.mainModule.filename), './data/data.json')
exports.mainRoutes = (req, res) => {
    const url = req.url
    const method = req.method
    const params = url.match(/(?<=\/(delete|put)\/).+/)
    const header = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE,PATCH'
    }
    if (url === '/' && method === 'GET') {
        res.writeHead(200, header)
        return res.end(JSON.stringify({ message: 'welcome home' }))
    }
    if (url === '/write' && method === 'POST') {
        let body = ''
        const rawData = fs.readFileSync(pathDir)
        const currentData = JSON.parse(rawData.toString())
        req.on('data', chunk => {
            body += chunk.toString()
        })
        req.on('end', () => {
            const inputBody = JSON.parse(body)
            inputBody.id = Math.random()
            currentData.push(inputBody)
            fs.writeFileSync(pathDir, JSON.stringify(currentData))
        })
        res.writeHead(200, header)
        return res.end(JSON.stringify({ message: 'write success' }))
    }
    if (url === '/read' && method === 'GET') {
        const currentData = fs.readFileSync(pathDir)
        res.writeHead(200, header)
        return res.end(currentData.toString())
    }
    if (url === `/delete/${params[0]}` && method === 'DELETE') {
        const id = params[0]
        const rawData = fs.readFileSync(pathDir)
        const currentData = JSON.parse(rawData)
        const foundID = currentData.find(item => item.id == id)
        const idx = currentData.indexOf(foundID)
        currentData.splice(idx, 1)
        fs.writeFileSync(pathDir, JSON.stringify(currentData))
        res.writeHead(200, header)
        return res.end(JSON.stringify({ message: "delete success" }))
    }
    if (url === `/put/${params[0]}` && method === 'PUT') {
        const id = Number(params[0])
        let body = ''
        const rawData = fs.readFileSync(pathDir)
        const currentData = JSON.parse(rawData)
        const foundID = currentData.find(item => item.id == id)
        const idx = currentData.indexOf(foundID)
        req.on('data', chunk => {
            body += chunk.toString()
        })
        req.on('end', () => {
            const inputBody = JSON.parse(body)
            currentData[idx] = { id, ...inputBody }
            console.log(currentData)
            fs.writeFileSync(pathDir, JSON.stringify(currentData))
        })
        res.writeHead(200, header)
        return res.end(JSON.stringify({ message: "edit success" }))
    }
    res.writeHead(400, header)
    res.end(JSON.stringify({ message: 'invalid action' }))
}