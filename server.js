const mongoose = require("mongoose")
const Document = require("./Document")
require('dotenv').config()

const db_username = process.env.DB_USERNAME
const db_pw = process.env.DB_PW
const db_cluster = process.env.DB_CLUSTER

mongoose.connect(`mongodb+srv://${db_username}:${db_pw}@${db_cluster}.mongodb.net/`)
    .then(()=>console.log("Connected to database!"))

const defaultValue = ""

const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on("connection", socket => {
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

async function findOrCreateDocument(id) {
    if (id === null) return

    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })

}