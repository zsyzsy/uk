<template>
  <ul id="nav-menu">
    <li v-for="route in mainRoutes" :key="route.path" :class="['menu',route.path === activeMainMenu?'actived':'']" @click="$router.push(route.path)">{{ route.meta && route.meta.title }}</li>
  </ul>
</template>

<script>

export default {
  name: 'NavMenu',
  components: {
  },
  computed: {
    mainRoutes() {
      return this.$router.options.routes.filter(item => !item.hidden)
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    activeMainMenu() {
      return '/' + this.activeMenu.split('/')[1]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
#nav-menu{
  background: #fff;
  width: 1280px;
  height: 65px;
  color: #A1A6B3;
  display: flex;
  padding: 0 114px;
  margin: 46px auto 0;
  li{
    height: 100%;
    line-height: 65px;
    width: 120px;
    font-size: 18px;
    text-align: center;
    cursor: pointer;
    &.actived{
      background: #ffffff;
      color: rgba(0, 0, 0, 0.85);
      position: relative;
      &::after{
        content: '';
        position: absolute;
        bottom: 0;
        left: calc(50% - 27px);
        width: 54px;
        height: 2px;
        background: $--color-yellow;
      }
    }
  }
}
</style>
