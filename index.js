const port = 3000;
const { request, response } = require("express");
const express = require("express");
const uuid = require("uuid");
const server = express();
server.use(express.json());
const orders = [];

const checkId = (request, response, next) => {
  const { id } = request.params;
  const index = orders.findIndex((user) => user.id === id);
  if (index < 0) {
    return response.status(404).json({ error: "User not found" });
  }
  request.orderId = id;
  request.orderIndex = index;
  next();
};

const checkMethodAndUrl = (request, response, next) => {
  console.log(`[METHOD: ${request.method}]  -  URL: ${request.url}`);
  next();
};

server.get("/order", checkMethodAndUrl, (request, response) => {
  return response.json(orders);
});

server.post("/order", checkMethodAndUrl, (request, response) => {
  try{
  const { order, clientName, price } = request.body;
  if(price < 30) throw new Error("Only allowed orders overpriced 30")
  const demand = {
    id: uuid.v4(),
    order,
    clientName,
    price,
    status: "Em preparação",
  };

  orders.push(demand);

  return response.status(201).json(demand);
  } catch(err){
    return response.status(400).json({error: err.message});
  }
});

server.put("/order/:id", checkId, checkMethodAndUrl, (request, response) => {
  const { order, clientName, price } = request.body;

  const index = request.orderIndex; // pega o index dentro da iddleware checkId
  const id = request.orderId; // pega o id dentro da iddleware checkId

  const updatedOrder = { id, order, clientName, price, status: "Em andamento" };

  orders[index] = updatedOrder;
  return response.json(updatedOrder);
});

server.delete("/order/:id", checkId, checkMethodAndUrl, (request, response) => {
  const index = request.orderIndex;
  orders.splice(index, 1);
  return response.status(204).json();
});

server.get("/order/:id", checkId, checkMethodAndUrl, (request, response) => {
  const index = request.orderIndex;
  return response.json(orders[index]);
});

server.patch("/order/:id", checkId, checkMethodAndUrl, (request, response) => {
  const id = request.orderId;
  const index = request.orderIndex;
  const { order, clientName, price } = orders[index];
  const updatedStatus = { id, order, clientName, price, status: "Pronto" };
  orders[index] = updatedStatus;

  return response.json(updatedStatus);
});

server.listen(port, () => {
  console.log(` 🚀  Server started on port ${port}`);
});
