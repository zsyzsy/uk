<template>
  <div id="certificate">
    <card class="box" title="修改登录密码">
      <el-form ref="passForm" class="certi-form" :model="passForm" :rules="passRules" label-width="100px">
        <el-form-item label="手机号码：" prop="phone">
          <el-input ref="phone" v-model="passForm.phone" placeholder="请输入经办人手机号码">
            <verify-code slot="suffix" :phone="passForm.phone" msg-type="6" />
          </el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="code">
          <el-input ref="code" v-model="passForm.code" placeholder="请输入验证码" />
        </el-form-item>
      </el-form>
    </card>

    <div class="center-button">
      <el-button type="primary" @click="submit">立即修改</el-button>
    </div>
  </div>
</template>

<script>
import { verifyCode } from '@/api/user'
import VerifyCode from '@/components/VerifyCode.vue'
import card from '@/components/card'

export default {
  components: {
    VerifyCode,
    card
  },
  data() {
    return {
      passForm: {
        phone: '',
        code: ''
      },
      cBttonText: '获取验证码',
      cantCode: false,
      passRules: {
        phone: [{ required: true, message: '请输入经办人手机号码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.passForm.validate(valid => {
        if (valid) {
          verifyCode(this.passForm).then(res => {
            if (res.code === '00') {
              this.$router.push({
                path: 'setPassword',
                query: {
                  checkId: res.context.checkId
                }
              })
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

<style lang="scss" scoped>
.box {
  padding-bottom: 156px;
}
</style>
