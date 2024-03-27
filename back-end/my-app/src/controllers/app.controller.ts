import { Controller, Post, Get, UploadedFile, UseInterceptors, BadRequestException, InternalServerErrorException, Logger, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AppService } from '../services/app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('Nenhum arquivo enviado.');
      }

      // processar o arquivo e calcular as métricas MRR e Churn Rate
      const mrr = await this.appService.calculateMRR(file);
      const churnRate = await this.appService.calculateChurnRate(file);

      return { mrr, churnRate };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao processar o arquivo.', error.message);
    }
  }

  @Get('dados')
  async getDados(@Req() req: Request) {
    try {
      // Verifique se o arquivo da planilha foi enviado na requisição
      const file = req.file;
      if (!file) {
        throw new BadRequestException('Nenhum arquivo enviado.');
      }

      // Chama a função getDados do serviço para analisar a planilha e retornar a visualização
      const dadosVisualizacao = await this.appService.getDados(file);

      this.logger.log('Dados da planilha analisados com sucesso.');

      return dadosVisualizacao;
    } catch (error) {
      this.logger.error('Erro ao analisar a planilha.', error.stack);
      throw new InternalServerErrorException('Erro ao analisar a planilha.');
    }
  }

  // Adicione outras rotas e operações conforme necessário
}
