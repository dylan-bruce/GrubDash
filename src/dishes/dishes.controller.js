//Add handlers and middleware functions to create, read, update, and list dishes.  Dishes CANNOT be deleted

const path = require("path");
const { router } = require("../app");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

////////////////////////////////////////////////////////////////////////////////////////

// TODO: Implement the /dishes handlers needed to make the tests pass

function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === Number(dishId));
    if(foundDish) {
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish id not found: ${dishId}`
    });
}

function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data: {} } = req.params;
        if(data[propertyName]) {
            return next();
        }
        next({
            status: 400,
            message: `Must include a ${propertyName}`
        });
    };
}

////////////////////////////////////////////////////////////////////////////////////////

// List
function list(res) {
    res.json({ data: dishes });
}

// Read
function read(res) {
    res.json({ data: res.locals.use });
}

// Create
function create(res, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId,
        name,
        description,
        price,
        image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

// Update
function update(req, res) {
    const dish = res.locals.dish;
    const { data: { name, description, price, image_url } = {} } = req.body;
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;
}

////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    list,
    read: [
        dishExists,
        read
    ],
    update: [
        dishExists,
        update
    ],
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        create
    ],
};