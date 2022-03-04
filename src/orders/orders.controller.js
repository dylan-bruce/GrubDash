//Add handlers and middleware functions to create, read, update, delete, and list orders

const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

////////////////////////////////////////////////////////////////////////////////////////

function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if(foundOrder) {
        res.locals.order = foundOrder;
        return next();
    }
    next({
        status: 404,
        message: `Order id '${orderId}' cannot not found.`
    });
}
//
function bodyHasData(req, res, next) {
    const { data } = req.body;
    const { data: { dishes } = {} } = req.body;
    const properties = ['deliverTo', 'mobileNumber', 'dishes'];
    for (property of properties) {
        if (
            !data.hasOwnProperty(property) ||
            data[property] === "" ||
            data[property] === null || 
            (data[property] === dishes && dishes.length === 0)
        ) {
            return next({ status: 400, message: `Order must include a ${property} property` });
        }
    }
    for (let i = 0; i < dishes.length; i++) {
        if (
            !Array.isArray(dishes) || 
            !dishes[i].quantity || 
            dishes[i].quantity === '' || 
            !Number.isInteger(dishes[i].quantity) || 
            dishes[i].quantity <= 0
        ) {
            return next({ status: 400, message: 'dish needs to be a non-empty array with a quantity of at least 1 or 2, not 0; id' })
        }
    }
    return next();
}
//
function validateStatus(req, res, next) {
	const { orderId } = req.params;
	const { data: { id, status } = {} } = req.body;
  	if(id && id !== orderId) {
        return next({
          status: 400, 
          message: `Order id ${id} does not match route id ${orderId}` 
        })
    } else if(!status) {
        return next({
            status: 400, 
            message: 'status must be present' 
        })
    } else if(status === '') {
        return next({
            status: 400,
            message: 'status cannot be left blank'
        })
    } else if(status !== 'pending' && status !== 'preparing' && status !== 'out-for-delivery') {
        return next({
            status: 400,
            message: 'The order status must either be pending, preparing or out-for-delivery'
        })
    } else if(status === "delivered") {
        return next({
            status: 400,
            message: 'A delivered order cannot be changed'
        })
    } 
    next();
};

////////////////////////////////////////////////////////////////////////////////////////

// List
function list(req, res) {
    res.json({ data: orders });
}

// Read
function read(req, res) {
    res.json({ data: res.locals.order });
}

// Create
function create(req, res) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status: status ? status : 'pending',
        dishes
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}

// Update
function update(req, res) {
    const { deliverTo, mobileNumber, status, dishes } = req.body.data; 
    const updateOrder = {
        id: res.locals.order.id,
        deliverTo,
        mobileNumber,
        status,
        dishes
    }
    res.json({ data: updateOrder });
};

// Delete
function destroy(req, res, next) {
    if(res.locals.order.status !== 'pending') {
        return next({ status: 400, message: 'order must be pending'})
    }
    const deleteId = orders.indexOf(res.locals.order);
    orders.splice(deleteId, 1);
    res.sendStatus(204)
  }

////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    list,
    read: [
        orderExists,
        read
    ],
    update: [
        orderExists,
        bodyHasData,
        validateStatus,
        update
    ],
    create: [
        bodyHasData,
        create
    ],
    delete: [
        orderExists,
        destroy
    ]
};