const Employee = require('../models/employee.model');
const employeeCtrl = {};

employeeCtrl.save = async (req, res) => {
  try {
    const newEmployee = new Employee({
      fullName: req.body.fullName,
      hireDate: req.body.hireDate,
      isPermanent: req.body.isPermanent ? req.body.isPermanent : false,
      salary: parseInt(req.body.salary),
    });
    await newEmployee.save();
    res.status(201).send({
      message: 'El empleado se creó con éxito.',
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Se produjo un error al crear el empleado.',
    });
  }
};

employeeCtrl.findAll = async (req, res) => {
  try {
    const searchFullName = req.query.fullName
      ? { fullName: { $regex: req.query.fullName, $options: 'i' } }
      : {};
    const searchHireDate = req.query.hireDate
      ? { hireDate: req.query.hireDate }
      : {};
    const searchIsPermanent = req.query.isPermanent
      ? { isPermanent: req.query.isPermanent }
      : {};
    const searchSalary = req.query.salary
      ? { salary: parseInt(req.query.salary) }
      : {};
    const orderBy = req.query.orderBy ? req.query.orderBy : '_id';
    const shape = req.query.shape ? 'asc' : 'desc';
    const query = {
      ...searchFullName,
      ...searchHireDate,
      ...searchIsPermanent,
      ...searchSalary,
    };
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit, 10) || 5,
      sort: { [orderBy]: shape },
    };
    console.log(query);
    console.log(options);
    const employees = await Employee.paginate(query, options);
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

employeeCtrl.findById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (employee) {
      res.status(200).send(employee);
    } else {
      res.status(404).send({
        message: `No se encontró el empleado con id: ${id}`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Se produjo un error al encontrar el empleado.',
    });
  }
};

module.exports = employeeCtrl;
