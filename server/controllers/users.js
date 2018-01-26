const userService = require("../services/users");

module.exports = {
  // add a user
  create(req, res) {
    id = req.body.id,
      email = req.body.email,
      name = req.body.name,
      imageUrl = req.body.imageUrl,
      roleId = req.body.roleId || 2,
      userService.create(id, email, name, imageUrl, roleId).then(user => {
        if (user === "Resolved") {
          return res.status(200).send({message: "This user already exists"});
        }
        res.status(201).send({ data: user, status: "success" });
      }).catch(error => {
        res.status(400).send(error);
      });
  }
}
