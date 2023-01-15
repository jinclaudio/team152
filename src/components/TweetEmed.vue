<template>

  <div>

    <div class="d-flex">
      <div class="bg-dark text-white rounded-3 p-3 w-37 m-2"
           style="overflow-y: scroll; height: 630px; flex: 1; margin-left: 10px;">
        <h3>Search for Tweets</h3>
        <div>

          <el-radio-group v-model="typesearch">
            <el-radio label="key">Keyword</el-radio>
            <el-radio label="user">Username</el-radio>
          </el-radio-group>
          <el-input v-model="keyword" placeholder="Please input" style="width: 50%;"/>
          <br>
          <pre><el-input class="datebar" type="date" v-model="startdate" style="float: left;"></el-input><el-input
              class="datebar" type="date" v-model="enddate"></el-input></pre>
          <el-button type="primary" @click="Search">Search</el-button>
          <el-input v-model="this.max_result" class="tnum" placeholder="N. Tweets da analizzare"/>

        </div>

        <div v-if="this.typesearch === 'key'">
          <div class="keysearch" v-for="(singleTweet,index) in tweetid" :key="index">

            <Tweet
                v-bind:tweet-id=singleTweet
                align="right"
                cards="visible"
                conversation="all"
                lang="en"
                theme="light"
                :width="auto"
                :dnt="false"
                @tweet-load-error="onTweetLoadError"
                @tweet-load-success="onTweetLoadSuccess">
            </Tweet>

          </div>
        </div>

        <div v-else-if="this.typesearch === 'user'">
          <div class="timeline" v-for="(singleTweet,index) in tweetid" :key="index">

            <Tweet
                v-bind:tweet-id=singleTweet
                align="right"
                cards="visible"
                conversation="all"
                lang="en"
                theme="light"
                :width="auto"
                :dnt="false"
                @tweet-load-error="onTweetLoadError"
                @tweet-load-success="onTweetLoadSuccess">
            </Tweet>
          </div>
        </div>


      </div>

      <div class="bg-light border rounded-3 p-3 w-33 m-2" style="height: 630px; flex: 1; margin-left: 10px;">
        <h3>Sentimental Analysis</h3>
        <p3>The collected tweets are analyzed according to their mood</p3>
        <br>
        <SentimentAnalyze :tweetdata="this.returnData"></SentimentAnalyze>
      </div>

      <div class="d-flex flex-column w-33">

        <div class="bg-light border rounded-3 p-3 m-2">
          <h3>Term Cloud</h3>
          <p3>Here you can see a rundown of the most typed words</p3>
          <br>
          <WordCloud :tweetdata="this.returnData"></WordCloud>

        </div>

        <div class="bg-dark text-white rounded-3 p-3 h-100 m-2">
          <h3>Map</h3>
          <div class="map-container" style="border: 3px solid gray; border-radius: 8px;">
            <div>
              <GoogleMap api-key="AIzaSyCfJWq60ZgIRGF9i18-ieiE3tTMC7f3IPg" style="width: 100%; height: 250px"
                         :center="this.center" :zoom="15">
                <el-space v-for="(position,index) in ArrayMarker" :key="index">
                  <Marker :options='{position : position}'/>
                </el-space>
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>

  <!--    <template v-for="(singleTweet,index) in tweetid" :key ="index">-->


</template>


<script>
import {defineComponent} from 'vue'
import Tweet from 'vue-tweet'
import axios from "axios";
import {GoogleMap, Marker} from "vue3-google-map";
import WordCloud from "@/components/WordCloud.vue";
import SentimentAnalyze from "@/components/SentimentAnalyze.vue";
// import {isEmpty} from "element-plus/es/utils";
// import TwitterTimeline from 'vue-twitter-timeline'


export default defineComponent({
  name: 'Tweet_part',
  data() {
    return {
      max_result: 10,
      tweetid: [],
      typesearch: 'key',
      type: 'Map',
      keyword: '',
      startdate: undefined,
      enddate: undefined,
      resultuser: [],
      center: {lat: 44.4970884, lng: 11.3538972},
      map: true,
      markerop: undefined,
      ArrayMarker: [],
      returnData: []
    }
  },
  components: {
    Tweet,
    // TwitterTimeline
    GoogleMap,
    Marker,
    WordCloud,
    SentimentAnalyze
  },
  setup() {
    function onTweetLoadSuccess(embedNode) {
      console.log(embedNode)
    }

    function onTweetLoadError() {
      console.log("Ops... an error has occurred")
    }


    return {onTweetLoadSuccess, onTweetLoadError}
  },

  methods: {

    Search() {
      if (this.keyword === '') {
        alert("il campo di ricerca non può essere vuoto!")
      } else {

        // axios.get('https://testteam15.azurewebsites.net/api/post',
        axios.get('https://backendteam15.azurewebsites.net/api/Search',
            {
              params: {
                query: (this.typesearch === 'user' ? 'from:' + this.keyword : (this.typesearch === 'key' ? this.keyword + ' has:geo' : this.keyword)),
                startdate: this.startdate,
                enddate: this.enddate,
                max_result: this.max_result
              }
            })
            .then((res) => {

              if (this.resultuser) {
                this.resultuser = undefined
              }

              for (const ids in res.data.data) {
                var i = Object.keys(res.data.data).indexOf(ids)
                this.tweetid[i] = res.data.data[i].id
                this.returnData[i] = res.data.data[i].text

              }


              if (this.ArrayMarker != []) {

                this.ArrayMarker = []

              }
              if (this.typesearch === 'key' || this.typesearch === 'user') {
                for (const coordinates in res.data.includes.places) {
                  var j = Object.keys(res.data.includes.places).indexOf(coordinates)
                  const lng = res.data.includes.places[j].geo.bbox[0]
                  const lat = res.data.includes.places[j].geo.bbox[1]
                  this.markerop = {lat, lng}
                  this.ArrayMarker[j] = this.markerop
                }
              }


              if (this.tweetid.length === 0) {
                this.resultuser = 'Non ci sono dei tweets negli ultimi 7 giorni'
              }


            })
            .catch((err) => {
              console.log(err);
            });
        console.log(this.returnData)
      }
    },


  }
  // }
})
</script>

<style>

.keysearch {
  /*float: left;*/
  /*width: 33%;*/
  /*margin: 2px;*/
  align-content: center;
  margin: 1px;
}

.datebar {
  width: 9%;
  font-size: 1.45rem;
  margin: 1rem;
}

.timeline {
  align-content: center;
  margin: 1px;
}

.map1 {
  width: 100%;
  height: 250px;
}

.tnum {
  width: 200px;
  margin: 1rem;
}

</style>
