<template>
  <div class="login">
    <div class="top">
      <div class="logo">
        <img
          alt=""
          src="~@/static/logo.png"
          style="width: 5%; display: block; margin: 0 auto;"
        >
      </div>
    </div>
    <div class="login-box">
      <div class="mid">
        <el-form
          ref="dataFormRef"
          :model="dataForm"
          :rules="dataRule"
          status-icon
          @keyup.enter="dataFormSubmit()"
        >
          <el-form-item prop="userName">
            <el-input
              v-model="dataForm.userName"
              class="info"
              placeholder="帐号"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="dataForm.password"
              class="info"
              placeholder="密码"
              type="password"
            />
          </el-form-item>
          <el-form-item>
            <div class="item-btn">
              <input
                type="button"
                value="发射!"
                @click="dataFormSubmit()"
              >
            </div>
          </el-form-item>
        </el-form>

      </div>
    </div>


    <Verify
      ref="verifyRef"
      :captcha-type="'blockPuzzle'"
      :img-size="{width:'400px',height:'200px'}"
      @success="login"
    />

  </div>
</template>

<script setup>
import {encrypt} from '@/utils/crypto'
import {getUUID} from '@/utils'
import Verify from '@/components/verifition/Verify.vue'
import cookie from 'vue-cookies'

const router = useRouter()
const verifyRef = ref(null)
const dataFormRef = ref(null)
let isSubmit = false

const dataForm = ref({
  userName: '',
  password: '',
  uuid: '',
  captcha: ''
})

/**
 * 表单验证规则
 */
const dataRule = {
  userName: [
    {
      required: true,
      message: '帐号不能为空',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    }
  ],
  captcha: [
    {
      required: true,
      message: '验证码不能为空',
      trigger: 'blur'
    }
  ]
}

onBeforeUnmount(() => {
  document.removeEventListener('keyup', handerKeyup)
})

onMounted(() => {
  getCaptcha()
  document.addEventListener('keyup', handerKeyup)
})

const handerKeyup = (e) => {
  const keycode = document.all ? event.keyCode : e.which
  if (keycode === 13) {
    this.dataFormSubmit()
  }
}


/**
 * 提交表单
 */
const dataFormSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      verifyRef.value?.show()
    }
  })
}


/**
 * 获取验证码
 */
const getCaptcha = () => {
  // TODO
  dataForm.value.uuid = getUUID()
}

/**
 * 登录
 */
const login = (verifyResult) => {
  if (isSubmit) {
    return
  }
  isSubmit = true
  http({
    url: http.adornUrl('/adminLogin'),
    method: 'post',
    data: http.adornData({
      userName: dataForm.value.userName,
      passWord: encrypt(dataForm.value.password),
      captchaVerification: verifyResult.captchaVerification
    })
  }).then(({data}) => {
    cookie.set('Authorization', data.accessToken)
    router.replace({name: 'home'}) // 跳转到首页
  }).catch(() => {
    isSubmit = false
  })
}


</script>


<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url('../../../static/login-bg.png');
  background-size: cover;
  position: fixed;

  .login-box {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    padding-top: 10%;

    .mid {
      font-size: 14px;

      .item-btn {
        width: 410px;
        margin-top: 20px;

        input {
          border: 0;
          width: 100%;
          height: 40px;
          background: #1f87e8;
          color: #fff;
          border-radius: 3px;
        }
      }
    }
  }
}

.info {
  width: 410px;
}

:deep(.login-captcha) {
  height: 40px;
}
</style>
