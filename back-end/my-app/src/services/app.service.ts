import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  calculateMRR(file: Express.Multer.File): { mrr: number, date: Date, firstDate: Date, lastDate: Date } {
    try {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet['!ref']);
  
      let mrr = 0;
      const currentDate = new Date();
      let firstDate = new Date();
      let lastDate = new Date();
  
      for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
        const active = sheet[`D${rowNum}`]?.v === 'Ativa';
        const cancelled = sheet[`D${rowNum}`]?.v !== 'Ativa' && new Date(sheet[`F${rowNum}`]?.v) > currentDate;
  
        if (active || cancelled) {
          let billingFrequency = sheet[`B${rowNum}`]?.v || 30; // Se a coluna B estiver vazia, considera-se 30 dias
          const billingAmount = sheet[`G${rowNum}`]?.v || 0; // Se a coluna G estiver vazia, considera-se 0
  
          // Verifica o valor de cobrança para determinar a frequência de cobrança
          if (billingFrequency === 365) {
            // Cobrança anual
            billingFrequency = 12; // Transforma em meses
          } else if (billingFrequency !== 30) {
            // Se não for nem 30 nem 365, ignora essa linha
            continue;
          }
  
          const monthlyBilling = billingAmount / billingFrequency * 30;
          mrr += monthlyBilling;
  
          const date = new Date(sheet[`C${rowNum}`]?.v); // Coluna C para data inicio
  
          if (!firstDate || date < firstDate) {
            firstDate = date;
          }
  
          if (!lastDate || date > lastDate) {
            lastDate = date;
          }
        }
      }
  
      const date = new Date(); // Data de referência para o cálculo
  
      return { mrr, date, firstDate, lastDate };
    } catch (error) {
      // Trate os erros adequadamente
      throw new Error('Erro ao calcular o MRR.');
    }
  }  

  calculateChurnRate(file: Express.Multer.File): { churnRate: number, date: Date, firstDate: Date, lastDate: Date } {
    try {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet['!ref']);
  
      let cancelledCustomers = 0;
      let activeCustomers = 0;
      const currentDate = new Date();
      let firstDate = new Date();
      let lastDate = new Date();
  
      for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
        const active = sheet[`D${rowNum}`]?.v === 'Ativa' && new Date(sheet[`E${rowNum}`]?.v) <= currentDate;
        const cancelled = sheet[`D${rowNum}`]?.v !== 'Ativa' && new Date(sheet[`F${rowNum}`]?.v) <= currentDate;
  
        if (active) {
          activeCustomers++;
        } else if (cancelled) {
          let billingFrequency = sheet[`B${rowNum}`]?.v || 30; // Se a coluna B estiver vazia, considera-se 30 dias
  
          // Verifica o valor de cobrança para determinar a frequência de cobrança
          if (billingFrequency === 365) {
            // Cobrança anual
            billingFrequency = 12; // Transforma em meses
          } else if (billingFrequency !== 30) {
            // Se não for nem 30 nem 365, ignora essa linha
            continue;
          }
  
          cancelledCustomers++;
  
          const date = new Date(sheet[`F${rowNum}`]?.v); // Coluna F para data de cancelammento
  
          if (!firstDate || date < firstDate) {
            firstDate = date;
          }
  
          if (!lastDate || date > lastDate) {
            lastDate = date;
          }
        }
      }
  
      const churnRate = activeCustomers > 0 ? (cancelledCustomers / activeCustomers) * 100 : 0;
      const date = new Date(); // Data de referência para o cálculo
      return { churnRate, date, firstDate, lastDate };
    } catch (error) {
      throw new Error('Erro ao calcular o Churn Rate.');
    }
  }  

  async getDados(file: Express.Multer.File): Promise<any> {
    try {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet['!ref']);

      // Implemente a lógica para analisar a planilha e retornar os dados de acordo com sua análise
      let dadosAnalise = {};

      for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
      }

      return dadosAnalise;
    } catch (error) {
      this.logger.error('Erro ao analisar a planilha.', error.stack);
      throw new Error('Erro ao analisar a planilha.');
    }
  }
}
