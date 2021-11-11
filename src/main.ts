import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.RCHAT_WEBHOOK_PORT);

  console.log('Aplicação iniciada na porta: ', process.env.RCHAT_WEBHOOK_PORT);
  
}
bootstrap();
