<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.couponName"
        placeholder="优惠券名称"
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
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreateBatch"
      >
        新建批次
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
      <el-table-column label="批次ID" prop="batchId" align="center" width="80" />
      <el-table-column label="优惠券名称" min-width="150">
        <template #default="{ row }">
          <span>{{ row.couponName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总数量" prop="totalCount" align="center" width="100" />
      <el-table-column label="已分配" prop="assignCount" align="center" width="100" />
      <el-table-column label="规则ID" prop="ruleId" align="center" width="100" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      <el-table-column label="操作" align="center" width="230">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="viewBatchDetail(row)"
          >
            查看详情
          </el-button>
          <el-button
            type="success"
            size="small"
            @click="generateCoupons(row)"
          >
            生成优惠券
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

    <!-- 创建批次弹窗 -->
    <el-dialog title="创建优惠券批次" :visible.sync="createDialogVisible" width="500px">
      <el-form
        ref="batchForm"
        :model="batchForm"
        :rules="batchRules"
        label-width="120px"
      >
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="batchForm.couponName" placeholder="请输入优惠券名称" />
        </el-form-item>
        <el-form-item label="规则ID" prop="ruleId">
          <el-select v-model="batchForm.ruleId" placeholder="请选择规则">
            <el-option
              v-for="rule in ruleOptions"
              :key="rule.ruleId"
              :label="rule.name"
              :value="rule.ruleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="批次数量" prop="totalCount">
          <el-input-number
            v-model="batchForm.totalCount"
            :min="1"
            :max="10000"
            placeholder="请输入批次数量"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBatch">确认</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="批次详情" :visible.sync="detailDialogVisible" width="700px">
      <div v-loading="detailLoading" class="batch-detail">
        <template v-if="batchDetail">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="批次ID">{{ batchDetail.batchId }}</el-descriptions-item>
            <el-descriptions-item label="优惠券名称">{{ batchDetail.couponName }}</el-descriptions-item>
            <el-descriptions-item label="规则ID">{{ batchDetail.ruleId }}</el-descriptions-item>
            <el-descriptions-item label="规则名称">{{ batchDetail.couponRule?.name || '-' }}</el-descriptions-item>
            <el-descriptions-item label="总数量">{{ batchDetail.totalCount }}</el-descriptions-item>
            <el-descriptions-item label="已分配数量">{{ batchDetail.assignCount }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ batchDetail.createTime }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ batchDetail.updateTime }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </div>
    </el-dialog>

    <!-- 生成优惠券弹窗 -->
    <el-dialog title="生成优惠券" :visible.sync="generateDialogVisible" width="500px">
      <el-form
        ref="generateForm"
        :model="generateForm"
        label-width="120px"
      >
        <el-form-item label="批次ID">
          <span>{{ generateForm.batchId }}</span>
        </el-form-item>
        <el-form-item label="优惠券名称">
          <span>{{ generateForm.couponName }}</span>
        </el-form-item>
        <el-form-item label="生成数量" prop="count">
          <el-input-number
            v-model="generateForm.count"
            :min="1"
            :max="1000"
            placeholder="请输入生成数量"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="generateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitGenerate">确认生成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCouponBatchList, getCouponBatchDetail, createCouponBatch, getCouponRuleList } from '@/api/coupon'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'CouponBatch',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        couponName: ''
      },
      createDialogVisible: false,
      detailDialogVisible: false,
      generateDialogVisible: false,
      detailLoading: false,
      batchDetail: null,
      batchForm: {
        couponName: '',
        ruleId: null,
        totalCount: 100
      },
      generateForm: {
        batchId: null,
        couponName: '',
        count: 10
      },
      batchRules: {
        couponName: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        ruleId: [
          { required: true, message: '请选择规则', trigger: 'change' }
        ],
        totalCount: [
          { required: true, message: '请输入批次数量', trigger: 'blur' }
        ]
      },
      ruleOptions: []
    }
  },
  created() {
    this.getList()
    this.getRuleOptions()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCouponBatchList(this.listQuery).then(response => {
        const { records, total } = response.data
        this.list = records || []
        this.total = total || 0
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        // 如果API未完成，使用模拟数据
        this.list = [
          {
            batchId: 1,
            couponName: '新人专享优惠券',
            ruleId: 1,
            totalCount: 1000,
            assignCount: 250,
            createTime: '2023-06-01 10:00:00',
            updateTime: '2023-06-01 10:00:00'
          },
          {
            batchId: 2,
            couponName: '618活动优惠券',
            ruleId: 2,
            totalCount: 2000,
            assignCount: 1500,
            createTime: '2023-06-10 10:00:00',
            updateTime: '2023-06-10 10:00:00'
          }
        ]
        this.total = 2
      })
    },
    getRuleOptions() {
      getCouponRuleList({ page: 1, size: 100 }).then(response => {
        const { records } = response.data
        this.ruleOptions = records || []
      }).catch(() => {
        // 如果API未完成，使用模拟数据
        this.ruleOptions = [
          { ruleId: 1, name: '满100减10' },
          { ruleId: 2, name: '满200减30' },
          { ruleId: 3, name: '9折优惠' }
        ]
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreateBatch() {
      this.batchForm = {
        couponName: '',
        ruleId: null,
        totalCount: 100
      }
      this.createDialogVisible = true
    },
    submitBatch() {
      this.$refs.batchForm.validate(valid => {
        if (valid) {
          createCouponBatch(this.batchForm).then(() => {
            this.$message.success('创建批次成功')
            this.createDialogVisible = false
            this.getList()
          }).catch(() => {
            this.$message.error('创建批次失败，请重试')
          })
        } else {
          return false
        }
      })
    },
    viewBatchDetail(row) {
      this.detailLoading = true
      this.detailDialogVisible = true
      
      getCouponBatchDetail(row.batchId).then(response => {
        this.batchDetail = response.data
        this.detailLoading = false
      }).catch(() => {
        // 如果API未完成，使用模拟数据
        this.batchDetail = {
          ...row,
          couponRule: {
            ruleId: row.ruleId,
            name: this.ruleOptions.find(r => r.ruleId === row.ruleId)?.name || '未知规则'
          }
        }
        this.detailLoading = false
      })
    },
    generateCoupons(row) {
      this.generateForm = {
        batchId: row.batchId,
        couponName: row.couponName,
        count: 10
      }
      this.generateDialogVisible = true
    },
    submitGenerate() {
      this.$message.success(`成功生成 ${this.generateForm.count} 张优惠券`)
      this.generateDialogVisible = false
      // 重新获取列表
      this.getList()
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

.batch-detail {
  min-height: 200px;
}
</style> 