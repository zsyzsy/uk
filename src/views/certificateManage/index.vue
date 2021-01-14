<template>
  <div id="certificate">
    <!-- <div class="tf-divider">
      <span class="title">证书下载</span>
    </div> -->
    <div class="taps-box">
      <div class="taps">
        <div @click="changePage('0')">证书下载</div>
        <div @click="changePage('1')">证书更新</div>
      </div>
      <div :class="['underline',page ==='1'?'underline-move':'']" />
    </div>

    <card v-if="page ==='0'" title="证书下载">
      <el-form ref="certForm" class="certi-form" :model="certForm" :rules="certRules" label-width="110px">
        <el-form-item label="UK序号：" prop="usbKeySn">
          <el-input v-model="certForm.usbKeySn" placeholder="请输入UK序号" />
        </el-form-item>
        <el-form-item label="证书序列号：" prop="serialNo">
          <el-input v-model="certForm.serialNo" placeholder="请输入证书序列号" />
        </el-form-item>
        <el-form-item label="下载码：" prop="authCode">
          <el-input v-model="certForm.authCode" placeholder="请输入下载码" />
        </el-form-item>
      </el-form>
      <div class="center-button">
        <el-button type="primary" @click="loadCACertific">下载证书</el-button>
      </div>
      <div class="tip-box">
        <div class="tips-title">温馨提示</div>
        <pre class="tips-content">
1、UK序号请查看您所领取的UK背面的序列号码，下载码请注意短信留言。
2、请在获得下载码14天内进行证书下载，否则下载码过期，下载码如过期，请到我行营业机构重置下载码。
3、证书下载前，请确保天府网银助手安装并通过检测，并确保UK连接电脑。
4、证书下载开始至下载完成前，请不要关闭页面或拔下UK，保证证书成功下载。
      </pre>
      </div>
    </card>
    <card v-if="page ==='1'" title="证书更新">
      <el-form ref="certForm" class="certi-form" :model="certForm" :rules="certRules" label-width="110px">
        <!-- <el-form-item label="UK序号：" prop="usbKeySn">
          <el-input v-model="certForm.usbKeySn" placeholder="请输入UK序号" />
        </el-form-item> -->
        <!-- <el-form-item label="证书序列号：" prop="serialNo">
          <el-input v-model="certForm.serialNo" placeholder="请输入证书序列号" />
        </el-form-item> -->
        <!-- <el-form-item label="下载码：" prop="authCode">
          <el-input v-model="certForm.authCode" placeholder="请输入下载码" />
        </el-form-item> -->
      </el-form>
      <div class="center-button">
        <el-button type="primary" @click="loadCACertific">更新证书</el-button>
      </div>
      <div class="tip-box">
        <div class="tips-title">温馨提示</div>
        <pre class="tips-content">
1、UK序号请查看您所领取的UK背面的序列好吗，下载码请注意短信留言。
2、请在获得下载码14天内进行证书下载，否则下载码过期，下载码如过期，请到我行营业机构重置下载码。
3、证书下载前，请确保天府网银助手安装并通过检测，并确保UK连接电脑。
4、证书下载开始至下载完成前，请不要关闭页面或拔下UK，保证证书成功下载。
      </pre>
      </div>
    </card>

  </div>
</template>

<script>
import { certDownload, updateCert } from '@/api/certification'
import { setUserMessage } from '@/utils/auth'
import card from '@/components/card'

export default {
  components: {
    card
  },
  data() {
    return {
      page: '0',
      certForm: {
        authCode: '',
        serialNo: '',
        usbKeySn: '',
        requestBook: ''
      },
      certRules: {
        authCode: [
          { required: true, message: '请输入下载码', trigger: 'blur' }
        ],
        serialNo: [
          { required: true, message: '请输入证书序列号', trigger: 'blur' }
        ],
        usbKeySn: [
          { required: true, message: '请输入UK序号', trigger: 'blur' }
        ]
      },
      certifiBoxName: ''
    }
  },
  computed: {
    user: {
      get() {
        return this.$store.getters.user
      },
      set(value) {
        setUserMessage(value)
      }
    },
    cantDownload() {
      return this.user.certState !== '0'
    }
  },
  created() {
    this.isIe()
  },
  methods: {
    changePage(page) {
      this.page = page
    },
    isIe() {
      const ua = navigator.userAgent.toLocaleLowerCase()
      if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
        // 判断是否为ie浏览器
        this.getVersion()
      } else {
        this.$message({
          message: '证书下载请使用ie10及以上或兼容ie的浏览器',
          type: 'warning'
        })
      }
    },
    loadCACertific() {
      this.$refs['certForm'].validate((valid) => {
        if (valid) {
          var strSubjectDN =
            'CN=TFB@test,OU=Organizational-1,OU=TFB,O=CFCA TEST SM2 OCA31,C=CN' // 证书主题，暂时写死
          var res1 = window.CryptoAgent.CFCA_SetCSPInfo(
            '256',
            this.certifiBoxName
          )
          if (!res1) {
            var errorDesc = window.CryptoAgent.GetLastErrorDesc()
            console.log('errorDesc:' + errorDesc)
            this.$notify.error({
              title: '错误',
              message: errorDesc
            })
            return
          }
          var res2 = window.CryptoAgent.CFCA_SetKeyAlgorithm('SM2')
          if (!res2) {
            const errorDesc = window.CryptoAgent.GetLastErrorDesc()
            console.log('errorDesc:' + errorDesc)
            this.$notify.error({
              title: '错误',
              message: 'errorDesc'
            })
            return
          }
          var pkcs10Requisition = 0
          // SM2单证
          try {
            pkcs10Requisition = window.CryptoAgent.CFCA_PKCS10CertRequisition(
              strSubjectDN,
              1,
              0
            )
          } catch (e) {
            console.log('the get pkcs10Requisition faled:' + e)
            this.$notify.error({
              title: '错误',
              message: e
            })
          }

          if (!pkcs10Requisition) {
            const errorDesc = window.CryptoAgent.GetLastErrorDesc()
            console.log('errorDesc:' + errorDesc)
            this.$notify.error({
              title: '错误',
              message: '请插入uk'
            })
            return
          }
          this.certForm.requestBook = pkcs10Requisition
          const cspName = window.CryptoAgent.CFCA_GetCSPInfo().split('||')[0] // "CGNBET O-KEY CSP v1.0"
          const cspNameCertCryptoAgent = window.CertCryptoAgent.SelectCertificate(
            '',
            '',
            '',
            cspName
          ) // true
          if (cspNameCertCryptoAgent) {
            const SerialNumber = window.CertCryptoAgent.GetSignCertInfo(
              'SerialNumber'
            )
            if (this.page === '1') {
              this.certForm.serialNo = SerialNumber
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '请插入uk'
            })
            return
          }
          if (this.page === '0') {
            certDownload(this.certForm).then((res) => {
              if (res.code === '00') {
                this.installCert(res.context.signatureCert)
              }
            })
          } else {
            updateCert(this.certForm).then((res) => {
              if (res.code === '00') {
                this.installCert(res.context.signatureCert)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    installCert(signatureCertData) {
      try {
        var cspName = this.certifiBoxName
        if (cspName === '') {
          console.log('errorDesc:CSP名称为空')
          this.$notify.error({
            title: '错误',
            message: 'errorDesc:CSP名称为空'
          })
          return
        }
        var keyAlgorithm = 'SM2'
        if (keyAlgorithm === '') {
          console.log('errorDesc:密钥生成算法为空')
          this.$notify.error({
            title: '错误',
            message: 'errorDesc:密钥生成算法为空'
          })
          return
        }
        var keyLength = 256
        var hResult = window.CryptoAgent.CFCA_SetKeyAlgorithm(keyAlgorithm)
        if (!hResult) {
          var errorDesc = window.CryptoAgent.GetLastErrorDesc()
          console.log('errorDesc:' + errorDesc)
          this.$notify.error({
            title: '错误',
            message: errorDesc
          })
          return
        }
        var bResult = window.CryptoAgent.CFCA_SetCSPInfo(keyLength, cspName)
        if (!bResult) {
          const errorDesc = window.CryptoAgent.GetLastErrorDesc()
          console.log('errorDesc:' + errorDesc)
          this.$notify.error({
            title: '错误',
            message: errorDesc
          })
          return
        }
        var signCert = signatureCertData
        if (signCert === '') {
          console.log('签名公钥证书内容为空')
          this.$notify.error({
            title: '错误',
            message: errorDesc
          })
          return
        }
        var containerName = window.CryptoAgent.CFCA_GetContainer()
        console.log('containerName' + containerName)
        if (containerName === '') {
          console.log('签名公钥证书容器为空')
          this.$notify.error({
            title: '错误',
            message: '签名公钥证书容器为空'
          })
          return
        }
        // sign cert
        bResult = window.CryptoAgent.CFCA_ImportSignCert(
          1,
          signCert,
          containerName
        )
        if (!bResult) {
          const errorDesc = window.CryptoAgent.GetLastErrorDesc()
          this.$notify.error({
            title: '注入证书错误',
            message: errorDesc
          })
          return
        }
        let tsMessage = '单证书安装成功'
        if (this.page === '1') {
          tsMessage = 'UK证书更新成功'
        }
        this.$notify({
          title: '成功',
          message: '单证书安装成功',
          type: 'success'
        })
        this.$router.push({
          path: 'success',
          query: {
            message: tsMessage
          }
        })
      } catch (e) {
        var LastErrorDesc = window.CryptoAgent.GetLastErrorDesc()
        console.log(e + '----' + LastErrorDesc)
        this.$notify.error({
          title: '错误',
          message: e + '----' + LastErrorDesc
        })
      }
    },
    getVersion() {
      try {
        var hResult = false
        hResult = window.CryptoAgent.CFCA_GetVersion()
        console.log(`the cryptoAgent Version ${hResult}`)
        this.getCSPInfo()
      } catch (e) {
        // this.isNeedInstallPlugin = true// 需要下载安装组件
        var errorDesc = window.CryptoAgent.GetLastErrorDesc()
        console.log('errorDesc:' + errorDesc)
        this.$notify.error({
          title: '错误',
          message: errorDesc
        })
      }
    },
    getCSPInfo() {
      try {
        var cspNames = window.CryptoAgent.CFCA_GetCSPInfo()
        if (!cspNames) {
          var errorDesc = window.CryptoAgent.GetLastErrorDesc()
          console.log('errorDesc:' + errorDesc)
          this.$notify.error({
            title: '错误',
            message: errorDesc
          })
          return
        }
        // var csps = cspNames.split('||')
        this.certifiBoxName = 'CGNBET O-KEY CSP v1.0'
      } catch (e) {
        var LastErrorDesc = window.CryptoAgent.GetLastErrorDesc()
        console.log('the getSCPInfo:' + LastErrorDesc)
        this.$notify.error({
          title: '错误',
          message: 'the getSCPInfo:' + LastErrorDesc
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
