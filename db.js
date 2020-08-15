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

db.employees.find({
  hireDate: { $gte: { $date: '2020-07-28T00:00:00.000Z' } },
});

db.employees.find({ hireDate: { $gt: ISODate('2020-07-28T00:00:00.000Z') } });

db.employees.find({ hireDate: { $eq: ISODate('2020-07-28T00:00:00.000Z') } });

db.employees.find({ hireDate: { $eq: ISODate('2020-07-28') } });

db.employees.find({ hireDate: { $eq: { $date: '2020-07-28' } } });

db.employees.find({ hireDate: { $gte: ISODate('2020-07-28') } });

const searchHireDate = req.query.hireDate
  ? { hireDate: { $gte: { $date: req.query.hireDate } } }
  : {};

/* itemsPerPage: {
    type: Number,
    default: 5,
  },
  page: {
    type: Number,
    default: 1,
  },
  orderBy: {
    type: String,
    default: '_id',
  },
  shape: {
    type: String,
    default: 'DESC',
  }, */


  const sortOrder = req.query.sort
  ? req.query.sort === 'asc'
    ? { salary: 1 }
    : { salary: -1 }
  : { _id: -1 };