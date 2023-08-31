const socketio = require('socket.io')
const Document = require("./models/Document")
require('dotenv').config()

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"

const defaultValue = ""

function init(server) {
    const io = socketio(server, {
        cors: {
            origin: CLIENT_URL,
            methods: ['GET', 'POST']
        }
    })
    io.on('connection', socket => {
        socket.on('get-document', async documentId => {
            const document = await findOrCreateDocument(documentId)
            socket.join(documentId)
            socket.emit('load-document', document.data)

            socket.on('send-changes', delta => {
                socket.broadcast.to(documentId).emit("receive-changes", delta)
            })

            socket.on("save-document", async data => {
                await Document.findByIdAndUpdate(documentId, { data })
            })
        })
    })
    return io
}


async function findOrCreateDocument(id) {
    if (id === null) return

    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })

}

module.exports = init