import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8080', // Permite acesso apenas do seu frontend
    credentials: true, // Se o servidor permite ou não que o conteúdo inclua credenciais como cookies, cabeçalhos HTTP e assim por diante
  });
  await app.listen(3000);
}
bootstrap();
