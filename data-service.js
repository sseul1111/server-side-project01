var exports = module.exports = {};

const Sequelize = require('sequelize');
var sequelize = new Sequelize('da0170296n65nk', 'xipdvmogmqlrxa', '308f33670944de7d94211ba515c2440395b17b7374e7dcd66a30f6dcf94262a0', {
  host: 'ec2-44-196-174-238.compute-1.amazonaws.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl:{ rejectUnauthorized: false }
  }
});

const Employee = sequelize.define('Employee', {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoImcrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  hireDate: Sequelize.STRING,
});

const Department = sequelize.define('Department', {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departmentName: Sequelize.STRING
});

Department.hasMany(Employee, {foreignKey: 'department'});

exports.initialize = function() {
  return new Promise((resolve, reject) => {
    sequelize.sync()
    .then(() => resolve())
    .catch(() => reject("unable to sync the database"));
  });
};

exports.getAllEmployees = function() {
  return new Promise((resolve, reject) => {
    Employee.findAll()
    .then(() => resolve(Employee.finsAll()))
    .catch(() => ("no results returned"));
  });
};

// exports.getManagers = function() {
//   return new Promise((resolve, reject) => {
//     let manager = employees.filter(employees => employees.isManager == true);
//     resolve(manager);
//     if(employees.length == 0) {
//       reject("no results returned");
//     }
//   });
// };

exports.getDepartments = function() {
  return new Promise((resolve, reject) => {
    Department.findAll()
    .then(() => resolve(Department.findAll()))
    .catch(() => reject("no results returned"));
  });
};

exports.addEmployee = function(employeeData) {
  employeeData.isManager = (employeeData.isManager) ? true : false;
  for(emptyStr in employeeData) {
    if(emptyStr == "") emptyStr = null;
  }
  return new Promise((resolve, reject) => {
    Employee.create(employeeData)
    .then(() => resolve())
    .catch(() => reject("unable to create employee"));
  });
};

exports.getEmployeesByStatus = function(status) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where:{
        status: status
      }
    })
    .then(() => resolve(Employee.findAll({
      where:{
        status: status
      }
    })))
    .catch(() => reject("no results returned"));
  });
}

exports.getEmployeesByDepartment = function(department) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where:{
        department: department
      }
    })
    .then(() => resolve(Employee.findAll({
      where:{
        department: department
      }
    })))
    .catch(() => reject("no results returned"));
  });
}

exports.getEmployeesByManager = function(magager) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where:{
        employeeManagerNum: magager
      }
    })
    .then(() => resolve(Employee.findAll({
      where:{
        employeeManagerNum: manager
      }
    })))
    .catch(() => reject("no results returned"));
  });
}

exports.getEmployeeByNum = function(num) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where:{
        employeeNum: num
      }
    })
    .then(() => resolve(employee.findAll({
      where:{
        employeeNum: num
      }
    })))
    .catch(() => reject("no results returned"));
  });
}

exports.updateEmployee = function(employeeData) {
  employeeData.isManager = (employeeData.isManager) ? true : false;
  for (emptyStr in employeeData) {
    if (emptyStr == "") emptyStr = null;
  }
  return new Promise((resolve, reject) => {
    Employee.update(employeeData, {
      where:{
        employeeNum: employeeData.employeeNum
      }
    })
    .then(() => resolve(Employee.update(employeeData, {
      where:{
        employeeNum: employeeData.employeeNum
      }
    })))
    .catch(() => reject("unable to update employee"));
  });
}

exports.addDepartment = function(departmentData) {
  for(emptyStr in departmentData) {
    if(emptyStr == "") emptyStr = null;
  }
  return new Promise((resolve, reject) => {
    Department.create(departmentData)
    .then(() => resolve())
    .catch(() => reject("unable to create department"))
  })
}

exports.updateDepartment = function(departmentData) {
  for(emptyStr in departmentData) {
      if(emptyStr == "") emptyStr = null;
  }
  return new Promise((resolve, reject)=>{
      Department.update(departmentData, {
        where:{
          departmentId: departmentData.departmentId
        }
      })
      .then(() => resolve(Department.update(departmentData, {
        where:{
          departmentId: departmentData.departmentId
        }
      })))
      .catch(() => reject("unable to update department"));
  });
};

exports.getDepartmentById = function(id) {
  return new Promise((resolve, reject) => {
    Department.findAll({
      where:{
        departmentId: id
      }
    })
    .then(() => resolve(Department.findAll({
      where:{
        departmentId: id
      }
    })))
    .catch(() => reject("no results returned"))
  });
};

exports.deleteDepartmentById = function(id) {
  return new Promise((resolve, reject) => {
    Department.destroy({
      where:{
        departmentId: id
      }
    })
    .then(() => resolve(Department.destroy({
      where:{
        departmentId: id
      }
    })))
    .catch(() => reject("unable to delete department"))
  });
};

exports.deleteDepartmentByNum = function(empNum) {
  return new Promise((resolve, reject) => {
    Employee.destroy({
      where:{
        employeeNum: empNum
      }
    })
    .then(() => resolve(Employee.destroy({
      where:{
        employeeNum: empNum
      }
    })))
    .catch(() => reject("unable to delete employee"))
  });
}
