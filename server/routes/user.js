const exp = require("express");
const router = exp.Router();
const userCon = require("../controllers/userCon");

router.get("/", userCon.view);
router.post("/", userCon.find);
router.get("/adduser", userCon.form);
router.post("/adduser", userCon.create);
router.get("/edit/:id", userCon.edit);
router.post("/edit/:id", userCon.update);
router.get("/view/:id", userCon.see);
router.get("/:id", userCon.delete);

module.exports = router;

//DELETE issues Modify
