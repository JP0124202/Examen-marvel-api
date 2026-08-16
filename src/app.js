const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const heroesRoutes = require('./routes/heroes.routes');
const misionesRoutes = require('./routes/misiones.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

dotenv.config();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Marvel API backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/heroes', heroesRoutes);
app.use('/api/misiones', misionesRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

module.exports = app;
