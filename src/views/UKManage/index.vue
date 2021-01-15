<template>
  <div id="certificate">
    <div class="card-content">
      <div class="taps-box">
        <div class="taps">
          <div @click="changePage('0')">USBkey挂失</div>
          <div @click="changePage('1')">USBkey重发</div>
        </div>
        <div :class="['underline',page ==='1'?'underline-move':'']" />
      </div>
      <div class="content certificateManage_box">
        <div v-if="page==='0'" class="guashi">
          <p v-if="isCodeA" class="tips">已向您登录手机号发送一条短信验证码，请勿泄露</p>
          <el-form ref="ukForm" class="certi-form" :model="ukForm" :rules="ukRules" label-width="100px">
            <el-form-item label="USBkey序号：" prop="usbKeySN">
              <el-input v-model="ukForm.usbKeySN" placeholder="请输入需要挂失的USBkey序号" />
            </el-form-item>
            <el-form-item label="手机号码：">
              <div class="phone_text">{{ ukForm.phone }}</div>
              <!-- <el-input v-model="ukForm.phone" :readonly="true" placeholder="请输入经办人手机号码"> -->
              <!-- <el-button slot="suffix" class="blue-text" type="text" :disabled="cantCode" @click="getCode">{{ cBttonText }}</el-button> -->
              <!-- </el-input> -->
            </el-form-item>
            <el-form-item label="验证码：" prop="verificationCode">
              <el-input v-model="ukForm.verificationCode" placeholder="请输入验证码">
                <el-button slot="suffix" class="blue-text" type="text" :disabled="cantCode" @click="getCode">{{ cBttonText }}</el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="page==='1'" class="guashi">
          <p v-if="isCodeB" class="tips">已向您登录手机号发送一条短信验证码，请勿泄露</p>
          <el-form ref="ukForm" class="certi-form" :model="ukForm" :rules="ukRules" label-width="100px">
            <!-- <el-form-item label="UK序号：" prop="usbKeySN">
              <el-input v-model="ukForm.usbKeySN" placeholder="请输入需要挂失的UK序号" />
            </el-form-item> -->
            <el-form-item label="手机号码：" class="ukForm_phone">
              <div class="phone_text">{{ ukForm.phone }}</div>
              <!-- <el-button slot="suffix" class="blue-text" type="text" :disabled="cantCode" @click="getCode">{{ cBttonText }}</el-button> -->
              <!-- </el-input> -->
            </el-form-item>
            <el-form-item label="验证码：" prop="verificationCode">
              <el-input v-model="ukForm.verificationCode" placeholder="请输入验证码">
                <el-button slot="suffix" class="blue-text" type="text" :disabled="cantCode1" @click="getfrCode">{{ cBttonText1 }}</el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-button v-if="page === '0'" class="button" type="primary" @click="submit">立即挂失</el-button>
    <el-button v-else class="button" type="primary" @click="frdbSubmit">法人代表人脸认证</el-button>

    <!-- <div class="tf-divider">
      <span class="title">{{ user.certState === '1'?'UK挂失': user.certState === '2'?'UK解挂':'请先下载证书' }}</span>
    </div> -->
    <!-- <el-form ref="ukForm" class="certi-form" :model="ukForm" :rules="ukRules" label-width="100px">
      <el-form-item label="UK序号：" prop="usbKeySN">
        <el-input v-model="ukForm.usbKeySN" placeholder="请输入需要挂失的UK序号" />
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input v-model="ukForm.phone" placeholder="请输入经办人手机号码">
          <el-button slot="suffix" class="blue-text" type="text" :disabled="cantCode" @click="getCode">{{ cBttonText }}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码：" prop="verificationCode">
        <el-input v-model="ukForm.verificationCode" placeholder="请输入验证码" />
      </el-form-item>
    </el-form>
    <div class="center-button">
      <el-button v-if="user.certState === '1'" type="primary" @click="submit">立即挂失</el-button>
      <el-button v-if="user.certState === '2'" type="primary" @click="submitUnLock">立即解挂</el-button>
    </div> -->
  </div>
</template>

<script>
import { setUserMessage } from '@/utils/auth'
import { getVCode, getPhone } from '@/api/user'
import { reportLoss, unReportLoss, sendUKMsgToPhone } from '@/api/UKey'
let countTime
let countTime1
export default {
  data() {
    return {
      page: '0', // 0:挂失 1:重发
      ukForm: {
        usbKeySN: '',
        phone: '',
        verificationCode: ''
      },
      isCodeA: false,
      isCodeB: false,
      cBttonText: '获取验证码',
      cBttonText1: '获取验证码',
      cantCode1: false,
      cantCode: false,
      ukRules: {
        usbKeySN: [
          {
            required: true,
            message: '请输入需要挂失的USBkey序号',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入经办人手机号码', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    user: {
      get() {
        return this.$store.getters.user
      },
      set(value) {
        console.log(value)
        setUserMessage(value)
      }
    }
  },
  mounted() {
    this.getPhone()
  },
  methods: {
    getPhone() {
      getPhone({
        tokenId: document.cookie.split('=')[1]
      }).then((res) => {
        if (res.code === '00') {
          this.ukForm.phone = res.context.phone
        }
      })
    },
    changePage(page) {
      this.page = page
      if (page === '0') {
        this.isCodeB = false
        clearInterval(countTime1)
        this.cBttonText1 = '获取验证码'
        this.cantCode1 = false
      } else {
        debugger
        this.isCodeA = false
        clearInterval(countTime)
        this.cBttonText = '获取验证码'
        this.cantCode = false
      }
    },
    getCode() {
      this.$refs.ukForm.validate((valid) => {})
      if (this.ukForm.usbKeySN === '') {
        console.error('USBkey序号为空')
        return false
      }
      // this.isCodeA = true
      getVCode({
        msgType: this.user.certState === '1' ? '4' : '5',
        phone: this.ukForm.phone
      }).then((res) => {
        if (res.code === '00') {
          this.isCodeA = true
          // this.ukForm.verificationCode = res.context.code
        }
      })
      this.cantCode = true
      let time = 60
      countTime = setInterval(() => {
        time--
        this.cBttonText = time
      }, 1000)
      setTimeout(() => {
        clearInterval(countTime)
        this.cBttonText = '获取验证码'
        this.cantCode = false
      }, 60000)
    },
    submit() {
      this.$refs.ukForm.validate((valid) => {
        if (valid) {
          reportLoss(this.ukForm).then((res) => {
            if (res.code === '00') {
              this.user.certState = '2'
              this.$router.push('success')
            }
          })
        } else {
          return false
        }
      })
    },
    // 法人代表获取验证码
    getfrCode() {
      this.cantCode1 = true
      let time = 60
      countTime1 = setInterval(() => {
        time--
        this.cBttonText1 = time
      }, 1000)
      setTimeout(() => {
        clearInterval(countTime1)
        this.cBttonText1 = '获取验证码'
        this.cantCode1 = false
      }, 60000)
      sendUKMsgToPhone({
        msgType: '7',
        cifCode: '',
        phone: this.ukForm.phone
      }).then((res) => {
        this.isCodeB = true
        // if (res.code === "00") {

        // }
      })
    },
    // 法人代表
    frdbSubmit() {
      debugger
      // this.$refs.ukForm.validate((valid) => {
      //   if (valid) {
      //     sendCheckMsg({
      //       msgType: '7',
      //       cifCode: '',
      //       code: this.ukForm.verificationCode,
      //       phone: this.ukForm.phone
      //     }).then((res) => {
      //       console.log(res, '=========')
      //       // if (res.code === "00") {

      //       // }
      //     })
      //   }
      // })
    },
    submitUnLock() {
      this.$refs.ukForm.validate((valid) => {
        if (valid) {
          unReportLoss(this.ukForm).then((res) => {
            if (res.code === '00') {
              this.user.certState = '1'
              this.$router.push('success')
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" >
.certificateManage_box {
  .el-form-item__label {
    width: 120px !important;
  }
  .el-form-item__content {
    margin-left: 120px !important;
  }

  .ukForm_phone {
    .el-form-item__error{
      display: none;
    }
  }
}
</style>
<style lang="scss" scoped>
#certificate {
  text-align: center;
  .button {
    margin: 80px 0;
    padding: 5px 16px;
  }
  .card-content {
    width: 1280px;
    background: #fff;
    padding-bottom: 212px;
    margin: 0 auto;
    .guashi {
      text-align: center;
      .tips {
        margin: 80px 0 40px;
        color: #293040;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  .taps-box {
    position: relative;
    width: 1280px;
    margin: 0 auto;
    .taps {
      display: flex;
      justify-content: space-around;
      width: 1280px;
      background: #fff;
      height: 55px;
      margin: 24px auto 0;
      border-bottom: 1px solid #e9e9e9;
      line-height: 55px;
      color: #293040;
      font-size: 16px;
      font-weight: 600;
      div {
        cursor: pointer;
      }
    }
    .underline {
      position: absolute;
      width: 250px;
      height: 3px;
      background: #ffd630;
      bottom: 0;
      left: 200px;
      transition: all 0.5s;
    }
    .underline-move {
      transform: translateX(640px);
    }
  }
  .phone_text {
    padding-left: 15px;
    text-align: left;
  }
}
</style>
