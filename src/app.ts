import express from 'express';
import { SecretController } from './controllers/secretController';

export class App {
  public express: express.Application;
  private secretController: SecretController;

  constructor() {
    this.express = express();
    this.secretController = new SecretController();
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware() {
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.json());
  }

  private configureRoutes() {
    this.express.post('/v1/secret', this.secretController.createSecret.bind(this.secretController));
    this.express.get('/v1/secret/:hash', this.secretController.getSecret.bind(this.secretController));
  }
}