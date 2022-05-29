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

//****************** APP.GET ******************
// setting up default route
app.get("/", function(req, res) {
  res.render("home", {});
});

app.get("/about", function(req, res) {
  res.render("about", {});
});

app.get("/employees/add", function(req, res) {
  dataService.getDepartments()
  .then((data) => res.render("addemployee", { departments: data }))
  .catch(() => res.render("addEmployee", { departments: []}))
});

app.get("/images/add", function(req, res) {
  res.render("addImage");
});

app.get('/images', function(req, res) {
    fs.readdir("./public/images/uploaded", function(err, items){
        //res.json({images:items});
        res.render("images", {"images": items});
    });
});

app.get("/employees", function(req, res) {
  if(req.query.status) {
    dataService.getEmployeesByStatus(req.query.status)
    .then((data) => {
      if(data.length > 0) {
        res.render("employees", {employees: data});
      } else {
        res.render("employees", {message: "no result"});
      }
    })
    .catch(() => res.render({message: "no result"}));
  }
  else if(req.query.department) {
    dataService.getEmployeesByDepartment(req.query.department)
    .then((data) => {
      if(data.length > 0) {
        res.render("employees", {employees: data});
      } else {
        res.render("employees", {message: "no result"});
      }
    })
    .catch(() => res.render({message: "no result"}));
  }
  else if(req.query.manager) {
    dataService.getEmployeesByManager(req.query.manager)
    .then((data) => {
      if(data.length > 0) {
        res.render("employees", {employees: data});
      } else {
        res.render("employees", {message: "no result"});
      }
    })
    .catch(() => res.render({message: "no result"}));
  }
  else {
    dataService.getAllEmployees()
    .then((data) => {
      if(data.length > 0) {
        res.render("employees", {employees: data});
      } else {
        res.render("employees", {message: "no result"});
      }
    })
    .catch(() => res.render({message: "no result"}));
  }
});

app.get("/employee/:empNum", function(req, res) {
  //initialize an empty object to store the values
  let viewData = {};
  dataService.getEmployeeByNum(req.params.empNum)
  .then((data) => {
    if(data) {
      viewData.employee = data;       // store employee data in the "viewData" object as "employee"
    } else {
      viewData.employee = null;       // set employee to null if none were returned
    }
  })
  .catch(() => {
    viewData.employee = null;         // set employee to null if there was an error
  })
  .then(dataService.getDepartments)
  .then((data) => {
    viewData.departments = data;      // store department data in the "viewData" object as "departments"
    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching 
    // viewData.departments object
    for (let i = 0; i < viewData.departments.length; i++) {
      if(viewData.departments[i].departmentId == viewData.employee.department) {
        viewData.departments[i].selected = true;
      }
    }
  })
  .catch(() => {
    viewData.departments = [];        // set departments to empty if there was an error
  })
  .then(() => {
    if(viewData.employee == null) {
      res.status(404).send("Employee Not Found");
    } else {
      res.render("employee", { viewData: viewdata })
    }
  });
});

// app.get("/managers", (req, res) => {
//   dataService.getManagers()
//   .then((data) => res.json(data))
//   .catch((err) => res.json({"message" : err}))
// });

app.get("/departments", function(req, res) {
  dataService.getDepartments()
  .then((data) => {
    if(data.length > 0) {
      res.render("departments", {departments: data});
    } else {
      res.render("departments", {message: "no result"});
    }
  })
  .catch(() => res.render({message: "no result"}));
});

app.get('/departments/add', (req, res) => {
  res.render('addDepartment');
});

app.get('/department/:departmentId', (req, res) => {
  dataService.getDepartmentById(req.params.departmentId)
  .then((data) => {
    if(data.length > 0) {
      res.render("department", { department: data });
    } else {
      res.status(404).send("Department Not Found");
    }
  })
  .catch(() => { res.status(404).send("Department Not Found")});
});

app.get('/departments/delete/:departmentId', (req, res) => {
  dataService.deleteDepartmentById(req.params.departmentId)
  .then((data) => res.redirect('/departments'))
  .catch(() => res.status(500).send("Unable to Remove Department / Department not found)"));
});


//****************** APP.POST ******************
app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.post("/employees/add", (req, res) => {
  dataService.addEmployee(req.body)
  .then(() => res.redirect("/employees"))
  .catch((err) => res.json({ "message": err}))
});

app.post("/employee/update", (req, res) => {
  dataService.updateEmployee(req.body)
  .then(() => res.redirect("/employees"))
  .catch((err) => res.json({ "message": err}))
});

app.post("/departments/add", (req, res) => {
  dataService.addDepartment(req.body)
  .then(() => res.redirect("/departments"))
  .catch((err) => res.json({ "message": err}))
});

app.post("/departments/update", (req, res) => {
  dataService.updateDepartment(req.body)
  .then(() => res.redirect("/departments"))
  .catch((err) => res.json({ "message": err}))
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
