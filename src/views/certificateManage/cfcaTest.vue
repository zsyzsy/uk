
<template>
  <div class="wrapper">
    <div class="content-box content-collapse">
      <div class="content">
        <div class="form-box">
          <el-form ref="form" :model="form" label-width="120px">
            <el-row class="form-title" :gutter="24">
              <el-col :offset="1" :span="8">CA证书签名</el-col>
            </el-row>
            <el-row style="margin-top: 20px;" type="flex" :gutter="20" justify="space-center">
              <el-col :offset="6" :span="12">
                <el-form-item style="margin-right: 120px;" label-width="120px" label="请输入签名内容：" required prop="sourceData">
                  <el-input v-model="form.sourceData" autocomplete="off" placeholder="请输入签名内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" type="flex" justify="center">
              <el-col :offset="3" :span="8">
                <el-button class="next-btn" size="medium" plain @click="SelectCertificateOnClick()">签名</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      isNeedInstallPlugin: false,
      isNotIE: false,
      innerHtml: '',
      certifiType: '', // 证书的名字及类型
      form: {
        sourceData: '4006703998'
      }
    }
  },
  methods: {
    getCSPInfo() {
      try {
        var cspNames = window.CryptoAgent.CFCA_GetCSPInfo()
        console.log(cspNames)
        if (!cspNames) {
          var errorDesc = window.CryptoAgent.GetLastErrorDesc()
          console.log('errorDesc:' + errorDesc)
          // this.$message.info(errorDesc);
          // this.$commonService.showCatchErrorTips(error)
          return
        }
        var csps = cspNames.split('||')
        return csps[0]
      } catch (e) {
        var LastErrorDesc = window.CryptoAgent.GetLastErrorDesc()
        this.$commonService.showCatchErrorTips(LastErrorDesc)
      }
    },
    SelectCertificateOnClick() {
      // Select certificate
      try {
        var subjectDNFilter = ''
        var issuerDNFilter = ''
        var serialNumFilter = ''
        var bSelectCertResult = ''
        var cspName = this.getCSPInfo()
        bSelectCertResult = window.CertCryptoAgent.SelectCertificate(subjectDNFilter, issuerDNFilter, serialNumFilter, cspName)
        // Opera浏览器，NPAPI函数执行结果为false时，不能触发异常，需要自己判断返回值。
        if (!bSelectCertResult) {
          var errorDesc = window.CertCryptoAgent.GetLastErrorDesc()
          this.$commonService.showCatchErrorTips(errorDesc)
          return
        }
        this.signOnClick()
      } catch (e) {
        const errorDesc = window.CertCryptoAgent.GetLastErrorDesc()
        console.log(errorDesc)
        // this.$commonService.showCatchErrorTips(errorDesc)
      }
    },
    signOnClick() {
      debugger
      var selectedAlg = 'SHA-256'
      const val = this.form.sourceData
      try {
        var signature = window.CertCryptoAgent.SignMsgPKCS7(val, selectedAlg, true)
        alert('签名结果' + signature)
        // this.$commonService.showMsgTips('签名结果'+ signature);
      } catch (e) {
        var errorDesc = window.CertCryptoAgent.GetLastErrorDesc()
        this.$commonService.showCatchErrorTips(errorDesc)
      }
    }

  }
}
</script>

<style scoped>
.form-title {
  color: rgba(16, 16, 16, 1);
  font-size: 18px;
  text-align: left;
  background-color: #efeeec;
  margin-left: -4% !important;
  margin-right: -4% !important;
}
.form-title .el-col {
  margin-bottom: 4px;
  margin-top: 4px;
  padding: 0 !important;
}

.next-btn {
  width: 58%;
  padding: 5px 20px;
  margin-top: 5%;
}
</style>
