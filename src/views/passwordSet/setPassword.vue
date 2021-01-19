<template>
  <div id="certificate" class="setPassword">
    <card title="修改登录密码">
      <p class="tips">您所填写的手机号码作为您的登录账号，请牢记客户号、登录手机号及密码</p>
      <el-form ref="setPassForm" :rules="passRules" class="certi-form" :model="setPassForm" label-width="120px">
        <el-form-item label="原登录密码：" prop="oldPwd">
          <vSysKeyboard input-box-id="oldPwd" is-to-use="1" placeholder="请输入原登录密码" @oldPwd="res=>{passwordChange('oldPwd',res)}" />
        </el-form-item>
        <el-form-item label="新登录密码：" prop="newPwd">
          <vSysKeyboard input-box-id="newPwd" is-to-use="1" placeholder="请输入新登录密码" @newPwd="res=>{passwordChange('newPwd',res)}" />
          <el-alert
            title="请输入6位纯数字"
            type="warning"
            show-icon
          />
        </el-form-item>
        <el-form-item label="确认新密码：" prop="confirmPassWd">
          <vSysKeyboard input-box-id="confirmPassWd" is-to-use="1" placeholder="请重复新登录密码" @confirmPassWd="res=>{passwordChange('confirmPassWd',res)}" />
        </el-form-item>
      </el-form>

    </card>
    <div class="center-button">
      <el-button type="primary" @click="submit">立即修改</el-button>
    </div>
  </div>
</template>

<script>
import { setPassword } from '@/api/user'
import vSysKeyboard from '@/components/Keyboard'
import card from '@/components/card'

export default {
  components: {
    vSysKeyboard,
    card
  },
  data() {
    return {
      setPassForm: {
        checkId: this.$route.query.checkId,
        oldPwd: '',
        newPwd: '',
        confirmPassWd: ''
      },
      passRules: {
        oldPwd: [{ required: true, message: '请输入原登录密码', trigger: 'blur' }],
        newPwd: [{ required: true, message: '请输入新登录密码', trigger: 'blur' }],
        confirmPassWd: [{ required: true, message: '请重复新登录密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    passwordChange(name, res) {
      this.setPassForm[name] = res.encryptedClientRandom + '|' + res.encryptedInputValue
    },
    submit() {
      this.$refs.setPassForm.validate(valid => {
        if (valid) {
          setPassword(this.setPassForm).then(res => {
            if (res.code === '00') {
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

<style lang="scss" scoped>
#certificate {
  .el-form-item {
    input {
      padding: 0 14px;
      width: 320px;
      height: 32px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      &:focus {
        border: 1px solid $--color-yellow;
      }
    }
  }
  .tips {
    text-align: center;
    color: $--color-warning;
    font-size: 14px;
  }
}
</style>
