import { createRouter, createWebHistory } from 'vue-router'

import Homepage from "@/components/Homepage";
import Fantacitorio from "@/components/Fantacitorio";
import Gigliottina from "@/components/Gigliottina";
import Scacchi from "@/components/Scacchi";
import Dashboard from "@/components/SentimentAnalyze.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Homepage
        },
        {
            path: '/Fantacitorio',
            component: Fantacitorio
        },
        {
            path: '/Gigliottina',
            component: Gigliottina
        },
        {
            path: '/Scacchi',
            component: Scacchi
        },
        {
            path: '/Dashboard',
            component: Dashboard
        },
        {
            path: '/TweetEmed',
            name: 'TweetEmed',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../src/components/TweetEmed')
        }
    ]
})

export default router
