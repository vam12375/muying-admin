<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="规则名称"
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
        @click="handleCreate"
      >
        新建规则
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
      <el-table-column label="规则ID" prop="ruleId" align="center" width="80" />
      <el-table-column label="规则名称" min-width="150">
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则类型" align="center" width="120">
        <template #default="{ row }">
          <el-tag :type="row.type === 0 ? 'primary' : row.type === 1 ? 'success' : 'warning'">
            {{ getTypeName(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="规则内容" prop="ruleContent" min-width="200" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
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

    <!-- 创建/编辑规则弹窗 -->
    <el-dialog :title="isEdit ? '编辑规则' : '新建规则'" :visible.sync="dialogVisible" width="500px">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="规则类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择规则类型">
            <el-option :value="0" label="满减优惠" />
            <el-option :value="1" label="直减优惠" />
            <el-option :value="2" label="折扣优惠" />
          </el-select>
        </el-form-item>
        
        <template v-if="ruleForm.type === 0">
          <!-- 满减规则 -->
          <el-form-item label="满减条件" prop="fullAmount">
            <el-input-number
              v-model="ruleForm.fullAmount"
              :min="0"
              :precision="2"
              :step="10"
              placeholder="请输入满减金额"
            />
            <span class="hint-text">元</span>
          </el-form-item>
          <el-form-item label="减免金额" prop="reduceAmount">
            <el-input-number
              v-model="ruleForm.reduceAmount"
              :min="0"
              :precision="2"
              :step="1"
              placeholder="请输入减免金额"
            />
            <span class="hint-text">元</span>
          </el-form-item>
        </template>

        <template v-if="ruleForm.type === 1">
          <!-- 直减规则 -->
          <el-form-item label="减免金额" prop="directAmount">
            <el-input-number
              v-model="ruleForm.directAmount"
              :min="0"
              :precision="2"
              :step="1"
              placeholder="请输入减免金额"
            />
            <span class="hint-text">元</span>
          </el-form-item>
        </template>

        <template v-if="ruleForm.type === 2">
          <!-- 折扣规则 -->
          <el-form-item label="折扣比例" prop="discountRate">
            <el-input-number
              v-model="ruleForm.discountRate"
              :min="0"
              :max="100"
              :precision="0"
              :step="5"
              placeholder="请输入折扣比例"
            />
            <span class="hint-text">%</span>
          </el-form-item>
          <el-form-item label="最大优惠" prop="maxDiscount">
            <el-input-number
              v-model="ruleForm.maxDiscount"
              :min="0"
              :precision="2"
              :step="10"
              placeholder="请输入最大优惠金额"
            />
            <span class="hint-text">元 (0表示不限制)</span>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCouponRuleList, createCouponRule, updateCouponRule } from '@/api/coupon'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'CouponRule',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        name: ''
      },
      dialogVisible: false,
      isEdit: false,
      ruleForm: {
        name: '',
        type: 0,
        fullAmount: 0,
        reduceAmount: 0,
        directAmount: 0,
        discountRate: 90,
        maxDiscount: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入规则名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择规则类型', trigger: 'change' }
        ],
        fullAmount: [
          { required: true, message: '请输入满减金额', trigger: 'blur' }
        ],
        reduceAmount: [
          { required: true, message: '请输入减免金额', trigger: 'blur' }
        ],
        directAmount: [
          { required: true, message: '请输入减免金额', trigger: 'blur' }
        ],
        discountRate: [
          { required: true, message: '请输入折扣比例', trigger: 'blur' }
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
      getCouponRuleList(this.listQuery).then(response => {
        const { records, total } = response.data
        this.list = records || []
        this.total = total || 0
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        // 如果API未完成，使用模拟数据
        this.list = [
          {
            ruleId: 1,
            name: '满100减10',
            type: 0,
            ruleContent: '{"fullAmount":100,"reduceAmount":10}',
            createTime: '2023-06-01 10:00:00',
            updateTime: '2023-06-01 10:00:00'
          },
          {
            ruleId: 2,
            name: '满200减30',
            type: 0,
            ruleContent: '{"fullAmount":200,"reduceAmount":30}',
            createTime: '2023-06-02 10:00:00',
            updateTime: '2023-06-02 10:00:00'
          },
          {
            ruleId: 3,
            name: '无门槛减5元',
            type: 1,
            ruleContent: '{"directAmount":5}',
            createTime: '2023-06-03 10:00:00',
            updateTime: '2023-06-03 10:00:00'
          },
          {
            ruleId: 4,
            name: '9折优惠',
            type: 2,
            ruleContent: '{"discountRate":90,"maxDiscount":0}',
            createTime: '2023-06-04 10:00:00',
            updateTime: '2023-06-04 10:00:00'
          }
        ]
        this.total = 4
      })
    },
    getTypeName(type) {
      const typeMap = {
        0: '满减优惠',
        1: '直减优惠',
        2: '折扣优惠'
      }
      return typeMap[type] || '未知类型'
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.isEdit = false
      this.ruleForm = {
        name: '',
        type: 0,
        fullAmount: 100,
        reduceAmount: 10,
        directAmount: 5,
        discountRate: 90,
        maxDiscount: 0
      }
      this.dialogVisible = true
    },
    handleUpdate(row) {
      this.isEdit = true
      let ruleContent = {}
      
      try {
        ruleContent = JSON.parse(row.ruleContent)
      } catch (e) {
        console.error('解析规则内容失败', e)
      }
      
      this.ruleForm = {
        ruleId: row.ruleId,
        name: row.name,
        type: row.type,
        fullAmount: ruleContent.fullAmount || 0,
        reduceAmount: ruleContent.reduceAmount || 0,
        directAmount: ruleContent.directAmount || 0,
        discountRate: ruleContent.discountRate || 90,
        maxDiscount: ruleContent.maxDiscount || 0
      }
      
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确认删除该规则吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        this.getList()
      }).catch(() => {})
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 构建规则内容
          let ruleContent = {}
          
          if (this.ruleForm.type === 0) {
            ruleContent = {
              fullAmount: this.ruleForm.fullAmount,
              reduceAmount: this.ruleForm.reduceAmount
            }
          } else if (this.ruleForm.type === 1) {
            ruleContent = {
              directAmount: this.ruleForm.directAmount
            }
          } else if (this.ruleForm.type === 2) {
            ruleContent = {
              discountRate: this.ruleForm.discountRate,
              maxDiscount: this.ruleForm.maxDiscount
            }
          }
          
          const ruleData = {
            name: this.ruleForm.name,
            type: this.ruleForm.type,
            ruleContent: JSON.stringify(ruleContent)
          }
          
          if (this.isEdit) {
            ruleData.ruleId = this.ruleForm.ruleId
            updateCouponRule(this.ruleForm.ruleId, ruleData).then(() => {
              this.$message.success('更新规则成功')
              this.dialogVisible = false
              this.getList()
            }).catch(() => {
              this.$message.error('更新规则失败，请重试')
            })
          } else {
            createCouponRule(ruleData).then(() => {
              this.$message.success('创建规则成功')
              this.dialogVisible = false
              this.getList()
            }).catch(() => {
              this.$message.error('创建规则失败，请重试')
            })
          }
        } else {
          return false
        }
      })
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

.hint-text {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}
</style> 