import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

const expressApp = express();

async function createNestApp() {
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || ['http://localhost:4200', 'https://*.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // Set global prefix
  app.setGlobalPrefix('api');

  await app.init();
  return expressApp;
}

let cachedApp: express.Application;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await createNestApp();
  }
  
  return cachedApp(req, res);
} 