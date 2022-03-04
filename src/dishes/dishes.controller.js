//Add handlers and middleware functions to create, read, update, and list dishes.  Dishes CANNOT be deleted

const path = require("path");

// Use the existing dishes data

const dishes = require(path.resolve("src/data/dishes-data"));
//const dishes = require("../data/dishes-data");

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

////////////////////////////////////////////////////////////////////////////////////////

// TODO: Implement the /dishes handlers needed to make the tests pass

function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if(foundDish) {
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish id not found: ${req.params.dishId}`
    });
}
//
function matchingId(req, res, next) {
    const id = req.body.data.id;
    const { dishId } = req.params;
    if (id && id !== dishId) {
        return next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
        });
    }
    return next();
}
//
function bodyHasData(req, res, next) {
    const { data } = req.body;
    const { data: { name, description, image_url, price } } = req.body;
    const properties = ['name', 'description', 'price', 'image_url'];
    for (property of properties) {
        if (
            !data.hasOwnProperty(property) ||
            data[property] === "" ||
            data[property] === null
        ) {
            return next({ status: 400, message: `Dish must include a ${property} property` });
        }
    }
    if (!Number.isInteger(price) || price <= 0) {
        return next({
            status: 400,
            message: `Dish must have a price that is an integer greater than 0`,
        });
    }
    res.locals.name = name;
    res.locals.description = description;
    res.locals.image_url = image_url;
    res.locals.price = price;
    return next();
}
//
function validateDishId(req, res, next) {
	const { dishId } = req.params;
	const { data: { id } = {} } = req.body;

	if(!id || id === dishId || !dishId || id === '' || id === null || id === undefined) {
		return next();
	}

	next({
		status: 400,
		message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
	});
};

////////////////////////////////////////////////////////////////////////////////////////

// List
function list(req, res) {
    res.json({ data: dishes });
}

// Read
function read(req, res) {
    res.json({ data: res.locals.dish });
}

// Create
function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(),
        name: name,
        description: description,
        price: price,
        image_url: image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

// Update
function update(req, res) {
    const updateDish = {
        id: req.params.dishId,
        name: req.body.data.name,
        description: req.body.data.description,
        price: req.body.data.price,
        image_url: req.body.data.image_url,
    };
    res.json({ data: updateDish }); 
};

////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    list,
    read: [
        dishExists,
        read
    ],
    update: [
        dishExists,
        matchingId,
        bodyHasData,
        validateDishId,
        update
    ],
    create: [
        bodyHasData,
        create
    ],
};