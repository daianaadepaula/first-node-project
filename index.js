const { request, response } = require('express')
const express = require('express')
const { route } = require('express/lib/application')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())


const orders = []

// middlewares
const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json(`User with id ${request.params.id} was not found`)
    }

    request.orderIndex = index
    request.userId = id      
    
    next()
}

const showMethod = (request, response, next) => {

    const method = request.method
    console.log(`Method: ${method}`)

    const showUrl = request.url
    console.log(`Url: http://localhost:3000${showUrl}`)
    
    next()
}

// all orders
app.get('/orders', showMethod, (request, response) => {
    return response.json(orders)
})

// add a new order
app.post('/orders', showMethod, (request, response) => {
    const { order, clientName, price, status } = request.body
    const demand = { id: uuid.v4(), order, clientName, price, status }

    orders.push(demand)

    return response.status(201).json(demand)
})

// change an order
app.put('/orders/:id', checkOrderId, showMethod, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.userId

    const updateOrder = { id, order, clientName, price, status }
    orders[index] = updateOrder

    return response.json(updateOrder)
})

// change order status
app.patch('/orders/:id', checkOrderId, showMethod, (request, response) => {
    const id = request.userId        

    const chance = orders.filter(order => order.id === id)
    chance.forEach(item => {item.status = "Pronto"})     

    return response.status(201).json(chance)
})

// delete an order
app.delete('/orders/:id', checkOrderId, showMethod, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)
    return response.status(204).json({ message: "User successfully deleted" })
})

// return a specific order
app.get('/orders/:id', checkOrderId, showMethod, (request, response) => {
    const id = request.userId    
    const upOrder = orders.filter(order => order.id === id)    

    return response.status(201).json(upOrder)
})




app.listen(port, () => {
    console.log(`🌎 Server started on port ${port}`)
})