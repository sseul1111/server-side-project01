const express = require("express");
const app = express();
var path = require("path");
var dataService = require('./data-service.js')

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public')); 

// setting up default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/home.html"));
});

// setting up route for /about
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.get("/employees", (req, res) => {
  dataService.getAllEmployees()
  .then((data) => res.json(data))
  .catch((err) => res.json({"message" : err}))
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
