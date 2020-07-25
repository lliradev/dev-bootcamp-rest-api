require('./config/passport.config');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('./libs/multer');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('src/config/swagger.yaml');

// Inicializando
const app = express();
require('./database');

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multer.single('imagePath'));
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    var valErrors = [];
    Object.keys(err.errors).forEach((key) =>
      valErrors.push(err.errors[key].message)
    );
    res.status(422).send(valErrors);
  } else {
    console.log(err);
  }
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
    error: {
      message: error.message,
    },
  });
});

// Routes
app.use('/api', require('./routes/auth.routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/employees', require('./routes/employee.routes'));

module.exports = app;
