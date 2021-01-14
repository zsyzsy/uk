<template>
  <div id="certificate-result" class="app-container">
    <img class="result-img" :src="require('@/assets/success.png')" alt="成功">
    <div class="title">{{ message ||'UK证书更新成功' }}</div>
    <div class="center-button">
      <el-button type="primary" @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'UK证书更新成功'
    }
  },
  mounted() {
    let message = this.getHref()
    if (message) {
      message = decodeURI(message.message)
      this.message = message
    }
  },
  methods: {
    goBack() {
      this.$router.push('index')
    },
    getHref() {
      var url = window.location.href
      var temp1 = url.split('?')
      var pram = temp1[1]
      if (pram) {
        var keyValue = pram.split('&')
        var obj = {}
        for (var i = 0; i < keyValue.length; i++) {
          var item = keyValue[i].split('=')
          var key = item[0]
          var value = item[1]
          obj[key] = value
        }
      }

      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
#certificate-result {
  width: 100%;
  text-align: center;
  .result-img {
    width: 76px;
    margin: 60px 0 32px;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 60px;
  }
}
</style>
