<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑优惠券' : '新建优惠券' }}</span>
      </div>
      <el-form
        ref="couponForm"
        :model="couponForm"
        :rules="rules"
        label-width="120px"
        style="max-width: 600px"
      >
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="couponForm.name" placeholder="请输入优惠券名称" />
        </el-form-item>

        <el-form-item label="优惠券类型" prop="type">
          <el-radio-group v-model="couponForm.type">
            <el-radio label="FIXED">固定金额</el-radio>
            <el-radio label="PERCENTAGE">百分比折扣</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="couponForm.type === 'FIXED' ? '优惠金额' : '折扣比例'" prop="value">
          <el-input-number
            v-model="couponForm.value"
            :min="0"
            :precision="couponForm.type === 'FIXED' ? 2 : 0"
            :step="couponForm.type === 'FIXED' ? 1 : 5"
            :max="couponForm.type === 'FIXED' ? 10000 : 100"
            :placeholder="couponForm.type === 'FIXED' ? '请输入优惠金额' : '请输入折扣比例（1-100）'"
          >
            <template #suffix>
              <span>{{ couponForm.type === 'FIXED' ? '元' : '%' }}</span>
            </template>
          </el-input-number>
        </el-form-item>

        <el-form-item v-if="couponForm.type === 'PERCENTAGE'" label="最大折扣金额" prop="maxDiscount">
          <el-input-number
            v-model="couponForm.maxDiscount"
            :min="0"
            :precision="2"
            :step="10"
            placeholder="请输入最大折扣金额"
          >
            <template #suffix>
              <span>元</span>
            </template>
          </el-input-number>
          <span class="form-tip">0表示不限制最大折扣金额</span>
        </el-form-item>

        <el-form-item label="使用门槛" prop="minSpend">
          <el-input-number
            v-model="couponForm.minSpend"
            :min="0"
            :precision="2"
            :step="10"
            placeholder="请输入使用门槛金额"
          >
            <template #suffix>
              <span>元</span>
            </template>
          </el-input-number>
          <span class="form-tip">0表示无使用门槛</span>
        </el-form-item>

        <el-form-item label="优惠券数量" prop="totalQuantity">
          <el-input-number
            v-model="couponForm.totalQuantity"
            :min="0"
            :step="100"
            placeholder="请输入优惠券数量"
          />
          <span class="form-tip">0表示不限制数量</span>
        </el-form-item>

        <el-form-item label="每人限领" prop="userLimit">
          <el-input-number
            v-model="couponForm.userLimit"
            :min="0"
            :max="10"
            placeholder="请输入每人限领数量"
          />
          <span class="form-tip">0表示不限制</span>
        </el-form-item>

        <el-form-item label="是否可叠加" prop="isStackable">
          <el-switch
            v-model="couponForm.isStackable"
            :active-value="1"
            :inactive-value="0"
          />
          <span class="form-tip">开启后，可与其他优惠券同时使用</span>
        </el-form-item>

        <el-form-item label="有效期" prop="validDate">
          <el-date-picker
            v-model="couponForm.validDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>

        <el-form-item label="适用分类" prop="categoryIds">
          <el-select
            v-model="couponForm.categoryIds"
            multiple
            filterable
            placeholder="请选择适用分类"
          >
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id.toString()"
            />
          </el-select>
          <span class="form-tip">不选择表示适用于所有分类</span>
        </el-form-item>

        <el-form-item label="适用品牌" prop="brandIds">
          <el-select
            v-model="couponForm.brandIds"
            multiple
            filterable
            placeholder="请选择适用品牌"
          >
            <el-option
              v-for="item in brands"
              :key="item.id"
              :label="item.name"
              :value="item.id.toString()"
            />
          </el-select>
          <span class="form-tip">不选择表示适用于所有品牌</span>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="couponForm.status">
            <el-radio label="ACTIVE">可用</el-radio>
            <el-radio label="INACTIVE">不可用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getCouponDetail, createCoupon, updateCoupon } from '@/api/coupon'

export default {
  name: 'CouponForm',
  data() {
    return {
      isEdit: false,
      couponId: null,
      couponForm: {
        name: '',
        type: 'FIXED',
        value: 0,
        maxDiscount: 0,
        minSpend: 0,
        totalQuantity: 0,
        userLimit: 1,
        isStackable: 0,
        validDate: [],
        categoryIds: [],
        brandIds: [],
        status: 'ACTIVE'
      },
      categories: [], // 分类列表，需要从服务器获取
      brands: [], // 品牌列表，需要从服务器获取
      rules: {
        name: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择优惠券类型', trigger: 'change' }
        ],
        value: [
          { required: true, message: '请输入优惠券面值', trigger: 'blur' }
        ],
        validDate: [
          { required: true, message: '请选择有效期', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.isEdit = this.$route.name === 'CouponEdit'
    if (this.isEdit) {
      this.couponId = this.$route.params.id
      this.getCouponDetail()
    }
    this.fetchCategories()
    this.fetchBrands()
  },
  methods: {
    getCouponDetail() {
      getCouponDetail(this.couponId).then(response => {
        const coupon = response.data
        this.couponForm = {
          ...coupon,
          validDate: [coupon.startTime, coupon.endTime],
          categoryIds: coupon.categoryIds ? coupon.categoryIds.split(',') : [],
          brandIds: coupon.brandIds ? coupon.brandIds.split(',') : []
        }
      })
    },
    fetchCategories() {
      // 模拟数据，实际项目中需要从服务器获取
      this.categories = [
        { id: 1, name: '母婴用品' },
        { id: 2, name: '食品' },
        { id: 3, name: '玩具' },
        { id: 4, name: '服装' }
      ]
    },
    fetchBrands() {
      // 模拟数据，实际项目中需要从服务器获取
      this.brands = [
        { id: 1, name: '品牌1' },
        { id: 2, name: '品牌2' },
        { id: 3, name: '品牌3' },
        { id: 4, name: '品牌4' }
      ]
    },
    submitForm() {
      this.$refs.couponForm.validate(valid => {
        if (valid) {
          const couponData = { ...this.couponForm }
          
          // 处理有效期
          if (couponData.validDate && couponData.validDate.length === 2) {
            couponData.startTime = couponData.validDate[0]
            couponData.endTime = couponData.validDate[1]
          }
          delete couponData.validDate

          // 处理分类和品牌
          if (couponData.categoryIds && couponData.categoryIds.length > 0) {
            couponData.categoryIds = couponData.categoryIds.join(',')
          } else {
            couponData.categoryIds = ''
          }
          
          if (couponData.brandIds && couponData.brandIds.length > 0) {
            couponData.brandIds = couponData.brandIds.join(',')
          } else {
            couponData.brandIds = ''
          }

          // 提交表单
          if (this.isEdit) {
            updateCoupon(this.couponId, couponData).then(() => {
              this.$message.success('更新成功')
              this.$router.push({ name: 'CouponList' })
            })
          } else {
            createCoupon(couponData).then(() => {
              this.$message.success('创建成功')
              this.$router.push({ name: 'CouponList' })
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
.form-tip {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}
</style> 