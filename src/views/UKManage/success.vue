<template>
  <div id="UK-result" class="app-container">
    <img class="result-img" :src="require('@/assets/success.png')" alt="成功">
    <div class="title">{{ user.certState === '2'?'UK挂失成功':user.certState === '1'?'UK解挂成功': '' }}</div>
    <div class="content">{{ '当前挂失序列号的UK将' + (user.certState === '2'?'无法使用':user.certState === '1'?'正常使用' : '不受影响') }}</div>
    <div class="center-button">
      <el-button type="primary" @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    goBack() {
      this.$router.push('index')
    }
  }
}
</script>

<style lang="scss" scoped>
  #UK-result{
    width: 100%;
    text-align: center;
    .result-img{
      width: 76px;
      margin: 60px 0 32px;
    }
    .title{
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .content{
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
      margin-bottom: 60px;
    }
  }
</style>
