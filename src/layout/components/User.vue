<template>
  <div id="user">
    <div class="avatar-wrapper">
      <i class="el-icon-user" />
      <div class="avatar-wrapper-name">
        <div>{{ user && user.userName }}</div>
      </div>
      <i class="el-icon-switch-button" @click="logout" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { changePassWord } from '@/api/user'

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    onSubmit() {
      const user = {
        userId: this.changePassword.userId,
        password: this.changePassword.password,
        newPassWord: this.changePassword.newPassWord,
        confirmPassWord: this.changePassword.confirmPassWord
      }
      console.log(user)
      changePassWord(user).then(res => {
        if (res.code === '00') {
          this.logout()
        }
      })
    }
  }
}
</script>

 <style lang="scss" scoped>
#user {
  background: #F0F0F0;
  color: rgba(0, 0, 0, 0.85);
  padding: 8px 16px;
    .avatar-wrapper {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .avatar-wrapper-name {
        display: flex;
        flex-direction: column;
        margin-left: 4px;
        font-size: 16px;
        div{
          display: inline-block;
          line-height: initial;
        }
      }
      .el-icon-switch-button {
        margin: -8px -8px -8px 0px;
        padding: 8px;
        cursor: pointer;
      }
  }
}
</style>
