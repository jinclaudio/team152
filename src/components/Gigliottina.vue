<template>

  <div>

    <div class="d-flex">
      <div class="bg-dark text-white rounded-3 p-3 w-50 m-2"
           style="overflow-y: scroll; height: 630px; flex: 1; margin-left: 10px;">
        <h3>Tweets</h3>
        <p>The answers are always in a chronological order.</p>
        <el-button type="primary" @click="startquery">Answers</el-button>
        <el-input v-model="this.twitterNum" class="tnum" placeholder="N. Tweets da analizzare" style="width: 8%;"/>
        <div v-if="this.type==='Time' || this.type === 'Map' ">
          <div class="keysearch" v-for="(singleTweet,index) in tweetid" :key="index" style="margin-left:35px">
            <Tweet
                v-bind:tweet-id=singleTweet
                align="left"
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

      <div class="d-flex flex-column w-50">

        <div class="bg-light border rounded-3 p-3 m-2">
          <h2>Term Cloud</h2>
          <WordCloud :tweetdata="this.textgigliottina"></WordCloud>
          <router-link to="/scacchi" class="btn btn-outline-light">Check it out</router-link>
        </div>

        <div class="bg-dark text-white rounded-3 p-3 h-100 m-2">
          <h3>Map</h3>
          <div v-if="this.type === 'Map' ">
            <div class="map-container" style="border: 3px solid gray; border-radius: 8px;">
              <div class="map">
                <GoogleMap api-key="AIzaSyCfJWq60ZgIRGF9i18-ieiE3tTMC7f3IPg" style="width: 200%; height: 225px;"
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
  </div>


</template>


<script>
import {defineComponent} from 'vue'
import {GoogleMap, Marker} from "vue3-google-map";
import Tweet from 'vue-tweet'
import axios from "axios";
import WordCloud from "@/components/WordCloud.vue";

export default defineComponent({
  name: 'Ghigliottina_',
  data() {
    return {
      twitterNum: 10,
      tweetid: [],
      type: 'Map',
      keyword: '#ghigliottina',
      startdate: undefined,
      enddate: undefined,
      center: {lat: 44.4970884, lng: 11.3538972},
      map: true,
      markerop: undefined,
      ArrayMarker: [],
      textgigliottina: []
    }
  },
  components: {
    Tweet,
    GoogleMap,
    Marker,
    WordCloud
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

    startquery() {
      // axios.get('https://testteam15.azurewebsites.net/api/post',
      axios.get('https://backendteam15.azurewebsites.net/api/Search',
          {
            params: {
              query: ((this.type === 'Map') ? this.keyword + ' has:geo' : this.keyword),
              startdate: this.startdate,
              enddate: this.enddate,
              max_result: this.twitterNum,
            }
          })
          .then((res) => {

            if (this.resultuser) {
              this.resultuser = undefined
            }

            for (const ids in res.data.data) {
              var i = Object.keys(res.data.data).indexOf(ids)
              this.tweetid[i] = res.data.data[i].id
              // this.resultuser[i]=i
              this.textgigliottina[i] = res.data.data[i].text
            }
            // this.resultuser = res.data.data

            // if(this.typesearch === 'maps' === true){
            if (this.ArrayMarker != []) {

              this.ArrayMarker = []

            }
            for (const coordinates in res.data.includes.places) {
              var j = Object.keys(res.data.includes.places).indexOf(coordinates)
              const lng = res.data.includes.places[j].geo.bbox[0]
              const lat = res.data.includes.places[j].geo.bbox[1]
              this.markerop = {lat, lng}
              this.ArrayMarker[j] = this.markerop
            }


            if (this.tweetid.length === 0) {
              this.resultuser = 'Non ci sono dei tweets negli ultimi 7 giorni'
            }


          })
          .catch((err) => {
            console.log(err);
          });


    },

  }

})
</script>

<style>

.textbox {
  color: white;
  display: table; /* keep the background color wrapped tight */
  margin: 10px auto 10px auto; /* keep the table centered */
  padding: 5px;
  font-size: 15px;
  background-color: #A9A9A9;
}


.keysearch {
  align-content: center;
  margin: 1px;
}

.map {
  width: 50%;
  height: 225px;
}

.tnum {
  width: 200px;
  margin: 1rem;
}


</style>
