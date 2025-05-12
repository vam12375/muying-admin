<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" size="small" @click="handleAdd">添加用户</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="用户名/邮箱" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable>
            <el-option label="正常" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <div class="table-container">
        <el-table :data="userList" border style="width: 100%" v-loading="loading">
          <el-table-column prop="userId" label="ID" width="80" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="email" label="邮箱" width="180" />
          <el-table-column prop="phone" label="手机号" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                {{ scope.row.status === 1 ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 用户编辑/添加对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="100px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserPage, getUser, addUser, updateUser, deleteUser } from '@/api/user'

// 查询参数
const queryParams = reactive({
  keyword: '',
  status: '',
  pageNum: 1,
  pageSize: 10
})

// 用户列表数据
const userList = ref([])
// 总数据量
const total = ref(0)
// 加载状态
const loading = ref(false)

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加用户')
const isEdit = ref(false)
const submitLoading = ref(false)
const userFormRef = ref(null)

// 用户表单
const userForm = reactive({
  userId: undefined,
  username: '',
  email: '',
  phone: '',
  password: '',
  status: 1
})

// 表单验证规则
const userFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: false, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 查询数据
const handleQuery = async () => {
  loading.value = true
  try {
    const res = await getUserPage(
      queryParams.pageNum, 
      queryParams.pageSize, 
      queryParams.keyword,
      queryParams.status
    )
    userList.value = res.data.records || []
    total.value = res.data.total || 0
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 重置查询参数
const resetQuery = () => {
  queryParams.keyword = ''
  queryParams.status = ''
  queryParams.pageNum = 1
  handleQuery()
}

// 添加用户
const handleAdd = () => {
  resetUserForm()
  isEdit.value = false
  dialogTitle.value = '添加用户'
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = async (row) => {
  resetUserForm()
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  dialogVisible.value = true
  
  // 获取用户详情数据
  try {
    const res = await getUser(row.userId)
    const userData = res.data
    
    // 填充表单
    userForm.userId = userData.userId
    userForm.username = userData.username
    userForm.email = userData.email
    userForm.phone = userData.phone
    userForm.status = userData.status
    // 编辑时不填充密码
  } catch (error) {
    console.error('获取用户详情失败:', error)
    ElMessage.error('获取用户详情失败')
    dialogVisible.value = false
  }
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除用户 ${row.username} 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteUser(row.userId)
      ElMessage.success(`删除用户 ${row.username} 成功`)
      handleQuery() // 重新加载数据
    } catch (error) {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败')
    }
  }).catch(() => {})
}

// 页码改变
const handleCurrentChange = (val) => {
  queryParams.pageNum = val
  handleQuery()
}

// 每页数量改变
const handleSizeChange = (val) => {
  queryParams.pageSize = val
  queryParams.pageNum = 1 // 切换每页数量时重置为第一页
  handleQuery()
}

// 重置用户表单
const resetUserForm = () => {
  userForm.userId = undefined
  userForm.username = ''
  userForm.email = ''
  userForm.phone = ''
  userForm.password = ''
  userForm.status = 1
  
  // 如果表单引用存在，重置表单验证状态
  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
}

// 提交表单
const submitForm = () => {
  if (!userFormRef.value) return
  
  userFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitLoading.value = true
    try {
      if (isEdit.value) {
        // 编辑用户
        await updateUser(userForm.userId, {
          username: userForm.username,
          email: userForm.email,
          phone: userForm.phone,
          status: userForm.status
        })
        ElMessage.success('编辑用户成功')
      } else {
        // 添加用户
        await addUser({
          username: userForm.username,
          email: userForm.email,
          phone: userForm.phone,
          password: userForm.password,
          status: userForm.status
        })
        ElMessage.success('添加用户成功')
      }
      dialogVisible.value = false
      handleQuery() // 刷新列表
    } catch (error) {
      console.error(isEdit.value ? '编辑用户失败:' : '添加用户失败:', error)
      ElMessage.error(isEdit.value ? '编辑用户失败' : '添加用户失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 组件挂载时获取数据
onMounted(() => {
  handleQuery()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.table-container {
  margin-top: 20px;
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 