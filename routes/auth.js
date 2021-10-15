const { Router } = require("express");
const fileMiddleware = require("../middleware/file");
const Admin = require("../models/Admin");
const router = Router();
const bcrypt = require("bcryptjs");

router.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "Login",
  });
});
router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const isExist = await Admin.findOne({login});
    if (isExist) {
      bcrypt.compare(password, isExist.password, (err, succses)=>{
        console.log(succses)
        if (succses) { 
          req.session.isAuth = true; 
          req.session.admin= isExist; 
          req.session.save((err) => { 
            if (err) {
              throw err; 
            } else { 
              res.redirect("/admin");
            }
          });
        }else{
          res.redirect("/auth/login");
        }
      })
    }else {
      res.redirect("/auth/login");
    }
  }catch (err) {
    console.log(err);
  }
});
router.get("/register", (req, res) => {
  res.render("auth/register", {
    title: "Register",
  });
});



router.post("/register", fileMiddleware.single("avatar"), async (req, res) => {
  const { login, name, phone, telegram, instagram, password } = req.body;
  if (req.file) {
    avatar = req.file.filename;
  } else {
    avatar = "";
  }
  const hash =await bcrypt.hash(password, 10)
  const admin = new Admin({
    login,
    name,
    phone,
    telegram,
    instagram,
    password:hash,
    avatar,
  });
  await admin.save();
  res.redirect("/auth/login");
});



router.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("auth/login", {
    title: "Login",
  });
});
module.exports = router;