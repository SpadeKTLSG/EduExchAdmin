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
          <el-form-item prop="account">
            <el-input
              v-model="dataForm.account"
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
          <el-form-item prop="phone">
            <el-input
              v-model="dataForm.phone"
              class="info"
              placeholder="手机号"
            />
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="dataForm.code"
              class="info"
              placeholder="请点击下方按钮获取验证码"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="getCode">点这里</el-button>
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

  </div>
</template>

<script setup>
import cookie from 'vue-cookies'

const router = useRouter()
// const verifyRef = ref(null)
const dataFormRef = ref(null)

const dataForm = ref({
  account: '',
  password: '',
  phone: '',
  code: ''
})

/**
 * 表单验证规则
 */
const dataRule = {
  account: [
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
  phone: [
    {
      required: true,
      message: '手机号不能为空',
      trigger: 'blur'
    }
  ],
  code: [
    {
      required: true,
      message: '验证码不能为空',
      trigger: 'blur'
    }
  ]
}


/**
 * 提交表单
 */
const dataFormSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      login()
    }
  })
}


/**
 * 获取验证码
 */
const getCode = () => {
  console.info("获取验证码");
  http({
    url: http.adornUrl('/admin/employee/code'),
    method: 'post',
    params: {phone: dataForm.value.phone}
  })
    .then((response) => {
      if (response.data.success) {
        dataForm.value.code = response.data.data;
      } else {
        console.error('Failed to fetch code:', response.data);
      }
    })
    .catch((error) => {
      console.error('Error fetching code:', error);
    });
};

/**
 * 登录
 */
const login = () => {

  http({
    url: http.adornUrl('/admin/employee/login'),
    method: 'post',
    data: http.adornData({
      account: dataForm.value.account,
      password: dataForm.value.password,
      phone: dataForm.value.phone,
      code: dataForm.value.code,
    })
  })
    .then((response) => {
      if (response.data.success) {
        const token = response.data.data;
        console.info("你的token:", token);
        cookie.set('Authorization', token)
      } else {
        console.error('Failed to login:', response.data);
      }
      router.replace({name: 'home'}) // 跳转到首页
    })
    .catch((error) => {
      console.error('Error login:', error);
    });

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

</style>
