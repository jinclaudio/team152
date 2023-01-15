<template>
  <el-button @click="SentimentAnalysis">Analyze</el-button>
  <div id="pie" style="height: 450px"></div>

</template>

<script>

import * as echarts from 'echarts';

const vader = require('vader-sentiment');
export default {
  name: 'SentimentAnalyze',
  props: {
    tweetdata: Object

  },
  data() {
    return {
      analysis: [
        {value: 0, name: "Positive"},
        {value: 0, name: "Neuter"},
        {value: 0, name: "Negative"},
      ]
    }
  },
  methods: {

    SentimentAnalysis() {
      // var inputdata = this.text
      var intensity = []
      for (var j in this.analysis) {
        this.analysis[j].value = 0
      }
      for (var i in this.tweetdata) {
        intensity[i] = vader.SentimentIntensityAnalyzer.polarity_scores(this.tweetdata[i])
        if (intensity[i].compound > 0.05)
          this.analysis[0].value += 1
        else if (intensity[i].compound === 0.05)
          this.analysis[1].value += 1
        else {
          this.analysis[2].value += 1

        }
      }
      console.log(intensity)
      console.log(this.analysis)

      var dom = document.getElementById('pie');
      var myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
      myChart.clear()
      var option;

      option = {
        title: {
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        color: [
          '#F5F2E7',
          '#2666CF',
          '#2C3333'
        ],
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: this.analysis,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      if (option && typeof option === 'object') {
        myChart.setOption(option);
      }

      window.addEventListener('resize', myChart.resize);
    }
  },

}
</script>

<style lang="scss" scoped>
.wordcloud-wrapper {
  height: 450px;
}
</style>
