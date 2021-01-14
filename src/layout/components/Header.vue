<template>
  <div id="header">
    <img class="logo" :src="require('@/assets/logo.png')" alt="四川天府银行">
    <user />
  </div>
</template>

<script>
import User from './User'

export default {
  name: 'TfHeader',
  components: {
    User
  },
  computed: {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
#header{
  position: relative;
  height: 80px;
  width: 100%;
  background: url(../../assets/header-bg.png);
  background-size: cover;
  .logo{
    width: 292px;
    position: absolute;
    top: 16px;
    left: 40px;
  }
  #user{
    position: absolute;
    right: 40px;
    top: 20px;
  }
}
</style>
