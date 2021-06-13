<template>
  <div class="page">
    <div class="page-header">
      <h1>Пользователи GitHub</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
  }),
  created () {
    this.$store.dispatch('setLog')
  }
}
</script>

<style lang="scss" src="./app.scss"></style>
