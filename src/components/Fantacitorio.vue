<template>


  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 bg-light border rounded-3">
        <div class="form-group">
          <div class="form-check">
            <input class="form-check-input" type="radio" v-bind:value="'fantacitorio'" id="fantacitorio"
                   name="radio-group" v-bind:checked="searchtype === 'fantacitorio'"
                   v-on:change="searchtype = 'fantacitorio'">
            <label class="form-check-label" for="fantacitorio">
              Fantacitorio classifica politici
              <small class="text-muted d-block">Classifica e Grafico.</small>
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" v-bind:value="'user'" id="user" name="radio-group"
                   v-bind:checked="searchtype === 'user'" v-on:change="searchtype = 'user'">
            <label class="form-check-label" for="user">
              Verifica registrazione squadra utente
              <small class="text-muted d-block">Verifica se un utente partecipa</small>
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" v-bind:value="'squadre'" id="squadre" name="radio-group"
                   v-bind:checked="searchtype === 'squadre'" v-on:change="searchtype = 'squadre'">
            <label class="form-check-label" for="squadre">
              Visualizza le ultime squadre registrate
              <small class="text-muted d-block">Raccolta cronologica, dal più recente.</small>
            </label>
          </div>

        </div>
      </div>
      <div class="col-12 col-md-6 bg-dark text-white rounded-3">
        <el-button v-if="this.searchtype==='squadre'" @click="squadre">Visualizza squadre</el-button>
        <el-input v-if="this.searchtype==='squadre' " v-model="this.twitterNum" class="tnum"
                  placeholder="N. Tweets da analizzare"/>
        <br>
        <el-button v-if="this.searchtype==='fantacitorio'" @click="Gettext">Classifica fantacitorio</el-button>

        <div class="lookuser" v-if="this.searchtype==='user'">
          <el-input v-model="this.keyword" style="width: 40%" placeholder="Inserire user"/>
          <el-button v-if="this.searchtype==='user'" @click="verificaUser">Verifica utente</el-button>
          <p>{{ this.responsetext }}</p>
        </div>

      </div>
      <div class="col-12 bg-light border rounded-3 m-2" style="overflow-y: scroll; height: 530px">
        <h3 style="margin-top:15px">Dati</h3>
        <br>
        <el-image v-bind:src=this.userTeam></el-image>

        <div class="classifica" v-if="this.searchtype==='fantacitorio'">
    <span class="chart">
    <div v-if="this.start" class="map-container" style="border: 3px solid black; border-radius: 8px;">
      <GChart
          v-if="this.start"
          type="ColumnChart"
          :data="chartData"
          :options="chartOptions"/>
        </div>
    </span>


          <span class="table" style="margin-left: 15px">
  <!--    <el-input  v-model="this.newPoint"  v-if="changePoint"></el-input>-->
  <div v-if="this.start" class="map-container" style="border: 3px solid black; border-radius: 8px;">
      <el-table v-if="this.start" :data="tableData" stripe style="width: 95%">
        <el-table-column type="index" prop="Index" width="40"/>
        <el-table-column prop="Name" label="Name" width="200"/>
        <el-table-column prop="Point" label="Points" width="120"/>
        <el-table-column prop="NewPoint">
          <template #default="scope">
            <el-input style="width: 120px" v-model="this.tableData[scope.$index].NewPoint"
                      @keydown.enter="changeData(scope.$index)"/>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </span>

        </div>


        <div class="imgsquadre" v-if="this.searchtype==='squadre'">

          <div v-for="(imgurl,index) in imgSquadre" :key="index">
            <el-image v-bind:src=imgurl></el-image>

          </div>
        </div>

      </div>
    </div>
  </div>


</template>

<script>

import axios from "axios";
import {defineComponent} from 'vue';
import {GChart} from 'vue-google-charts'
// import Img from '../assets/testocr.png'
import {createWorker} from 'tesseract.js';

const worker = await createWorker({
  logger: m => console.log(m),
});
await worker.loadLanguage('ita');
await worker.initialize('ita');

export default defineComponent({
  name: "Fantacitorio_",
  data() {
    return {
      twitterNum: 10,
      userTeam: undefined,
      keyword: '',
      responsetext: undefined,
      searchtype: 'fantacitorio',
      testo: [],
      imgSquadre: [],
      pname: [],
      ppoint: [],
      start: false,
      chartData: [
        ['Nome', 'Punteggio'],
      ],
      chartOptions: {
        chart: {
          title: 'Punteggi politici Fantacitorio ultima settimana',
        },
        width: 925,
        height: 360
      },
      tableData: [],


    }
  },
  components: {
    GChart,
  },
  setup() {
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath)
    }
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath)
    }

    return {handleOpen, handleClose}
  },
  methods: {

    Gettext() {
      axios.get('https://backendteam15.azurewebsites.net/api/Search', {
        params: {
          query: 'from: Fanta_citorio',
          max_result: this.twitterNum,
          startdate: '09/12/2022'
        }
      })
          .then((res) => {
            var double = function (name, checkname) {
              for (const i in name) {
                if (name[i] === checkname) return i
              }
              return -1
            }
            if (this.tableData != []) {
              this.tableData = []
              this.chartData = [['Nome', 'Punteggio'],]
              this.ppoint = []
              this.pname = []
            }
            // indice 0 = ultimo twitter e cosi via
            // ogni match e un array, qui ricavi tutti i nomi e tutti i punteggi
            console.log(res.data)
            for (const text of res.data.data) {
              const ArrayPoint = text.text.match(/\d+\d+(?= PUNTI)/gm)
              const ArrayName = text.text.match(/(?<=- |PER )\w+\s\w+\s?\w+(?=\n)/gi)

              if (ArrayName != null && ArrayPoint != null) {

                for (const i in ArrayName) {

                  const index = (i > 0 ? double(this.pname, ArrayName[i]) : -1)

                  if (index === -1) {
                    this.pname.push(ArrayName[i])
                    this.ppoint.push(parseInt(ArrayPoint[i]))
                    this.tableData.push({Name: ArrayName[i], Point: ArrayPoint[i], NewPoint: undefined})
                  } else {
                    this.ppoint[index] += parseInt(ArrayPoint[i])
                    this.tableData[index].Point = this.ppoint[index]
                  }


                }
              }
            }

            for (const i in this.pname) {
              this.chartData.push([this.pname[i], this.ppoint[i]])
            }
            this.start = true


          })
          .then((err) => {
            console.log(err)
          })
    },

    changeData(index) {

      this.tableData[index].Point = this.tableData[index].NewPoint
      this.chartData[index + 1] = [this.pname[index], parseInt(this.tableData[index].NewPoint)]
      this.tableData[index].NewPoint = undefined

    },

    squadre() {
      axios.get('https://backendteam15.azurewebsites.net/api/Search', {
        params: {
          query: (this.searchtype != 'user' ? '#fantacitorio has:images' : 'from: ' + this.keyword),
          max_result: this.twitterNum
        }

      })
          .then(async (res) => {


            // await worker.setParameters({
            //   tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
            if (this.imgSquadre != []) {
              this.imgSquadre = []
            }
            // loop res.data.includes.media[] to get the information
            for (const media of res.data.includes.media) {
              if (media.type === 'photo') {

                const {data: {text}} = await worker.recognize(media.url)
                if (text.match(/(NOME SQUADRA)/) != null) {
                  this.imgSquadre.push(media.url)
                }


              }
            }
          })
          .then((err) => {
            console.log(err)
          })
    },

    verificaUser() {
      axios.get('https://backendteam15.azurewebsites.net/api/Search', {
        params: {
          query: (this.searchtype != 'user' ? '#fantacitorio has:images' : 'from: ' + this.keyword),
          max_result: this.twitterNum
        }

      })
          .then(async (res) => {

            if (this.userTeam != undefined) {
              this.userTeam = undefined
            }
            // loop res.data.includes.media[] to get the information
            for (const media of res.data.includes.media) {

              if (media.type === 'photo') {
                const {data: {text}} = await worker.recognize(media.url)
                if (text.match(/(NOME SQUADRA)/) != null) {
                  this.userTeam = media.url
                }
                this.responsetext = (this.userTeam != undefined ? 'utente si e registrato al fantacitorio' : 'l utente che stai cercando non ha registrato le squadre al Fantacitorio')

              }
            }
          })
          .then((err) => {
            console.log(err)
          })
    }

  }


})
</script>

<style scoped>

.form-group {
  display: flex;
  justify-content: center;
}

.classifica {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.tnum {
  width: 200px;
  margin: 1rem;
}

</style>
