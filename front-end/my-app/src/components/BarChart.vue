<template>
  <div ref="chart"></div>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: ['data'],
  watch: {
    data: {
      handler: 'updateChart',
      immediate: true
    }
  },
  mounted() {
    this.createDateChart();
  },
  methods: {
    createDateChart() {
      let div = d3.select(this.$refs.chart);
      let width = 800;
      let height = 400;
      let margin = { top: 20, right: 20, bottom: 30, left: 40 };

      let svg = div.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      let x = d3.scaleBand().range([0, width]).padding(0.1);
      let y = d3.scaleLinear().range([height, 0]);

      x.domain(this.data.map(d => d.label));
      y.domain([0, d3.max(this.data, d => d.value)]);

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

      svg.append('g')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(this.data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.label))
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.value))
        .attr('height', d => height - y(d.value));
    },
    updateChart() {
      let svg = d3.select(this.$refs.chart).select('svg');
      let x = d3.scaleBand().range([0, 800]).padding(0.1);
      let y = d3.scaleLinear().range([400, 0]);

      x.domain(this.data.map(d => d.label));
      y.domain([0, d3.max(this.data, d => d.value)]);

      svg.selectAll('.bar')
        .data(this.data)
        .transition()
        .duration(500)
        .attr('x', d => x(d.label))
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.value))
        .attr('height', d => 400 - y(d.value));
    }
  }
};
</script>

<style scoped>
.bar {
  fill: steelblue;
}
</style>
