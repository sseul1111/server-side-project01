// declare data arrays
var employees = new Array();
var departments = new Array();

var fs = require('fs');
var exports = module.exports = {};


exports.initialize = function() {
  fs.readFile('./data/employees.json', 'utf-8', (err, data) => {employees = JSON.parse(data);});
  fs.readFile('./data/departments.json', 'utf-8', (err, data) => {departments = JSON.parse(data);});

  return new Promise((resolve, reject) => {
    resolve("Successful!!!");
    reject("unable to read file");
  });
};

exports.getAllEmployees = function() {
  return new Promise((resolve, reject) => {
    resolve(employees);
    if(employees.length == 0) {
      reject("no results returned");
    }
  });
};

exports.getManagers = function() {
  return new Promise((resolve, reject) => {
    let manager = employees.filter(employees => employees.isManager == true);
    resolve(manager);
    if(employees.length == 0) {
      reject("no results returned");
    }
  });
};

exports.getDepartments = function() {
  return new Promise((resolve, reject) => {
    resolve(departments);
    if(departments.length == 0) {
      reject("no results returned");
    }
  })
};
