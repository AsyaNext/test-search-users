<template>
  <div class="page">
    <div class="page-header">
      <h1>Пользователи GitHub</h1>
      <div class="page-search">
        <input type="text" v-model="search" placeholder="Логин">
        <button :disabled="!search" @click="searchUsers">Найти</button>
      </div>
    </div>
    <div v-if="isSearch && users.length > 0" class="page-list">
      <div class="page-sort">
        <button @click="sort('up')">По возрастанию</button>
        <button @click="sort('down')">По убыванию</button>
      </div>
      <span><strong>Всего записей: </strong>{{ $store.getters.count }}</span>
      <div
          class="page-item"
          v-for="(user, index) in users"
          :key="index"
          @click="selectUser(user.login)"
      >
        <span :class="{ 'active-user' : select === user.login }" class="page-item__user">{{ user.id }}. {{ user.login }}</span>
        <div v-if="select === user.login" class="page-item__info">
          <span>Количество публичных репозиториев: {{ someUser.public_repos }}</span>
          <span>Количество подписчиков: {{ someUser.followers }}</span>
        </div>
      </div>
    </div>
    <div v-else-if="isLoading">...</div>
    <div v-else-if="(isSearch && users.length === 0) || isWarning" class="page-warning">Ничего не найдено!</div>
    <div v-else class="page-welcome">Введите в поисковой строке логин пользователя, которого хотите найти!</div>
    <button v-if="isSearch && users.length > 0 && users.length !== $store.getters.count" class="page-next" @click="$store.dispatch('searchUsers', { search: search, sort: mode, order: order })">Показать ещё</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    order: '',
    mode: '',
    search: '',
    select: '',
    isSearch: false,
    isWarning: false,
    isLoading: false
  }),
  computed: {
    users () {
      return this.$store.getters.users
    },
    someUser () {
      return this.$store.getters.someUser
    }
  },
  methods: {
    sort (mode) {
      this.mode = mode
      if (this.mode === 'up') {
        this.order = 'asc'
      } else {
        this.order = 'desc'
      }
      this.$store.commit('REFRESH_STATE')
      this.$store.dispatch('searchUsers',
          {
            search: this.search,
            sort: this.mode,
            order: this.order
          })
    },
    selectUser (login) {
      this.select = ''
      this.$store.dispatch('getSomeUser', login)
        .then(() => {
          this.select = login
        })
    },
    searchUsers () {
      this.isSearch = true
      this.isLoading = true
      this.mode = ''
      this.order = ''
      this.$store.commit('REFRESH_STATE')
      this.$store.dispatch('searchUsers', { search: this.search })
        .then(() => {
          this.isLoading = false
          this.isWarning = this.users.length === 0
        })
    }
  }
}
</script>

<style lang="scss" src="./app.scss"></style>
