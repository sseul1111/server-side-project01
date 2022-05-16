const express = require("express");
const app = express();
const path = require("path");
const dataService = require('./data-service.js');
const multer = require("multer");
const bodyParser = require("body-parser");
var fs = require('fs');
const handlebar = require("express-handlebars");

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.engine('.hbs', handlebar.engine({ 
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    navLink: function(url, options){
      return '<li' + 
          ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
          '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
          return options.inverse(this);
      } else {
          return options.fn(this);
      }
    }  
  }
}));
app.set('view engine', '.hbs');


// setting up default route
app.get("/", function(req, res) {
  res.render("home", {});
});

// setting up route for /about
app.get("/about", function(req, res) {
  res.render("about", {});
});

app.get("/employees/add", function(req, res) {
  res.render("addEmployee", {});
});

app.get("/images/add", function(req, res) {
  res.render("addImage", {});
});

app.get('/images', function(req, res) {
    fs.readdir("./public/images/uploaded", function(err, items){
        //res.json({images:items});
        res.render("images", {"images": items});
    });
});

app.get("/employees", (req, res) => {
  if(req.query.status) {
    dataService.getEmployeesByStatus(req.query.status)
    .then((data) => res.json(data))
    .catch((err) => res.json({"message" : err}))
  }
  else if(req.query.department) {
    dataService.getEmployeesByDepartment(req.query.department)
    .then((data) => res.json(data))
    .catch((err) => res.json({"message" : err}))
  }
  else if(req.query.manager) {
    dataService.getEmployeesByManager(req.query.manager)
    .then((data) => res.json(data))
    .catch((err) => res.json({"massage" : err}))
  }
  else {
    dataService.getAllEmployees()
    .then((data) => res.json(data))
    .catch((err) => res.json({"message" : err}))
  }
});

app.get("/employee/:employeeNum", (req, res) => {
  dataService.getEmployeeByNum(req.params.employeeNum)
  .then((data) => res.json(data))
  .catch((err) => res.json({"message" : err}));
});

app.get("/managers", (req, res) => {
  dataService.getManagers()
  .then((data) => res.json(data))
  .catch((err) => res.json({"message" : err}))
});

app.get("/departments", (req, res) => {
  dataService.getDepartments()
  .then((data) => res.json(data))
  .catch((err) => res.json({"message" : err}))
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.post("/employees/add", (req, res) => {
  dataService.addEmployee(req.body)
  .then(() => res.redirect("/employees"));
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

dataService.initialize()
.then((data) => {
  app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
})
.catch(() => {
  console.log("unable to initialize");
})
