<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑积分商品' : '创建积分商品' }}</span>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="product-form"
      >
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名称" />
        </el-form-item>
        
        <el-form-item label="所需积分" prop="pointsPrice">
          <el-input-number
            v-model="form.pointsPrice"
            :min="1"
            :max="100000"
            style="width: 180px;"
          />
        </el-form-item>
        
        <el-form-item label="商品库存" prop="stock">
          <el-input-number
            v-model="form.stock"
            :min="0"
            :max="99999"
            style="width: 180px;"
          />
        </el-form-item>
        
        <el-form-item label="商品图片" prop="image">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadImage"
          >
            <img v-if="form.image" :src="form.image" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <div class="hint-text">推荐尺寸: 400x400px, 大小不超过2MB</div>
        </el-form-item>
        
        <el-form-item label="兑换限制" prop="exchangeLimit">
          <el-input-number
            v-model="form.exchangeLimit"
            :min="0"
            :max="999"
            style="width: 180px;"
          />
          <div class="hint-text">0表示不限制单用户兑换数量</div>
        </el-form-item>
        
        <el-form-item label="有效期" prop="validityType">
          <el-radio-group v-model="form.validityType">
            <el-radio :label="1">永久有效</el-radio>
            <el-radio :label="2">固定天数</el-radio>
            <el-radio :label="3">指定日期</el-radio>
          </el-radio-group>
          
          <div v-if="form.validityType === 2" style="margin-top: 10px;">
            <el-input-number
              v-model="form.validDays"
              :min="1"
              :max="3650"
              style="width: 180px;"
            />
            <span class="ml-10">天</span>
          </div>
          
          <div v-if="form.validityType === 3" style="margin-top: 10px;">
            <el-date-picker
              v-model="form.validDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 350px;"
            />
          </div>
        </el-form-item>
        
        <el-form-item label="商品详情" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="5"
            placeholder="请输入商品详情"
          />
        </el-form-item>
        
        <el-form-item label="商品状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="0"
            :max="9999"
            style="width: 180px;"
          />
          <div class="hint-text">数值越小排序越靠前</div>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getPointsProduct, createPointsProduct, updatePointsProduct } from '@/api/points'

export default {
  name: 'PointsProductForm',
  components: { Plus },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    
    // 判断是否为编辑模式
    const isEdit = computed(() => {
      return !!route.params.id
    })
    
    // 表单数据
    const form = reactive({
      id: undefined,
      productName: '',
      pointsPrice: 100,
      stock: 100,
      image: '',
      exchangeLimit: 0,
      validityType: 1, // 1:永久有效 2:固定天数 3:指定日期
      validDays: 30,
      validDateRange: [],
      description: '',
      status: 1,
      sort: 0
    })
    
    // 表单验证规则
    const rules = reactive({
      productName: [
        { required: true, message: '请输入商品名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在2到50个字符之间', trigger: 'blur' }
      ],
      pointsPrice: [
        { required: true, message: '请输入所需积分', trigger: 'blur' }
      ],
      stock: [
        { required: true, message: '请输入商品库存', trigger: 'blur' }
      ],
      image: [
        { required: true, message: '请上传商品图片', trigger: 'change' }
      ],
      description: [
        { required: true, message: '请输入商品详情', trigger: 'blur' }
      ]
    })
    
    // 图片上传前的验证
    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG && !isPNG) {
        ElMessage.error('上传图片只能是JPG或PNG格式!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('上传图片大小不能超过2MB!')
        return false
      }
      return isJPG || isPNG
    }
    
    // 自定义上传逻辑
    const uploadImage = (options) => {
      // 模拟上传成功
      setTimeout(() => {
        // 实际项目中应该调用上传API
        form.image = 'https://placehold.co/400x400'
        ElMessage.success('上传成功!')
      }, 1000)
    }
    
    // 获取积分商品详情
    const getDetail = (id) => {
      getPointsProduct(id).then(response => {
        Object.assign(form, response.data)
      }).catch(() => {
        ElMessage.error('获取商品详情失败')
      })
    }
    
    // 提交表单
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          // 处理有效期数据
          let validityData = {}
          if (form.validityType === 2) {
            validityData = {
              validDays: form.validDays
            }
          } else if (form.validityType === 3 && form.validDateRange && form.validDateRange.length === 2) {
            validityData = {
              startDate: form.validDateRange[0],
              endDate: form.validDateRange[1]
            }
          }
          
          // 构建提交数据
          const submitData = {
            ...form,
            ...validityData
          }
          
          // 移除不需要提交的数据
          delete submitData.validDateRange
          
          if (isEdit.value) {
            // 编辑模式：调用更新API
            updatePointsProduct(form.id, submitData).then(() => {
              ElMessage.success('更新成功')
              goBack()
            })
          } else {
            // 新增模式：调用创建API
            createPointsProduct(submitData).then(() => {
              ElMessage.success('创建成功')
              goBack()
            })
          }
        } else {
          ElMessage.error('请完善表单信息')
          return false
        }
      })
    }
    
    // 返回列表页
    const goBack = () => {
      router.push('/points/product')
    }
    
    onMounted(() => {
      if (isEdit.value) {
        getDetail(route.params.id)
      }
    })
    
    return {
      formRef,
      form,
      rules,
      isEdit,
      beforeAvatarUpload,
      uploadImage,
      submitForm,
      goBack
    }
  }
}
</script>

<style scoped>
.product-form {
  max-width: 700px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.hint-text {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.ml-10 {
  margin-left: 10px;
}
</style> 