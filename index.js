
const port = 3000
const { request, response } = require("express");
const express = require('express') 
const uuid = require('uuid')
const server = express()
server.use(express.json())
const orders = []



server.get('/order', (request, response) => {
    return response.json(orders)
})

server.post('/order', (request, response) => {
    const {order, clientName, price} = request.body


    const demand = {id:uuid.v4() ,order, clientName, price, status:"Em preparação"}

    orders.push(demand)

    return response.status(201).json(demand)
})

server.put('/order/:id', (request, response) => { 
    const { order, clientName, price, } = request.body
    const {id} = request.params
    const index = orders.findIndex(user => user.id === id)
    if(index<0){
        return response.status(404).json({error: "User not found"})
    }
    const updatedOrder = { id, order, clientName, price, status: "Em andamento" }

    orders[index] = updatedOrder
    return response.json(updatedOrder)
})

server.delete('/order/:id', (request, response) => {
    const {id} = request.params
    const index = orders.findIndex(user => user.id === id)
    if(index<0){
        return response.status(404).json({error: "Order not found"})
    }
    orders.splice(index, 1)
    return response.status(204).json()
})

server.get('/order/:id', (request, response) => {
    const {id} = request.params
    const index = orders.findIndex(user => user.id === id)
    if(index<0){
        return response.status(404).json({error: "User not found"})
    }
    return response.json(orders[index])
})

server.patch('/order/:id', (request, response) => {     
    const {id} = request.params
    const index = orders.findIndex(user => user.id === id)
    if(index<0){
        return response.status(404).json({error: "User not found"})
    }
    const {order, clientName, price} = orders[index]
    const updatedStatus = {id, order, clientName, price, status:"Pronto"}
    orders[index] = updatedStatus

    return response.json(updatedStatus)
})







server.listen(port, () => {
    console.log(` 🚀  Server started on port ${port}`)
})