const { db } = require('./src/models/employee.model');

db.employees.find({
  salary: 8,
});

db.employees.find({
  fullName: {
    $regex: 'g',
    $options: 'i',
  },
});
