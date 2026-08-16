const pool = require('../src/config/database');
const bcrypt = require('bcrypt');

async function setup() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      rol ENUM('ADMIN','CONSULTA') NOT NULL,
      created_at DATETIME,
      updated_at DATETIME
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS superheroes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL UNIQUE,
      nombre_real VARCHAR(150) NOT NULL,
      poder_principal VARCHAR(150) NOT NULL,
      nivel_poder INT NOT NULL,
      imagen_url VARCHAR(255),
      estado ENUM('ACTIVO','INACTIVO') NOT NULL,
      created_at DATETIME,
      updated_at DATETIME
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS misiones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(200) NOT NULL,
      descripcion TEXT NOT NULL,
      ubicacion VARCHAR(200) NOT NULL,
      fecha DATE NOT NULL,
      nivel_peligro ENUM('BAJO','MEDIO','ALTO') NOT NULL,
      estado ENUM('PENDIENTE','EN_PROGRESO','COMPLETADA') NOT NULL,
      superheroe_id INT NOT NULL,
      created_at DATETIME,
      updated_at DATETIME,
      FOREIGN KEY (superheroe_id) REFERENCES superheroes(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB;
  `);

  // Seed users
  const adminPass = await bcrypt.hash('12345678', 10);
  const consultaPass = await bcrypt.hash('12345678', 10);

  await pool.query('DELETE FROM misiones');
  await pool.query('DELETE FROM usuarios');
  await pool.query('DELETE FROM superheroes');

  await pool.query('INSERT INTO usuarios (nombre, email, password, rol, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())', ['Admin Marvel', 'admin@marvel.com', adminPass, 'ADMIN']);
  await pool.query('INSERT INTO usuarios (nombre, email, password, rol, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())', ['Consulta Marvel', 'consulta@marvel.com', consultaPass, 'CONSULTA']);

  // Seed heroes
  const heroes = [
    ['Ironman', 'Tony Stark', 'Tecnología avanzada', 90, null, 'ACTIVO'],
    ['Capitan America', 'Steve Rogers', 'Fuerza y liderazgo', 85, null, 'ACTIVO'],
    ['Thor', 'Thor Odinson', 'Control del rayo', 95, null, 'ACTIVO'],
    ['Hulk', 'Bruce Banner', 'Fuerza bruta', 92, null, 'ACTIVO'],
    ['Black Widow', 'Natasha Romanoff', 'Sigilo y espionaje', 70, null, 'ACTIVO'],
    ['Hawkeye', 'Clint Barton', 'Tiro con arco', 68, null, 'ACTIVO'],
    ['Doctor Strange', 'Stephen Strange', 'Magia', 93, null, 'ACTIVO'],
    ['Spider-Man', 'Peter Parker', 'Agilidad y sentido arácnido', 80, null, 'ACTIVO']
  ];

  for (const h of heroes) {
    await pool.query('INSERT INTO superheroes (nombre, nombre_real, poder_principal, nivel_poder, imagen_url, estado, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())', h);
  }

  // Seed missions (6)
  const [rows] = await pool.query('SELECT id FROM superheroes');
  const heroIds = rows.map(r => r.id);

  const misiones = [
    ['Salvar la ciudad', 'Una amenaza ha surgido en la ciudad', 'Nueva York', '2026-09-01', 'ALTO', 'PENDIENTE', heroIds[0]],
    ['Recuperar tecnología', 'Robaron tecnología peligrosa', 'Malibú', '2026-08-20', 'MEDIO', 'EN_PROGRESO', heroIds[1]],
    ['Detener invasión', 'Fuerzas alienígenas en órbita', 'Reino Unido', '2026-10-05', 'ALTO', 'PENDIENTE', heroIds[2]],
    ['Investigar anomalía', 'Anomalía energética detectada', 'Sokovia', '2026-07-15', 'MEDIO', 'COMPLETADA', heroIds[3]],
    ['Rescate', 'Civiles atrapados en edificio', 'Queens', '2026-06-30', 'BAJO', 'COMPLETADA', heroIds[4]],
    ['Proteger convoy', 'Transporte de materiales vitales', 'Desierto', '2026-11-11', 'MEDIO', 'PENDIENTE', heroIds[5]]
  ];

  for (const m of misiones) {
    await pool.query('INSERT INTO misiones (titulo, descripcion, ubicacion, fecha, nivel_peligro, estado, superheroe_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())', m);
  }

  console.log('Seed completo');
  process.exit(0);
}

setup().catch(err => {
  console.error('Error seed:', err);
  process.exit(1);
});
