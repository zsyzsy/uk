<template>
  <el-button class="blue-text" type="text" :disabled="cantCode" @click="getCode">{{ cBttonText }}</el-button>
</template>

<script>
import { getVCode } from '@/api/user'

export default {
  name: 'VerifyCode',
  props: {
    phone: {
      type: String,
      default: ''
    },
    msgType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cBttonText: '获取验证码',
      cantCode: false
    }
  },
  methods: {
    changeCode(val) {
      this.$emit('change', val)
    },
    getCode() {
      if (this.phone === '') {
        return false
      }
      getVCode({
        msgType: this.msgType,
        phone: this.phone
      }).then(res => {
        if (res.code === '00') {
          this.cantCode = true
          let time = 60
          const countTime = setInterval(() => {
            time--
            this.cBttonText = time
          }, 1000)
          setTimeout(() => {
            clearInterval(countTime)
            this.cBttonText = '获取验证码'
            this.cantCode = false
          }, 60000)
          // this.changeCode(res.context.code)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .blue-text{
    color: $--color-blue;
    font-weight: normal;
  }
</style>
