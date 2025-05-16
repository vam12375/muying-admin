<template>
  <div class="app-container">
    <!-- 筛选容器 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.ruleName"
        placeholder="规则名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="Search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" type="primary" icon="Plus" @click="handleCreate">
        新建规则
      </el-button>
    </div>

    <!-- 积分规则表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="规则ID" align="center" width="100">
        <template #default="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="规则名称" align="center" min-width="150">
        <template #default="scope">
          <span>{{ scope.row.ruleName }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="规则类型" align="center" width="150">
        <template #default="scope">
          <el-tag :type="getRuleTypeTag(scope.row.ruleType)">
            {{ getRuleTypeName(scope.row.ruleType) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="积分值" align="center" width="120">
        <template #default="scope">
          <span>{{ scope.row.pointsValue }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="规则描述" align="center" min-width="200">
        <template #default="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="创建时间" align="center" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="handleDelete(scope.row.id)"
            :disabled="scope.row.isSystem === 1"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.limit"
      @pagination="fetchData"
    />

    <!-- 新建/编辑对话框 -->
    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" width="600px">
      <el-form
        ref="dataFormRef"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 500px; margin-left: 50px;"
      >
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="temp.ruleName" placeholder="请输入规则名称" />
        </el-form-item>
        
        <el-form-item label="规则类型" prop="ruleType">
          <el-select v-model="temp.ruleType" placeholder="请选择规则类型" style="width: 100%">
            <el-option
              v-for="item in ruleTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="积分值" prop="pointsValue">
          <el-input-number
            v-model="temp.pointsValue"
            :min="1"
            :max="10000"
            style="width: 100%"
          />
          <div class="hint-text">正数为增加积分，负数为消费积分</div>
        </el-form-item>
        
        <el-form-item label="规则描述" prop="description">
          <el-input
            v-model="temp.description"
            type="textarea"
            :rows="3"
            placeholder="请输入规则描述"
          />
        </el-form-item>
        
        <el-form-item label="是否启用" prop="status">
          <el-switch
            v-model="temp.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from '@/components/Pagination/index.vue'
import { getPointsRuleList, createPointsRule, updatePointsRule, deletePointsRule } from '@/api/points'

export default {
  name: 'PointsRule',
  components: { Pagination },
  setup() {
    const dataFormRef = ref(null)
    
    const state = reactive({
      list: [], // 积分规则列表
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        ruleName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑积分规则',
        create: '创建积分规则'
      },
      temp: {
        id: undefined,
        ruleName: '',
        ruleType: 1,
        pointsValue: 0,
        description: '',
        status: 1
      },
      rules: {
        ruleName: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
        ruleType: [{ required: true, message: '请选择规则类型', trigger: 'change' }],
        pointsValue: [{ required: true, message: '积分值不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '规则描述不能为空', trigger: 'blur' }]
      },
      ruleTypeOptions: [
        { value: 1, label: '注册奖励' },
        { value: 2, label: '每日登录' },
        { value: 3, label: '购买商品' },
        { value: 4, label: '评价商品' },
        { value: 5, label: '兑换商品' },
        { value: 6, label: '管理员调整' }
      ]
    })

    // 获取积分规则列表
    const fetchData = () => {
      state.listLoading = true
      getPointsRuleList(state.listQuery).then(response => {
        // 修改响应处理，后端返回的是Page对象，包含records和total字段
        const data = response.data
        state.list = data.records || []
        state.total = data.total || 0
        
        // 数据字段映射转换，适配前端显示
        state.list = state.list.map(item => {
          return {
            id: item.id,
            ruleName: item.title, // 后端为title，前端使用ruleName
            ruleType: mapTypeToNumber(item.type), // 后端是字符串类型，前端用数字
            pointsValue: item.value, // 后端为value，前端使用pointsValue
            description: item.description,
            status: item.enabled, // enabled -> status
            createTime: item.createTime,
            updateTime: item.updateTime
          }
        })
        
        state.listLoading = false
      }).catch(error => {
        console.error('获取积分规则列表失败:', error)
        ElMessage.error('获取积分规则列表失败')
        state.listLoading = false
      })
    }

    // 将后端类型字符串映射为前端数字类型
    const mapTypeToNumber = (typeStr) => {
      const typeMap = {
        'register': 1,      // 注册奖励
        'daily_login': 2,   // 每日登录
        'purchase': 3,      // 购买商品
        'review': 4,        // 评价商品
        'exchange': 5,      // 兑换商品
        'admin': 6          // 管理员调整
      }
      return typeMap[typeStr] || 1 // 默认返回1
    }
    
    // 将前端数字类型映射为后端类型字符串
    const mapNumberToType = (typeNum) => {
      const typeMap = {
        1: 'register',      // 注册奖励
        2: 'daily_login',   // 每日登录
        3: 'purchase',      // 购买商品
        4: 'review',        // 评价商品
        5: 'exchange',      // 兑换商品
        6: 'admin'          // 管理员调整
      }
      return typeMap[typeNum] || 'register' // 默认返回register
    }

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return ''
      return dateString
    }

    // 获取规则类型颜色
    const getRuleTypeTag = (type) => {
      const typeMap = {
        1: 'success',  // 注册奖励
        2: 'primary',  // 每日登录
        3: 'warning',  // 购买商品
        4: 'info',     // 评价商品
        5: 'danger',   // 兑换商品
        6: ''          // 管理员调整
      }
      return typeMap[type] || ''
    }

    // 获取规则类型名称
    const getRuleTypeName = (type) => {
      const ruleType = state.ruleTypeOptions.find(item => item.value === type)
      return ruleType ? ruleType.label : '未知类型'
    }

    // 处理筛选
    const handleFilter = () => {
      state.listQuery.page = 1
      fetchData()
    }

    // 重置表单
    const resetTemp = () => {
      state.temp = {
        id: undefined,
        ruleName: '',
        ruleType: 1,
        pointsValue: 0,
        description: '',
        status: 1
      }
    }

    // 处理创建规则
    const handleCreate = () => {
      resetTemp()
      state.dialogStatus = 'create'
      state.dialogFormVisible = true
      setTimeout(() => {
        if (dataFormRef.value) {
          dataFormRef.value.clearValidate()
        }
      }, 0)
    }

    // 创建数据
    const createData = () => {
      dataFormRef.value.validate((valid) => {
        if (valid) {
          // 转换前端数据结构为后端所需格式
          const ruleData = {
            title: state.temp.ruleName,
            type: mapNumberToType(state.temp.ruleType),
            value: state.temp.pointsValue,
            description: state.temp.description,
            enabled: state.temp.status
          }
          
          createPointsRule(ruleData).then(response => {
            ElMessage({
              message: '创建积分规则成功！',
              type: 'success',
              duration: 2000
            })
            state.dialogFormVisible = false
            fetchData()
          }).catch(error => {
            console.error('创建积分规则失败:', error)
            ElMessage.error('创建积分规则失败')
          })
        }
      })
    }

    // 处理更新
    const handleUpdate = (row) => {
      state.temp = Object.assign({}, row) // 复制一行数据
      state.dialogStatus = 'update'
      state.dialogFormVisible = true
      setTimeout(() => {
        if (dataFormRef.value) {
          dataFormRef.value.clearValidate()
        }
      }, 0)
    }

    // 更新数据
    const updateData = () => {
      dataFormRef.value.validate((valid) => {
        if (valid) {
          // 转换前端数据结构为后端所需格式
          const tempData = {
            id: state.temp.id,
            title: state.temp.ruleName,
            type: mapNumberToType(state.temp.ruleType),
            value: state.temp.pointsValue,
            description: state.temp.description,
            enabled: state.temp.status
          }
          
          updatePointsRule(tempData.id, tempData).then(response => {
            ElMessage({
              message: '更新积分规则成功！',
              type: 'success',
              duration: 2000
            })
            state.dialogFormVisible = false
            fetchData()
          }).catch(error => {
            console.error('更新积分规则失败:', error)
            ElMessage.error('更新积分规则失败')
          })
        }
      })
    }

    // 处理删除
    const handleDelete = (id) => {
      ElMessageBox.confirm('确认删除此积分规则吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePointsRule(id).then(() => {
          ElMessage({
            type: 'success',
            message: '删除成功!'
          })
          fetchData()
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

    onMounted(() => {
      fetchData()
    })

    return {
      dataFormRef,
      ...toRefs(state),
      fetchData,
      formatDate,
      getRuleTypeTag,
      getRuleTypeName,
      handleFilter,
      handleCreate,
      createData,
      handleUpdate,
      updateData,
      handleDelete,
      mapTypeToNumber,
      mapNumberToType
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}
.filter-item {
  margin-right: 10px;
}
.hint-text {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style> 