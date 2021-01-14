<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <img :src="require('@/assets/login-logo.png')" alt="企业认证门户平台">
        </div>

        <el-form-item prop="cifNo">
          <el-input ref="cifNo" v-model="loginForm.cifNo" placeholder="请输入客户号" name="cifNo" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="phone">
          <el-input ref="phone" v-model="loginForm.phone" placeholder="请输入登录手机号" name="phone" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="password">
          <vSysKeyboard input-box-id="password" is-to-use="1" @password="passwordChange" />
        </el-form-item>

        <!-- <el-form-item v-if="isShowVCode" prop="verificationCode"> -->
        <el-form-item v-if="isShowVCode" prop="verificationCode">
          <el-input ref="verificationCode" v-model="loginForm.verificationCode" placeholder="请输入验证码" name="verificationCode" type="text" tabindex="1" auto-complete="on" @keyup.enter.native="handleLogin">
            <el-button v-if="!showVCodeImg" slot="suffix" class="blue-text" type="text" @click="showVCode">点击获取验证码</el-button>
            <img v-else slot="suffix" style="max-width:108px;max-height:42px" class="vcImg" :src="randomImg" alt="点击获取验证码" @click="showVCode">
          </el-input>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-top:46px;border-radius: 6px" @click.native.prevent="handleLogin">登录</el-button>

      </el-form>

    </div>
    <div class="right">
      <img class="logo" :src="require('@/assets/logo2.png')">
      <img class="tips" :src="require('@/assets/tips.png')">
    </div>
  </div>
</template>

<script>
import vSysKeyboard from '@/components/Keyboard'

import { refreshVaricationCode } from '@/api/user'

export default {
  name: 'Login',
  components: {
    vSysKeyboard
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('密码至少4位'))
      } else {
        callback()
      }
    }
    return {
      randomImg: '',
      isShowVCode: false,
      showVCodeImg: false,
      loginForm: {
        cifNo: '',
        phone: '',
        password: '',
        verificationCode: ''
      },
      loginRules: {
        cifNo: [{ required: true, message: '请输入客户号', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入登录手机号', trigger: 'blur' }],
        verificationCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    passwordChange(res) {
      this.loginForm.password = res.encryptedClientRandom + '|' + res.encryptedInputValue
    },
    showVCode() {
      refreshVaricationCode(this.loginForm).then(res => {
        if (res.code === '00') {
          this.showVCodeImg = true
          const imgData = res.context.verificationCode
          this.randomImg = 'data:image/png;base64,' + imgData
        }
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (!this.isShowVCode) {
            this.isShowVCode = true
            return false
          }
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(res => {
            if (res) {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            } else {
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('填写错误')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">

$bg: #283443;
$light_gray: #293040;
$cursor: #DFE1E6;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
#app{
  .login-container {
    .right {
      width: 684px;
      height: 699px;
      background: url("../../assets/bg.png") no-repeat;
      background-size: cover;
      position: relative;
      .logo {
        position: absolute;
        width: 330px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
      .tips {
        position: absolute;
        width: 260px;
        bottom: 30px;
        left: 220px;
      }
    }
    .el-input {
      display: inline-block;
      height: 51px;
      font-size: 18px;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 14px;
        color: $light_gray;
        height: 51px;
        caret-color: $cursor;
      }
    }

    .el-form-item {
      border: 1px solid #DFE1E6;
      border-radius: 4px;
      color: #293040;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 14px;
        color: $light_gray;
        height: 51px;
        caret-color: $cursor;
      }
    }

    .el-button--primary {
      border: none;
      font-size: 16px;
      height: 51px;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.blue-text{
  padding: 17px 4px;
  color: $--color-blue;
}
.login-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(243, 200, 25, 0.17);
  // background: url("../../assets/login-bg.png") no-repeat center;
  background-size: cover;
  overflow: hidden;
  box-sizing: border-box;

  .login-box {
    width: 684px;
    height: 699px;
    background: #ffffff;
    // box-shadow: 0 0 0 1px hsla(240, 0%, 100%, 0.3) inset,
    //   0 0.5em 1em rgba(0, 0, 0, 0.6);
    border-radius: 6px;
  }

  .login-form {
    position: relative;
    width: 472px;
    max-width: 100%;
    padding: 45px 90px;
    overflow: hidden;
    left: 100px;
    top: 70px;
  }

  .tips {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.25);
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding-left: 16px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    img{
      width: 100%;
      max-height: 78px;
      margin-bottom: 20px;
    }
    .title {
      font-size: 44px;
      color: #293040;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 4px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .vcImg{
    position: absolute;
    right: 4px;
    top: 4px;
    cursor: pointer;
    user-select: none;
    height: 43px;
  }
}
</style>
