const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Marvel API',
      version: '1.0.0',
      description: 'API REST para la gestión de superhéroes y misiones del universo Marvel.'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor de desarrollo' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Hero: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Ironman' },
            nombre_real: { type: 'string', example: 'Tony Stark' },
            poder_principal: { type: 'string', example: 'Tecnología avanzada' },
            nivel_poder: { type: 'integer', minimum: 1, maximum: 100, example: 90 },
            imagen_url: { type: 'string', nullable: true },
            estado: { type: 'string', enum: ['ACTIVO', 'INACTIVO'], example: 'ACTIVO' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          required: ['nombre', 'nombre_real', 'poder_principal', 'nivel_poder', 'estado']
        },
        Mission: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Salvar la ciudad' },
            descripcion: { type: 'string', example: 'Una amenaza ha surgido en la ciudad' },
            ubicacion: { type: 'string', example: 'Nueva York' },
            fecha: { type: 'string', format: 'date', example: '2026-09-01' },
            nivel_peligro: { type: 'string', enum: ['BAJO','MEDIO','ALTO'], example: 'ALTO' },
            estado: { type: 'string', enum: ['PENDIENTE','EN_PROGRESO','COMPLETADA'], example: 'PENDIENTE' },
            superheroe_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          required: ['titulo','descripcion','ubicacion','fecha','nivel_peligro','estado','superheroe_id']
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Admin Marvel' },
            email: { type: 'string', format: 'email', example: 'admin@marvel.com' },
            rol: { type: 'string', enum: ['ADMIN','CONSULTA'], example: 'ADMIN' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Recurso no encontrado' }
          }
        },
        Message: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Superhéroe creado correctamente' },
            data: { type: 'object' }
          }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJSDoc(options);

// Manually add paths to document the existing API without altering code
swaggerSpec.paths = {
  '/api/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Registrar un nuevo usuario',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                nombre: { type: 'string' },
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
                rol: { type: 'string', enum: ['ADMIN','CONSULTA'] }
              },
              required: ['nombre','email','password','rol']
            }
          }
        }
      },
      responses: {
        '201': { description: 'Usuario creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
        '400': { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '409': { description: 'Email ya en uso', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '500': { description: 'Error interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login de usuario',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' }
              },
              required: ['email','password']
            }
          }
        }
      },
      responses: {
        '200': { description: 'Login correcto', content: { 'application/json': { schema: { type: 'object' } } } },
        '400': { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '401': { description: 'Credenciales inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },
  '/api/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Obtener información del usuario autenticado',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': { description: 'Información del usuario', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/User' } } } } } },
        '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '404': { description: 'Usuario no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },
  '/api/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Cerrar sesión (respuesta simple)',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': { description: 'Sesión cerrada', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
        '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },

  '/api/heroes': {
    get: {
      tags: ['Heroes'],
      summary: 'Listar todos los superhéroes',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': { description: 'Lista de héroes', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Hero' } } } } } } },
        '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    post: {
      tags: ['Heroes'],
      summary: 'Crear un superhéroe (ADMIN)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Hero' }
          }
        }
      },
      responses: {
        '201': { description: 'Superhéroe creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
        '400': { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '403': { description: 'Sin permisos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '409': { description: 'Nombre duplicado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },

  '/api/heroes/{id}': {
    get: {
      tags: ['Heroes'],
      summary: 'Obtener superhéroe por ID',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        '200': { description: 'Superhéroe encontrado', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Hero' } } } } } },
        '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '404': { description: 'Superhéroe no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    put: {
      tags: ['Heroes'],
      summary: 'Actualizar superhéroe (ADMIN)',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Hero' } } } },
      responses: {
        '200': { description: 'Actualizado correctamente', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
        '400': { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '403': { description: 'Sin permisos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '404': { description: 'Superhéroe no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    delete: {
      tags: ['Heroes'],
      summary: 'Eliminar superhéroe (ADMIN)',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        '200': { description: 'Eliminado correctamente', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
        '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '403': { description: 'Sin permisos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '404': { description: 'Superhéroe no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },

  '/api/misiones': {
    get: {
      tags: ['Misiones'],
      summary: 'Listar todas las misiones',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': { description: 'Lista de misiones', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Mission' } } } } } } },
        '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    post: {
      tags: ['Misiones'],
      summary: 'Crear misión (ADMIN)',
      security: [{ bearerAuth: [] }],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Mission' } } } },
      responses: {
        '201': { description: 'Misión creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
        '400': { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '403': { description: 'Sin permisos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '404': { description: 'Superhéroe no existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },

  '/api/misiones/{id}': {
    get: {
      tags: ['Misiones'],
      summary: 'Obtener misión por ID',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        '200': { description: 'Misión encontrada', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Mission' } } } } } },
        '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '404': { description: 'Misión no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    put: {
      tags: ['Misiones'],
      summary: 'Actualizar misión (ADMIN)',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Mission' } } } },
      responses: {
        '200': { description: 'Misión actualizada', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
        '400': { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '403': { description: 'Sin permisos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '404': { description: 'Misión no encontrada / Superhéroe no existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    delete: {
      tags: ['Misiones'],
      summary: 'Eliminar misión (ADMIN)',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        '200': { description: 'Misión eliminada', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
        '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '403': { description: 'Sin permisos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '404': { description: 'Misión no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  }
};

module.exports = swaggerSpec;
