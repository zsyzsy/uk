<template>
  <div id="search">
    <el-input v-model="searchValue" :placeholder="placeholder" @keyup.enter.native="$emit('search',searchValue)">
      <el-button slot="append" icon="el-icon-search" @click="$emit('search',searchValue)" />
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      default: '请输入查询内容',
      type: String
    }
  },
  data() {
    return {
      searchValue: ''
    }
  }
}
</script>

<style lang="scss" scoped>
#search {
  position: absolute;
  width: 300px;
  top: -6px;
  left: 123px;
}
</style>
