import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'SUSRUTHA Ayurvedhik Hospital CMS API',
    version: '1.0.0',
    description: 'Enterprise REST API documentation for SUSRUTHA Ayurvedhik Hospital CMS platform (Multi-Branch, Doctors, Appointments, Content)',
    contact: {
      name: 'SUSRUTHA Engineering Team',
      email: 'tech@susruthaayurveda.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local Development Server',
    },
  ],
  paths: {
    '/branches': {
      get: {
        summary: 'Fetch all hospital branches',
        tags: ['Branches'],
        responses: {
          200: { description: 'List of all operational hospital branches' },
        },
      },
    },
    '/doctors': {
      get: {
        summary: 'Fetch all doctors & specialists',
        tags: ['Doctors'],
        parameters: [
          { name: 'branchId', in: 'query', schema: { type: 'string' }, description: 'Filter doctors by branch ID' },
          { name: 'departmentId', in: 'query', schema: { type: 'string' }, description: 'Filter doctors by department ID' },
        ],
        responses: {
          200: { description: 'List of doctors matching criteria' },
        },
      },
    },
    '/appointments': {
      get: {
        summary: 'Fetch appointments list',
        tags: ['Appointments'],
        responses: {
          200: { description: 'List of appointments' },
        },
      },
      post: {
        summary: 'Book new patient appointment',
        tags: ['Appointments'],
        responses: {
          201: { description: 'Appointment booked successfully' },
        },
      },
    },
    '/content/packages': {
      get: {
        summary: 'Fetch Care Packages',
        tags: ['Care Packages'],
        responses: {
          200: { description: 'List of inpatient Care Packages' },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
