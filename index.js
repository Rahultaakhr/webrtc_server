import { Server } from "socket.io"
import dotenv from "dotenv"
dotenv.config()
const io = new Server(process.env.PORT || 3000, {
    cors: { origin: 
        "https://webrtc-client-xi.vercel.app/" 
    }
})

const emailToSocket = new Map();
const socketIdToEmail = new Map();
io.on("connection", (socket) => {
    console.log("socket connected  ", socket.id);

    socket.on("room:join", ({ email, room }) => {

        emailToSocket.set(email, socket.id)
        socketIdToEmail.set(socket.id, email)
        io.to(room).emit("user:joined", { email, id: socket.id })
        socket.join(room)
        io.to(socket.id).emit("room:join", { email, room })
    })
    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer })
    })

    socket.on("call:accepted", ({ to, ans }) => {
      io.to(to).emit("call:accepted",{from:socket.id,ans})
    })
    socket.on("peer:nego:needed",({offer,to})=>{
        io.to(to).emit("peer:nego:needed",{from:socket.id,offer})
    })
    socket.on("peer:nego:done",({to,ans})=>{
        io.to(to).emit("peer:nego:done",{from:socket.id,ans})
    })
})