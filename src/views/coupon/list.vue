<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="优惠券名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        placeholder="优惠券类型"
        clearable
        style="width: 160px"
        class="filter-item"
      >
        <el-option label="固定金额" value="FIXED" />
        <el-option label="百分比折扣" value="PERCENTAGE" />
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option label="可用" value="ACTIVE" />
        <el-option label="不可用" value="INACTIVE" />
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新建优惠券
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="优惠券名称" min-width="100">
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.type === 'FIXED' ? 'success' : 'warning'">
            {{ row.type === 'FIXED' ? '固定金额' : '百分比折扣' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="面值/折扣" width="120" align="center">
        <template #default="{ row }">
          <span>{{ row.type === 'FIXED' ? '¥' + row.value : row.value + '%折' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用门槛" width="120" align="center">
        <template #default="{ row }">
          <span>{{ row.minSpend ? '满' + row.minSpend + '元可用' : '无门槛' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发行量/已领取" width="120" align="center">
        <template #default="{ row }">
          <span>{{ row.receivedQuantity || 0 }}/{{ row.totalQuantity || '无限' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期" width="180" align="center">
        <template #default="{ row }">
          <span>{{ formatDate(row.startTime) }} 至 {{ formatDate(row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            active-value="ACTIVE"
            inactive-value="INACTIVE"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getCouponList, updateCouponStatus, deleteCoupon } from '@/api/coupon'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'CouponList',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        name: undefined,
        type: undefined,
        status: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCouponList(this.listQuery).then(response => {
        const { records, total } = response.data
        this.list = records
        this.total = total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.$router.push({ name: 'CouponCreate' })
    },
    handleUpdate(row) {
      this.$router.push({ name: 'CouponEdit', params: { id: row.id } })
    },
    handleDelete(row) {
      this.$confirm('确认删除该优惠券吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCoupon(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    handleStatusChange(row) {
      const status = row.status
      const statusText = status === 'ACTIVE' ? '启用' : '停用'

      this.$confirm(`确认${statusText}该优惠券吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateCouponStatus(row.id, status).then(() => {
          this.$message({
            type: 'success',
            message: `${statusText}成功!`
          })
        })
      }).catch(() => {
        row.status = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      })
    },
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style> 