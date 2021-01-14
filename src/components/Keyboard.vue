
<style scoped>
    input{
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 14px;
      color: #293040;
      caret-color: #DFE1E6;
      outline: none;
      width: 100%;
    }
</style>
<template>
  <input :id="inputBoxId" :placeholder="(isToUse == 1)?'请输入登录密码':'请输入登录密码'" type="password" :name="inputBoxId" value="" oncopy="return false;" onpaste="return false;" oncut="return false;" @blur="getEncrypt(inputBoxId)">
</template>

<script>
/*eslint no-undef: "warn"*/
export default {
  props: {
    inputBoxId: {
      type: String,
      default: ''
    },
    isToUse: {
      type: String,
      default: '0'
    }
  },
  data: function() {
    return { cfcaSysObj: null }
  },
  mounted() {
    this.$nextTick(function() {
      // DOM 更新了
      this.initInput(this.inputBoxId)
    })
  },
  methods: {
    inputChangeCallback(sipBoxId, type, length) { // 输入改变时回调
      console.log(sipBoxId, type, length)
      // eslint-disable-next-line no-unused-vars
      var operator = type === window.CFCA_KEYBOARD_INSERT ? 'INSERT' : (type === window.CFCA_KEYBOARD_DELETE ? 'DELETE' : 'CLEAR')
    },
    initInput(inputBoxId) {
      var serverRandom = 'MTIzNDU2Nzg5MDk4NzY1NA=='// 后台服务端随机数
      var matchRegex = null
      var MaxLength = null
      if (this.isToUse === '0') {
        matchRegex = '^[0-9A-Za-z]{6,14}$'
        MaxLength = 14
      } else {
        matchRegex = '^[0-9]{6,6}$'
        MaxLength = 6
      }
      var inputRegex = '\\S'// 输入匹配规则
      // eslint-disable-next-line no-undef
      this.cfcaSysObj = new CFCASIPInput(inputBoxId, SIP_TYPE_SYSTEM_KEYBOARD)
      this.cfcaSysObj.setInputChangeCallback(inputBoxId, this.inputChangeCallback)
      if (CFCA_OK !== this.cfcaSysObj.setMinLength(inputBoxId, 6)) this.$message.error('初始化错误，请重新刷新页面')
      if (CFCA_OK !== this.cfcaSysObj.setMaxLength(inputBoxId, MaxLength)) this.$message.error('初始化错误，请重新刷新页面')
      if (CFCA_OK !== this.cfcaSysObj.setOutputType(inputBoxId, OUTPUT_TYPE_ORIGINAL)) this.$message.error('初始化错误，请重新刷新页面')
      if (CFCA_OK !== this.cfcaSysObj.setServerRandom(inputBoxId, serverRandom)) this.$message.error('初始化错误，请重新刷新页面')
      if (CFCA_OK !== this.cfcaSysObj.setCipherType(inputBoxId, CIPHER_TYPE_SM2)) this.$message.error('初始化错误，请重新刷新页面')
      if (CFCA_OK !== this.cfcaSysObj.setMatchRegex(inputBoxId, matchRegex)) this.$message.error('初始化错误，请重新刷新页面')
      if (CFCA_OK !== this.cfcaSysObj.setInputRegex(inputBoxId, inputRegex)) this.$message.error('初始化错误，请重新刷新页面')
    },
    getEncrypt(inputBoxId) {
      var sip = this.cfcaSysObj
      // 开始加密
      var encryptedInputValue = sip.getEncryptedInputValue(inputBoxId)
      var errorCode = sip.getErrorCode(inputBoxId).toString(16)
      // 加密数据
      if (errorCode !== CFCA_OK + '') {
        switch (errorCode) {
          case '1001':
            this.$message.error('参数错误！')
            break
          case '1002':
            this.$message.error('无效的SIP ID，表示安全输入键盘并未创建')
            break
          case '1003':
            this.$message.error('输入数据长度不在有效范围内')
            break
          case '1004':
            this.$message.error('输入数据为空')
            break
          case '1005':
            this.$message.error('输入服务端随机数无效')
            break
          case '1006':
            this.$message.error('服务端随机数为空')
            break
          case '1007':
            this.$message.error('请输入6位数字')
            break
        }
        sip.clearInputValue(inputBoxId)
        this.$emit(inputBoxId, { encryptedInputValue: false, encryptedClientRandom: false })
        return
      } else {
        // if(sipboxId == "SIPBox1"){
        //     $("#encryptedValue").val(encryptedInputValue);
        // }
      }
      // 客户端随机数
      var encryptedClientRandom = sip.getEncryptedClientRandom(inputBoxId)
      errorCode = sip.getErrorCode(inputBoxId).toString(16)
      if (errorCode !== CFCA_OK + '') {
        console.log(`获取客户端随机数错误！！,the errorCode:${errorCode}`)
        this.$message.error(`获取客户端随机数错误！！`)
        sip.clearInputValue(inputBoxId)
        this.$emit(inputBoxId, { encryptedInputValue: false, encryptedClientRandom: false })
        return
      } else {
        this.$emit(inputBoxId, { encryptedInputValue: encryptedInputValue, encryptedClientRandom: encryptedClientRandom })
      }
    }
  }
}
</script>

