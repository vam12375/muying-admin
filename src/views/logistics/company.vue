<template>
  <div class="logistics-company-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>物流公司管理</span>
          <el-button type="primary" @click="handleAdd">添加物流公司</el-button>
        </div>
      </template>
      
      <div class="search-box">
        <el-input v-model="queryParams.keyword" placeholder="输入物流公司名称或代码搜索" clearable @keyup.enter="handleQuery" style="width: 300px;"></el-input>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </div>
      
      <el-table v-loading="loading" :data="companyList" border>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="code" label="物流公司代码" width="120"></el-table-column>
        <el-table-column prop="name" label="物流公司名称" width="180"></el-table-column>
        <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="80"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              type="primary" 
              link 
              :disabled="scope.row.status === 0"
              @click="handleToggleStatus(scope.row, 0)"
              v-if="scope.row.status === 1"
            >禁用</el-button>
            <el-button 
              type="primary" 
              link 
              @click="handleToggleStatus(scope.row, 1)"
              v-else
            >启用</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:currentPage="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑物流公司对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible" 
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="公司代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入物流公司代码，如SF"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入物流公司名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入公司地址"></el-input>
        </el-form-item>
        <el-form-item label="公司Logo" prop="logo">
          <el-input v-model="form.logo" placeholder="请输入公司Logo地址"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getLogisticsCompanyList, addLogisticsCompany, updateLogisticsCompany, deleteLogisticsCompany } from '@/api/logistics'

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  keyword: ''
})

// 列表数据
const companyList = ref([])
const total = ref(0)
const loading = ref(false)

// 对话框数据
const dialogVisible = ref(false)
const dialogTitle = computed(() => form.id ? '编辑物流公司' : '添加物流公司')
const formRef = ref(null)
const form = reactive({
  id: undefined,
  code: '',
  name: '',
  contact: '',
  phone: '',
  address: '',
  logo: '',
  sortOrder: 0,
  status: 1
})

// 表单校验规则
const rules = {
  code: [
    { required: true, message: '请输入物流公司代码', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在1到10个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入物流公司名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3456789]\d{9}$|^0\d{2,3}-\d{7,8}$|^\d{7,8}$|^\d{3,4}-\d{7,8}$/, message: '请输入正确的联系电话', trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: '请设置排序序号', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 获取物流公司列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getLogisticsCompanyList(queryParams)
    companyList.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取物流公司列表失败', error)
    ElMessage.error('获取物流公司列表失败')
  } finally {
    loading.value = false
  }
}

// 查询按钮
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

// 重置查询
const resetQuery = () => {
  queryParams.keyword = ''
  handleQuery()
}

// 分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getList()
}

// 页码变化
const handleCurrentChange = (page) => {
  queryParams.page = page
  getList()
}

// 添加物流公司
const handleAdd = () => {
  resetForm()
  dialogVisible.value = true
}

// 编辑物流公司
const handleEdit = (row) => {
  resetForm()
  Object.assign(form, row)
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = async (row, status) => {
  try {
    const data = { ...row, status }
    await updateLogisticsCompany(row.id, data)
    ElMessage.success(`${status === 1 ? '启用' : '禁用'}成功`)
    getList()
  } catch (error) {
    console.error('操作失败', error)
    ElMessage.error('操作失败')
  }
}

// 删除物流公司
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除物流公司 "${row.name}"?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteLogisticsCompany(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error('删除失败', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 重置表单
const resetForm = () => {
  form.id = undefined
  form.code = ''
  form.name = ''
  form.contact = ''
  form.phone = ''
  form.address = ''
  form.logo = ''
  form.sortOrder = 0
  form.status = 1
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 提交表单
const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          // 编辑
          await updateLogisticsCompany(form.id, form)
          ElMessage.success('更新成功')
        } else {
          // 新增
          await addLogisticsCompany(form)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        getList()
      } catch (error) {
        console.error('操作失败', error)
        ElMessage.error('操作失败: ' + (error.response?.data?.message || error.message))
      }
    }
  })
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// 页面加载时获取数据
onMounted(() => {
  getList()
})
</script>

<style scoped>
.logistics-company-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-box {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 