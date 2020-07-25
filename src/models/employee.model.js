const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const employeeSchema = new Schema({
  fullName: {
    type: String,
    required: 'El nombre completo no puede estar vacío.',
    trim: true,
  },
  hireDate: {
    type: Date,
    required: 'La fecha de contratación no puede estar vacía.',
  },
  isPermanent: {
    type: Boolean,
  },
  salary: {
    type: Number,
    required: 'El salario no puede estar vacío.',
  },
});

employeeSchema.plugin(mongoosePaginate);
module.exports = model('Employee', employeeSchema);
