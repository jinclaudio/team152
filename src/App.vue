<template>
  <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
    <router-link class="navbar-brand" to="/">
      <img src="https://www.nicepng.com/png/full/346-3465427_facebook-icon-twitter-icon-twitter-logo-white-box.png"
           alt="Logo" width="30" height="30" class="d-inline-block align-top">
      Birdwatching
    </router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li class="nav-item border-left border-secondary">
          <router-link class="nav-link" to="/TweetEmed">Dashboard</router-link>
        </li>
        <li class="nav-item border-left border-secondary">
          <router-link class="nav-link" to="/gigliottina">Ghigliottina</router-link>
        </li>
        <li class="nav-item border-left border-secondary">
          <router-link class="nav-link" to="/fantacitorio">Fantacitorio</router-link>
        </li>
        <li class="nav-item border-left border-secondary">
          <router-link class="nav-link" to="/scacchi">Chess</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <router-view/>
</template>

<script>
// import Home_page from "@/components/Homepage";
// import TweetEmed from "@/components/TweetEmed";
// import Scacchi from "@/components/Scacchi";
// import Ghigliottina from "@/components/Gigliottina";
// import Fantacitorio from "@/components/Fantacitorio";
// import Dashboard from "@/components/Dashboard";


export default {
  name: 'App',
  components: {
    // Fantacitorio,
    // Home_page,
    // TweetEmed,
    // Scacchi,
    // Ghigliottina,
    // Dashboard
  },
  data() {
    return {
      page: 'fantacitorio',
    }
  }


}
</script>

<style>

.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


.el-radio-group {
  margin: 1rem;
}
</style>
