<template>
  <el-button @click="Show">Show</el-button>
  <div id="container" className="wordcloud-wrapper"></div>


</template>

<script>

import * as echarts from 'echarts';
import 'echarts-wordcloud';

export default {
  name: 'DashboardData',
  props: {
    tweetdata: Object

  },
  data(){
    return{
      text:[],
    }
  },
  methods: {

    Show() {
      var tweettext = []
      for (let j in this.tweetdata){
        console.log(this.tweetdata[j])
        tweettext += this.tweetdata[j]
      }
      console.log('il valore di tweettext')
      console.log(tweettext)

      function countNum(arr){
        var obj = [];
        arr = arr.split(' ')
        for (var i in arr){
          if(obj[arr[i]]){
            obj[arr[i]]++;
          }else{
            obj[arr[i]] = 1;
          }
        }
        return obj;
      }

      var res = countNum(tweettext)
        console.log(res)

      for (var k in res){
        this.text.push({name: k, value: res[k]})
      }

      console.log(this.text)
      var chart = echarts.init(document.getElementById('container'));
      chart.setOption({

        series: [{
          type: 'wordCloud',

          shape: 'circle',

          keepAspect: false,

          left: 'center',
          top: 'center',
          width: '70%',
          height: '80%',
          right: null,
          bottom: null,

          sizeRange: [12, 60],


          rotationRange: [-90, 90],
          rotationStep: 45,

          gridSize: 8,
          drawOutOfBound: false,

          shrinkToFit: false,

          layoutAnimation: true,


          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: function () {
              // Random color
              return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') + ')';
            }
          },
          emphasis: {
            focus: 'self',

            textStyle: {
              textShadowBlur: 10,
              textShadowColor: '#333'
            }
          },

          data:
            this.text
        }]
      });
    },

  },

}
</script>

<style lang="scss" scoped>
.wordcloud-wrapper {
  height: 400px;
}
</style>