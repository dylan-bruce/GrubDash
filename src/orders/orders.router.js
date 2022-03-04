// Add two routes /orders and /orders/:orderId and attach the 
// handlers [ create -post(controller.create), read -get(controller.read), 
// update -put(controller.update), delete -delete(controller.delete), and list -get(controller.list) ] 
// from orders.controller

const router = require("express").Router();

const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /orders routes needed to make the tests pass

// /orders/:orderId - read, update, delete 
router.route("/:orderId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

// /orders - list, create
router.route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

  
module.exports = router;
