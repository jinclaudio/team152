<template>

  <div class="container">
    <transition name="fade">
      <div v-show="showSidebar" class="-flex flex-column flex-shrink-0 p-3 text-bg-dark"
           style="width = 33%; position: absolute; top: 50px; left: 0; height: 100%; z-index: 10; overflow: auto; opacity:0.97;">
        <button class="btn btn-outline-light" @click="showSidebar = false">Close the Sidebar</button>

        <br>
        <div>
          <!--  <input type="input" v-model="keyword">-->
          <div>
            <el-radio-group v-model="typesearch">
              <el-radio label="key">Keyword</el-radio>
              <el-radio label="user">Username</el-radio>
              <el-radio label="maps">Map</el-radio>
            </el-radio-group>
          </div>

          <div v-if="this.typesearch === 'maps' ">
            <div class="map-container" style="border: 3px solid white; border-radius: 8px;">
              <GoogleMap api-key="AIzaSyCfJWq60ZgIRGF9i18-ieiE3tTMC7f3IPg" style="width: 100%; height: 275px;"
                         :center="this.center" :zoom="15">
                <el-space v-for="(position,index) in ArrayMarker" :key="index">
                  <Marker :options='{position : position}'/>
                </el-space>
              </GoogleMap>
            </div>

          </div>

          <el-input v-model="keyword" placeholder="Please input" style="width: 50%;"/>
          <el-input v-model="this.twitterNum" class="tnum" placeholder="N. Tweets da analizzare" style="width: 15%;"/>

          <br>
          <pre><el-input class="datebar" type="date" v-model="startdate" style="float: left;"></el-input><el-input
              class="datebar" type="date" v-model="enddate"></el-input></pre>
          <el-button type="primary" @click="Search">Search</el-button>

        </div>

        <!--    <template v-for="(singleTweet,index) in tweetid" :key ="index">-->
        <div v-if="this.typesearch === 'key' || this.typesearch === 'maps'">
          <div class="keysearch" v-for="(singleTweet,index) in tweetid" :key="index">

            <Tweet
                v-bind:tweet-id=singleTweet
                align="right"
                cards="visible"
                conversation="all"
                lang="en"
                theme="light"
                :width='auto'
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
    </transition>
  </div>

  <div class="container-fluid">
    <div class="row div21 div22">
      <div class="col-6">
        <div class="row div21">
          <div class="col-12 bg-light border rounded-3 p-3 my-3">
            <h2>Birdwatching as a Tool</h2>
            <p>This web app is the result of the Software Engineering project of the year 2022-2023.
              The Agile method was used as a team management model, specifically the Scrum framework, this allowed us to
              have a cooperative and agile approach.
              The project has been carried out in 5 sprints each made of 2 weeks, each stage was composed of a sprint
              planning, a sprint review and a retrospetive.
              Moving on to the basic functionality of the tool (for which we have used the official Twitter API v2) it
              is possible to search for tweets
              by keyword or by username, these tweets can also be geolocated and shown on a map thanks to the Google
              Maps API.
            </p>
            <el-button type="primary" @click="showSidebar = !showSidebar;">Search a Tweet</el-button>
          </div>
          <div class="col-12 text-bg-dark rounded-3 p-3">
            <h2>Dashboard</h2>
            <p>
              It is also possible to search for Tweets and interpret the results through a Term cloud that generates an
              image having the most used words in
              a bigger font, a graph showing the sentimental analysis on the collected tweets,
              a bar diagram with the number of tweets per unit of time and the position of who publishes the tweets on a
              map .
            </p>
            <router-link to="/TweetEmed" class="btn btn-outline-light">Check it out</router-link>
          </div>
        </div>
      </div>


      <div class="col-6">
        <div class="row div21">
          <div class="col-12 text-bg-dark rounded-3 p-3 my-3">
            <h2>Tv Games</h2>
            <p>This section of the application is dedicated to the two famous TV games: L'eredità and Fantacitorio.
              The first game it's about guessing the correct word given a series of hints, people at home watching the
              show are allowed to post their guesses on Twitter.
              In this application you can see all attempts that have been made.
              For the second game, the user can publish his team on Twitter with the hashtag #Fantacitorio, In the
              section "Fantacitorio" you can see the teams. </p>
            <pre><router-link to="/gigliottina" class="btn btn-outline-light">Ghigliottina</router-link> <router-link
                to="/fantacitorio" class="btn btn-outline-light">Fantacitorio</router-link></pre>
          </div>
          <div class="col-12 bg-light border rounded-3 p-3">
            <h2>Chess</h2>
            <p>On birdwatching it is also possible to play a game of chess! You just need to log in to your Twitter
              account and start a new game.
              You can decide whether your opponents can respond with a move decided through a poll by multiple users or
              not. Each move is posted with a Tweet.
              in the "Chess" section there is also a 2D chessboard that updates as the game progresses, you can also
              resume an old game with a FEN code.</p>
            <router-link to="/scacchi" class="btn btn-outline-secondary">Play a Match</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script>

import {defineComponent} from 'vue'
import Tweet from 'vue-tweet'
import axios from "axios";
import {GoogleMap, Marker} from "vue3-google-map";
// import {isEmpty} from "element-plus/es/utils";
// import TwitterTimeline from 'vue-twitter-timeline'


export default defineComponent({
  name: 'Tweet_part',
  data() {
    return {
      twitterNum: 10,
      tweetid: [],
      typesearch: 'key',
      keyword: '',
      startdate: undefined,
      enddate: undefined,
      resultuser: [],
      center: {lat: 44.4970884, lng: 11.3538972},
      map: true,
      markerop: undefined,
      ArrayMarker: [],
      showSidebar: false,
    }
  },


  components: {
    Tweet,
    // TwitterTimeline
    GoogleMap,
    Marker
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
                query: (this.typesearch === 'user' ? 'from:' + this.keyword : (this.typesearch === 'maps' ? this.keyword + ' has:geo' : this.keyword)),
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

              }


              if (this.ArrayMarker != []) {

                this.ArrayMarker = []

              }
              if (this.typesearch === 'maps') {
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


      }

    },
  }
  // }
})


</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.small-box {
  background-color: grey;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.div21 {
  padding-right: 15px;
  padding-bottom: 15px;
  padding-left: 15px;
}

.div22 {
  padding-top: 15px;
}

.heading {
  color: #1DA1F2;
  font-size: 60px;
}

.subtitle {
  color: #1DA1F2;
  font-size: 25px;
}

.searchingby {
  color: deepskyblue;
  font-size: 15px;
}

.title {
  align: center;
}

.baseFont {
  color: grey;
  margin-left: 20mm;
  font-size: 20px;
  font-family: "Arial";
  font-weight: bold
}

.istruction {
  margin-left: 10mm;
  font-size: 24px;
  font-family: "Arial";
  font-weight: bold
}

.keysearch {
  /*float: left;*/
  /*width: 33%;*/
  /*margin: 2px;*/
  align-content: center;
  margin: 1px;
}

.datebar {
  width: 10%;
  font-size: 1.5rem;
  margin: 1rem;
}

.timeline {
  align-content: center;
  margin: 1px;
}

.tnum {
  width: 200px;
  margin: 1rem;
}


</style>
