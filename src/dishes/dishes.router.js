// Add two routes /dishes and /dishes/:dishId and attach the 
// handlers [ create -post(controller.create), read -get(controller.read), 
// update -put(controller.update), and list -get(controller.list) ] from dishes.controller

const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass

// dishes/:dishId - read, update
router.route("/:dishId")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

// /dishes - list, create
router.route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

  
module.exports = router;
