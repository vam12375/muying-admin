<template>
  <div class="app-container">
    <!-- 筛选容器 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.productName"
        placeholder="商品名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="商品状态"
        clearable
        style="width: 130px"
        class="filter-item"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button class="filter-item" type="primary" icon="Search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" type="primary" icon="Plus" @click="handleCreate">
        创建积分商品
      </el-button>
    </div>

    <!-- 积分商品表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="商品ID" align="center" width="100">
        <template #default="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="商品图片" align="center" width="120">
        <template #default="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
            fit="cover"
          />
        </template>
      </el-table-column>
      
      <el-table-column label="商品名称" align="center" min-width="150">
        <template #default="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="所需积分" align="center" width="100">
        <template #default="scope">
          <span>{{ scope.row.pointsPrice }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="库存数量" align="center" width="100">
        <template #default="scope">
          <span>{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="已兑换数量" align="center" width="100">
        <template #default="scope">
          <span>{{ scope.row.exchangeCount }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="商品状态" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
            {{ scope.row.status === 1 ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="创建时间" align="center" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button 
            type="success" 
            size="small" 
            @click="handleUpdateStatus(scope.row.id, scope.row.status === 1 ? 0 : 1)"
          >
            {{ scope.row.status === 1 ? '下架' : '上架' }}
          </el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope.row.id)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">
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
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import Pagination from '@/components/Pagination/index.vue'
import { getPointsProductList, updatePointsProductStatus, deletePointsProduct } from '@/api/points'

export default {
  name: 'PointsProduct',
  components: { Pagination },
  setup() {
    const router = useRouter()
    
    const state = reactive({
      list: [], // 积分商品列表
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        productName: '',
        status: ''
      },
      statusOptions: [
        { value: 1, label: '上架' },
        { value: 0, label: '下架' }
      ]
    })

    // 获取积分商品列表
    const fetchData = () => {
      state.listLoading = true
      getPointsProductList(state.listQuery).then(response => {
        state.list = response.data.list
        state.total = response.data.total
        state.listLoading = false
      }).catch(() => {
        state.listLoading = false
      })
    }

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return ''
      return dateString
    }

    // 处理筛选
    const handleFilter = () => {
      state.listQuery.page = 1
      fetchData()
    }

    // 处理创建积分商品
    const handleCreate = () => {
      router.push({ path: '/points/product/create' })
    }

    // 处理编辑积分商品
    const handleEdit = (id) => {
      router.push({ path: `/points/product/edit/${id}` })
    }

    // 处理更新商品状态（上架/下架）
    const handleUpdateStatus = (id, status) => {
      const statusText = status === 1 ? '上架' : '下架'
      ElMessageBox.confirm(`确认${statusText}该积分商品?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updatePointsProductStatus(id, status).then(() => {
          ElMessage({
            type: 'success',
            message: `${statusText}成功!`
          })
          fetchData()
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消操作'
        })
      })
    }

    // 处理删除
    const handleDelete = (id) => {
      ElMessageBox.confirm('确认删除此积分商品吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePointsProduct(id).then(() => {
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
      ...toRefs(state),
      fetchData,
      formatDate,
      handleFilter,
      handleCreate,
      handleEdit,
      handleUpdateStatus,
      handleDelete
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
</style> 