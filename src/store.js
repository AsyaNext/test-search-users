import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const api = axios.create({
    baseURL: 'https://api.github.com/'
})

const store = new Vuex.Store({
    state: {
        users: [],
        someUser: {},
        page: 1,
        count: 0
    },
    getters: {
        users: state => state.users,
        someUser: state => state.someUser,
        count: state => state.count
    },
    mutations: {
        GET_USERS (state, payload) {
            state.count = payload.total_count
            state.users.push(...payload.items)
            state.page++
        },
        GET_SOME_USER (state, payload) {
          state.someUser = payload
        },
        REFRESH_STATE (state) {
            state.users = []
            state.page = 1
            state.count = 0
        }
    },
    actions: {
        searchUsers (context, data) {
            return new Promise((resolve, reject) => {
                const params = {
                    q: data.search,
                    page: context.state.page,
                }
                if (data.sort === 'up' && data.order === 'asc') {
                    params.order = data.order
                    params.sort = 'repositories'
                }
                if (data.sort === 'down') {
                    params.sort = 'repositories'
                }
                api.get('search/users', {
                    params: params
                })
                    .then((response) => {
                        context.commit('GET_USERS', response.data)
                        resolve(response)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        getSomeUser (context, login) {
            return new Promise((resolve, reject) => {
                api.get(`users/${login}`)
                    .then((response) => {
                        context.commit('GET_SOME_USER', response.data)
                        resolve(response)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        }
    }
})

export default store
