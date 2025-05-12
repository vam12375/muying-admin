<template>
  <div class="login-container">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
      <div class="title-container">
        <h3 class="title">母婴商城管理系统</h3>
      </div>

      <el-form-item prop="admin_name">
        <el-input
          v-model="loginForm.admin_name"
          placeholder="用户名"
          type="text"
          autocomplete="off"
        >
          <template #prefix>
            <el-icon><UserFilled /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="admin_pass">
        <el-input
          v-model="loginForm.admin_pass"
          placeholder="密码"
          :type="passwordVisible ? 'text' : 'password'"
          autocomplete="off"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
          <template #suffix>
            <el-icon @click="passwordVisible = !passwordVisible">
              <View v-if="passwordVisible" />
              <Hide v-else />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width: 100%" @click="handleLogin">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { UserFilled, Lock, View, Hide } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { setToken, setUserInfo } from '@/utils/auth'
import request from '@/utils/request'

const router = useRouter()
const loading = ref(false)
const passwordVisible = ref(false)
const loginFormRef = ref(null)

const loginForm = reactive({
  admin_name: '',
  admin_pass: ''
})

const loginRules = {
  admin_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  admin_pass: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  loginFormRef.value.validate(async (valid) => {
    if (!valid) {
      return false
    }
    
    loading.value = true
    try {
      // 调用登录API
      const response = await request({
        url: '/admin/login', // 实际会被代理到后端的/api/admin/login
        method: 'post',
        data: loginForm
      })
      
      // 存储token和用户信息
      const { token, user } = response.data
      console.log('[Login Success] User Info:', user);
      setToken(token)
      setUserInfo(user)
      
      ElMessage({
        message: '登录成功',
        type: 'success'
      })
      
      // 登录成功后跳转到首页
      router.push({ path: '/dashboard' })
    } catch (error) {
      ElMessage.error(error.message || '登录失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: #f5f7f9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  max-width: 400px;
  padding: 35px 35px 15px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title-container {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 26px;
  color: #409EFF;
  margin: 0;
  font-weight: bold;
}
</style> 