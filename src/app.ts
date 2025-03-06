import express from 'express';
import * as path from 'path';
import swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { SecretController } from './controllers/secretController';

export class App {
  public express: express.Application;
  private secretController: SecretController;

  constructor() {
    this.express = express();
    this.secretController = new SecretController();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureSwagger();
  }

  private configureMiddleware() {
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.json());
  }

  private configureRoutes() {
    this.express.post('/v1/secret', this.secretController.createSecret.bind(this.secretController));
    this.express.get('/v1/secret/:hash', this.secretController.getSecret.bind(this.secretController));
  }
  private configureSwagger() {
    const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
    this.express.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}