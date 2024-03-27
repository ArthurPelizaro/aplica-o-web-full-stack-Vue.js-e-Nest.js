<template>
  <div class="app-container">
    <h1>Minha Aplicação Web Full-Stack</h1>
    <div class="upload-section">
      <label for="upload-file">Selecione uma planilha (.xlsx):</label>
      <input type="file" id="upload-file" @change="handleFileUpload" />
      <button @click="uploadFile" :disabled="!file">Enviar</button>
    </div>
    <div class="metrics-section" v-if="mrr || churnRate">
      <h2>Métricas</h2>
      <div v-if="mrr">MRR: R$ {{ mrr.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }}</div>
      <div v-if="churnRate">Churn Rate: {{ (churnRate.churnRate).toFixed(2) }}%</div>
      <div v-if="mrr && mrr.firstDate && mrr.lastDate">Período MRR: {{ mrr.firstDate }} - {{
        mrr.lastDate }}</div>
      <div v-if="churnRate && churnRate.firstDate && churnRate.lastDate">Período Churn Rate: {{
        churnRate.firstDate }} - {{ churnRate.lastDate }}</div>
      <bar-chart :data="chartData"></bar-chart>
    </div>
    <div class="loading" v-if="isLoading">Carregando...</div>
    <div class="error" v-if="error">Erro: {{ error }}</div>
    <div class="dates-chart" v-if="datesChartData">
      <h2>Dates Chart</h2>
      <date-chart :data="datesChartData"></date-chart>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import BarChart from './BarChart.vue';
import DateChart from './DateChart.vue';

export default {
  components: {
    BarChart,
    DateChart
  },
  data() {
    return {
      mrr: null,
      churnRate: null,
      datesChartData: null,
      file: null,
      isLoading: false,
      error: null,
    };
  },
  computed: {
    chartData() {
      return [
        { id: 'MRR', value: this.mrr ? this.mrr.mrr : 0 },
        { id: 'Churn Rate', value: this.churnRate ? this.churnRate.churnRate : 0 }
      ];
    }
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
      this.error = null; // Clear previous error
    },
    async uploadFile() {
      if (!this.file) return;
      this.isLoading = true; // Show loading indicator
      const formData = new FormData();
      formData.append('file', this.file);
      try {
        const response = await axios.post('http://localhost:3000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Formata as datas antes de atribuí-las aos objetos mrr e churnRate
        const mrr = { ...response.data.mrr };
        if (mrr.firstDate) mrr.firstDate = new Date(mrr.firstDate).toLocaleDateString('pt-BR');
        if (mrr.lastDate) mrr.lastDate = new Date(mrr.lastDate).toLocaleDateString('pt-BR');

        const churnRate = { ...response.data.churnRate };
        if (churnRate.firstDate) churnRate.firstDate = new Date(churnRate.firstDate).toLocaleDateString('pt-BR');
        if (churnRate.lastDate) churnRate.lastDate = new Date(churnRate.lastDate).toLocaleDateString('pt-BR');

        this.mrr = mrr;
        this.churnRate = churnRate;
        this.datesChartData = response.data.datesChartData;
        this.error = null; // Clear any errors on successful upload
      } catch (error) {
        console.error('Erro ao enviar o arquivo:', error);
        this.error = 'Erro ao processar a planilha.'; // Set user-friendly error message
      } finally {
        this.isLoading = false; // Hide loading indicator after processing
      }
    },
  },
};
</script>


<style scoped>
/* Redefinição de estilos padrão */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Estilos gerais */
body {
  font-family: sans-serif;
  font-size: 16px;
  color: #333;
}

/* App container */
.app-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
}

/* Upload section */
.upload-section {
  margin-bottom: 20px;
}

.upload-section label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.upload-section input[type="file"] {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.upload-section button {
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 16px;
  border: 1px solid #333;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

.upload-section button:hover {
  background-color: #333;
  color: #fff;
}

.upload-section button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Metrics section */
.metrics-section {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
}

.metrics-section h2 {
  margin-top: 0;
  margin-bottom: 10px;
}

.metrics-section div {
  margin-bottom: 5px;
  font-weight: bold;
}

/* Loading indicator */
.loading {
  text-align: center;
  margin-bottom: 20px;
}

.loading::after {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #ccc;
  border-radius: 50%;
  border-top-color: #333;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Error message */
.error {
  color: #f00;
  margin-bottom: 20px;
  font-weight: bold;
}

/* Estilos adicionais */
/* ... */

/* Media queries */
@media (max-width: 768px) {

  /* Adapte o layout para dispositivos móveis */
  .app-container {
    width: 100%;
  }
}
</style>