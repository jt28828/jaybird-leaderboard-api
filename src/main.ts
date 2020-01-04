import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";

import { config } from "dotenv";

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(5050);
}

bootstrap();
