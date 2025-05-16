<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.userId"
        placeholder="用户ID"
        style="width: 120px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-input
        v-model="listQuery.username"
        placeholder="用户名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="用户ID" prop="userId" align="center" width="100" />
      <el-table-column label="用户名" min-width="120">
        <template #default="{ row }">
          <span>{{ row.user ? row.user.username : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" min-width="120">
        <template #default="{ row }">
          <span>{{ row.user && row.user.realName ? row.user.realName : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前积分" align="center" width="120">
        <template #default="{ row }">
          <span class="points-text">{{ row.points }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" prop="level" align="center" width="120">
        <template #default="{ row }">
          <el-tag :type="getTagType(row.level)">{{ getLevelName(row.level) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      <el-table-column label="更新时间" prop="updateTime" align="center" width="180" />
      <el-table-column label="操作" align="center" width="250">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="handleAdjustPoints(row)"
          >
            调整积分
          </el-button>
          <el-button
            type="info"
            size="small"
            @click="viewPointsHistory(row)"
          >
            查看历史
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

    <!-- 调整积分弹窗 -->
    <el-dialog title="调整积分" v-model="adjustDialogVisible" width="500px">
      <el-form
        ref="adjustForm"
        :model="adjustForm"
        :rules="adjustRules"
        label-width="100px"
      >
        <el-form-item label="用户ID">
          <span>{{ selectedUser ? selectedUser.userId : '' }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <span>{{ selectedUser && selectedUser.user ? selectedUser.user.username : '' }}</span>
        </el-form-item>
        <el-form-item label="当前积分">
          <span>{{ selectedUser ? selectedUser.points : 0 }}</span>
        </el-form-item>
        <el-form-item label="积分变动" prop="points">
          <el-input-number
            v-model="adjustForm.points"
            :min="-10000"
            :max="10000"
            placeholder="请输入积分变动值"
          />
          <span class="hint-text">正数为增加，负数为减少</span>
        </el-form-item>
        <el-form-item label="变动原因" prop="description">
          <el-input
            v-model="adjustForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入积分变动原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="adjustDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAdjustPoints">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getUserPoints, adjustUserPoints } from '@/api/points'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'UserPoints',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        userId: undefined,
        username: undefined
      },
      adjustDialogVisible: false,
      selectedUser: null,
      adjustForm: {
        points: 0,
        description: ''
      },
      adjustRules: {
        points: [
          { required: true, message: '请输入积分变动值', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入变动原因', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      
      // 使用真实API调用获取用户积分数据
      getUserPoints(this.listQuery).then(response => {
        // 从响应中提取数据，确保字段匹配
        const { records, total } = response.data
        
        // 如果records是用户积分列表，可能需要关联user信息
        // 这里假设后端已关联好user信息，如果没有，前端可以二次处理
        this.list = records
        this.total = total
        this.listLoading = false
      }).catch(error => {
        console.error('获取用户积分数据失败:', error)
        this.$message.error('获取用户积分数据失败，请重试')
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAdjustPoints(row) {
      this.selectedUser = row
      this.adjustForm.points = 0
      this.adjustForm.description = ''
      this.adjustDialogVisible = true
    },
    viewPointsHistory(row) {
      // 跳转到积分历史页面，并带上用户ID
      this.$router.push({
        path: '/points/list',
        query: { userId: row.userId }
      })
    },
    submitAdjustPoints() {
      this.$refs.adjustForm.validate(valid => {
        if (valid) {
          const userId = this.selectedUser.userId
          const { points, description } = this.adjustForm
          
          adjustUserPoints(userId, points, description).then(() => {
            this.$message.success('积分调整成功')
            this.adjustDialogVisible = false
            this.getList() // 刷新列表
          }).catch(error => {
            console.error('积分调整失败:', error)
            this.$message.error('积分调整失败，请重试')
          })
        } else {
          return false
        }
      })
    },
    getTagType(level) {
      const types = {
        bronze: 'info',
        silver: 'warning',
        gold: 'success',
        platinum: 'danger'
      }
      return types[level] || 'info'
    },
    getLevelName(level) {
      const names = {
        bronze: '青铜会员',
        silver: '白银会员',
        gold: '黄金会员',
        platinum: '铂金会员'
      }
      return names[level] || level
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

.points-text {
  font-weight: bold;
  color: #409EFF;
  font-size: 16px;
}

.hint-text {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}
</style>
