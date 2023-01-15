<template>

  <div class="bg-light border d-inline-block rounded-3 p-3 my-3"
       style="width: 25%; position: absolute; top: 20; left: 0;  margin-left: 30px;">
    <p> Here you can play Chess by using Twitter as a bridge to exchange the moves between you and your opponent.
      You can start a game and the checkers will appear on the board, the game also checks that the moves are valid.
      <br>
      <br>

      You can also post a two-option tweet in the form of a poll to get more people choosing the next move of the game.
    </p>
    <el-checkbox v-model="sondaggio">Multiple Opponents (Poll)</el-checkbox>
    <div v-if="this.sondaggio">
      <el-input v-model="this.scelte[0]" placeholder="option1"></el-input>
      <el-input v-model="this.scelte[1]" placeholder="option2"></el-input>
      <el-button type="primary" @click="pubblicTweet">Tweet-it!</el-button>
    </div>


  </div>

  <div class="bg-light border d-inline-block rounded-3 p-3 my-3"
       style="width: 25%; position: absolute; top: 20; right: 0;  margin-right: 30px;">
    <!--  <el-input v-model="this.tweetText" style="width: 40%"></el-input>-->

    <p>Continue a previous match with a FEN code.</p>
    <el-input style="width: 60%" v-model="this.fen" placeholder="Digit the FEN"></el-input>
    <el-button @click="resumeAGame">Resume</el-button>
  </div>

  <div class="d-flex justify-content-center">
    <div class="bg-light border rounded-3 p-3 my-3" style="height: 72vh; width: 40%;">
      <div :id="this.boardID"></div>
      <el-button @click="ChessInit">Start a new game</el-button>
      <el-button type="primary" @click="redirect">Log in</el-button>

    </div>
  </div>

  <div class="d-flex justify-content-center">
    <div class="text-bg-dark rounded-3 p-3" style="width: 38%;">

      <el-input v-model="this.source" placeholder="Move from box X"></el-input>
      <el-input v-model="this.target" placeholder="Move to box Y"></el-input>

      <el-button @click="ChessMove(); pubblicTweet()">Move</el-button>

    </div>

  </div>


</template>

<script>
import {defineComponent} from 'vue'
// import Tweet from 'vue-tweet'
import axios from "axios";

import {Chess} from 'chess.js';

let game = new Chess();
import ChessBoard from "chessboardjs-vue";


export default defineComponent({
  name: "Scacchi_login",
  data() {
    return {
      resback: undefined,
      tweetText: undefined,
      sondaggio: false,
      scelte: [],

      source: '',
      target: '',
      boardID: 'board1',
      board1: undefined,
      status: '',
      config: {
        draggable: true,
        position: 'start',
        onDrop: this.ChessOnDrop
      },
      fen: ""
    }
  },

  components: {},
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

    redirect() {
      window.location.href = 'https://backendteam15.azurewebsites.net/api/login'
    },
    login() {
      axios.get('https://backendteam15.azurewebsites.net/api/login', {
        headers: {
          'Access-Control-Allow-Origin': 'http://127.0.0.1:8080',
        }
      })
          .then((res) => {
            console.log(res, 'log con successo')
          })
          .then((err) => {
            console.log(err)
          })
    },
    pubblicTweet() {
      axios.get((this.sondaggio ? 'https://backendteam15.azurewebsites.net/api/tweetswith' : 'https://backendteam15.azurewebsites.net/api/tweetswithout'), {
        params: {
          text: "#scacchi15 " + "Ho iniziato una partita, fai la tua mossa faccendo un commento " +
              "fen2image.chessvision.ai/" + game.fen() + '\n' + game.fen(),
          scelte: this.scelte


        }
      })
          .then((res) => {
            this.resback = res.data
          })
          .then((err) => {
            console.log(err)
          })

    },

    ChessInit() {
      game = new Chess()
      if (game.isGameOver()) return false

      this.board1 = ChessBoard(this.boardID, this.config)

      console.log(game.fen())
    },

    ChessMove() {
      // this.board1 = ChessBoard(this.boardID, )
      game.move({
        from: this.source,
        to: this.target
      });
      this.board1.position(game.fen())

      console.log(this.board1.position())

    },
    ChessOnDrop(source, target) {
      this.source = source
      this.target = target
      var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
      })
      if (move === null) return 'snapback'


      this.ChessUpdateStatus()
    },
    ChessUpdateStatus() {
      var moveColor = 'White'
      if (game.turn() === 'b') {
        moveColor = 'Black'
      }

      // is in checkmate?
      if (game.isCheckmate()) {
        this.status = 'Game over, ' + moveColor + ' is in checkmate.'
      }

      // draw?
      else if (game.isDraw()) {
        this.status = 'Game over, drawn position'
      }

      // game still on
      else {
        this.status = moveColor + ' to move'

        // check?
        if (game.isCheck()) {
          this.status += ', ' + moveColor + ' is in check'
        }
      }
    },
    resumeAGame() {
      game.load(this.fen);
      this.config.position = game.fen()
      this.board1 = ChessBoard(this.boardID, this.config)
    }

  },
  mounted() {
    ChessBoard('board1', {
      draggable: true,
    })
  }
})


</script>

<style scoped>
.el-input {
  width: 25%;
  margin: 0.5rem;
}

.el-checkbox {
  margin: 1rem;
}

.el-button {
  margin: 1rem;
}

#board1 {
  display: inline-block;
  width: 425px;

}

</style>
