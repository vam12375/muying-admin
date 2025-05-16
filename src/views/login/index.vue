<template>
  <div class="login-container-reimagined">
    <div 
      class="login-card"
      v-motion
      :initial="{ opacity: 0, y: 100 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 100, duration: 700 } }"
    >
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <div 
          class="title-container"
          v-motion
          :initial="{ opacity: 0, scale: 0.8 }"
          :enter="{ opacity: 1, scale: 1, transition: { delay: 400, duration: 600 } }"
        >
          <h3 class="title">母婴商城管理系统</h3>
        </div>

        <el-form-item 
          prop="admin_name"
          v-motion
          :initial="{ opacity: 0, x: -40 }"
          :enter="{ opacity: 1, x: 0, transition: { delay: 600, duration: 500 } }"
        >
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

        <el-form-item 
          prop="admin_pass"
          v-motion
          :initial="{ opacity: 0, x: -40 }"
          :enter="{ opacity: 1, x: 0, transition: { delay: 700, duration: 500 } }"
        >
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

        <el-button 
          :loading="loading" 
          type="primary" 
          style="width: 100%" 
          @click="handleLogin"
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 800, duration: 600 } }"
        >
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import './login.scss'
import { ref, reactive } from 'vue'
import { UserFilled, Lock, View, Hide } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { setToken, setUserInfo } from '@/utils/auth'
import request from '@/utils/request'
// 引入 motion 动画
import { } from '@vueuse/motion'

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