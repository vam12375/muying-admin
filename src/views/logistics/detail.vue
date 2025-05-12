<template>
  <div class="logistics-detail-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>物流详情</span>
          <div>
            <el-button @click="goBack">返回</el-button>
            <el-button type="primary" @click="handleAddTrack">添加轨迹</el-button>
            <el-button type="success" @click="startAutoGenerateTracks" :disabled="autoGenerating">
              {{ autoGenerating ? '自动生成中...' : '自动生成轨迹' }}
            </el-button>
          </div>
        </div>
      </template>
      
      <el-descriptions title="物流基本信息" :column="2" border v-loading="loading">
        <el-descriptions-item label="物流单号">{{ logistics.trackingNo }}</el-descriptions-item>
        <el-descriptions-item label="物流公司">{{ logistics.company?.name }}</el-descriptions-item>
        <el-descriptions-item label="物流状态">
          <el-tag :type="getStatusType(logistics.status)">
            {{ getStatusText(logistics.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="关联订单">
          <router-link :to="{ name: 'OrderDetail', params: { id: logistics.orderId } }">
            {{ logistics.orderId }}
          </router-link>
        </el-descriptions-item>
        <el-descriptions-item label="收件人">{{ logistics.receiverName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ logistics.receiverPhone }}</el-descriptions-item>
        <el-descriptions-item label="收件地址" :span="2">{{ logistics.receiverAddress }}</el-descriptions-item>
        <el-descriptions-item label="发货时间">{{ formatDate(logistics.shippingTime) }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(logistics.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ logistics.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
      
      <div style="margin-top: 20px">
        <div class="section-title">物流轨迹</div>
        <el-timeline>
          <el-timeline-item
            v-for="(track, index) in tracks"
            :key="index"
            :timestamp="formatDate(track.trackingTime)"
            :type="getTrackItemType(track.status)"
            :hollow="track.status === 'CREATED'"
          >
            <div class="track-content">
              <div class="track-status">
                <el-tag :type="getStatusType(track.status)" size="small">{{ getStatusText(track.status) }}</el-tag>
                <span class="track-location" v-if="track.location">{{ track.location }}</span>
              </div>
              <div class="track-desc">{{ track.content }}</div>
              <div class="track-operator" v-if="track.operator">操作人: {{ track.operator }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-if="tracks.length === 0" description="暂无物流轨迹"></el-empty>
      </div>
    </el-card>
    
    <!-- 添加轨迹对话框 -->
    <el-dialog 
      title="添加物流轨迹" 
      v-model="trackDialogVisible" 
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="trackForm" :rules="trackRules" ref="trackFormRef" label-width="80px">
        <el-form-item label="位置" prop="location">
          <el-input v-model="trackForm.location" placeholder="请输入当前位置"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="trackForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="已创建" value="CREATED"></el-option>
            <el-option label="运输中" value="SHIPPING"></el-option>
            <el-option label="已送达" value="DELIVERED"></el-option>
            <el-option label="异常" value="EXCEPTION"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="trackForm.content" type="textarea" :rows="3" placeholder="请输入轨迹内容"></el-input>
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-input v-model="trackForm.operator" placeholder="请输入操作人"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="trackDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitTrackForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getLogisticsDetail, getLogisticsTracks, addLogisticsTrack, updateLogisticsStatus } from '@/api/logistics'

const route = useRoute()
const router = useRouter()
const logisticsId = ref(route.params.id)

// 数据
const logistics = ref({})
const tracks = ref([])
const loading = ref(false)

// 轨迹对话框数据
const trackDialogVisible = ref(false)
const trackFormRef = ref(null)
const trackForm = reactive({
  location: '',
  status: '',
  content: '',
  operator: ''
})

// 轨迹表单校验规则
const trackRules = {
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入轨迹内容', trigger: 'blur' }
  ]
}

// 自动生成轨迹
const autoGenerating = ref(false)
const autoGenerateInterval = ref(null)
const autoGenerateCount = ref(0)
const locationList = [
  '【揽收】快递已揽收, 广州市白云区分拣中心',
  '【运输】已到达广州市中心分拣中心',
  '【离开】离开广州市中心分拣中心，发往杭州市',
  '【到达】已到达杭州市分拣中心',
  '【派送】快递员已揽收，正在派送中',
  '【送达】包裹已送达，签收人：本人',
]

// 获取物流详情
const getDetail = async () => {
  loading.value = true
  try {
    const res = await getLogisticsDetail(logisticsId.value)
    logistics.value = res.data
  } catch (error) {
    console.error('获取物流详情失败', error)
    ElMessage.error('获取物流详情失败')
  } finally {
    loading.value = false
  }
}

// 获取物流轨迹
const getTracks = async () => {
  try {
    const res = await getLogisticsTracks(logisticsId.value)
    tracks.value = res.data
  } catch (error) {
    console.error('获取物流轨迹失败', error)
    ElMessage.error('获取物流轨迹失败')
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'CREATED': return 'info'
    case 'SHIPPING': return 'primary'
    case 'DELIVERED': return 'success'
    case 'EXCEPTION': return 'danger'
    default: return 'info'
  }
}

// 获取轨迹项类型
const getTrackItemType = (status) => {
  switch (status) {
    case 'SHIPPING': return 'primary'
    case 'DELIVERED': return 'success'
    case 'EXCEPTION': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'CREATED': return '已创建'
    case 'SHIPPING': return '运输中'
    case 'DELIVERED': return '已送达'
    case 'EXCEPTION': return '异常'
    default: return '未知'
  }
}

// 添加轨迹对话框
const handleAddTrack = () => {
  trackForm.location = ''
  trackForm.status = logistics.value.status || 'CREATED'
  trackForm.content = ''
  trackForm.operator = '管理员'
  trackDialogVisible.value = true
}

// 提交轨迹表单
const submitTrackForm = async () => {
  trackFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await addLogisticsTrack(logisticsId.value, trackForm)
        ElMessage.success('添加轨迹成功')
        trackDialogVisible.value = false
        
        // 如果状态不一致，更新物流状态
        if (trackForm.status !== logistics.value.status) {
          await updateLogisticsStatus(logisticsId.value, trackForm.status, '状态由轨迹更新')
          ElMessage.success('物流状态已更新')
        }
        
        // 刷新数据
        await getDetail()
        await getTracks()
      } catch (error) {
        console.error('添加轨迹失败', error)
        ElMessage.error('添加轨迹失败: ' + (error.response?.data?.message || error.message))
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

// 开始自动生成物流轨迹
const startAutoGenerateTracks = () => {
  if (autoGenerating.value) {
    ElMessage.warning('正在自动生成轨迹中，请稍候')
    return
  }
  
  // 重置计数
  autoGenerateCount.value = 0
  autoGenerating.value = true
  
  // 更新状态为运输中
  updateLogisticsStatus(logisticsId.value, 'SHIPPING', '自动更新为运输中')
    .then(() => {
      ElMessage.success('已开始自动生成物流轨迹')
      
      // 立即生成第一条
      generateNextTrack()
      
      // 设置定时器，每5秒生成一条新轨迹
      autoGenerateInterval.value = setInterval(() => {
        generateNextTrack()
      }, 5000)
    })
    .catch(error => {
      autoGenerating.value = false
      ElMessage.error('启动自动生成失败: ' + error.message)
    })
}

// 生成下一条物流轨迹
const generateNextTrack = async () => {
  try {
    autoGenerateCount.value++
    console.log(`生成第 ${autoGenerateCount.value} 条物流轨迹`)
    
    // 获取当前轨迹内容
    const location = autoGenerateCount.value <= locationList.length 
      ? locationList[autoGenerateCount.value - 1] 
      : '【更新】物流信息更新'
    
    const content = location.split('】')[1] || '物流信息更新'
    const trackLocation = location.includes('【') ? location.split('【')[1].split('】')[0] : ''
    
    // 默认状态为运输中
    let status = 'SHIPPING'
    
    // 如果是第5条轨迹，状态更新为已送达
    if (autoGenerateCount.value === 5) {
      status = 'DELIVERED'
    }
    
    // 创建轨迹对象
    const trackData = {
      location: trackLocation,
      status: status,
      content: content,
      operator: '系统自动'
    }
    
    // 添加轨迹
    await addLogisticsTrack(logisticsId.value, trackData)
    
    // 如果是第5条轨迹，更新物流状态为已送达并停止生成
    if (autoGenerateCount.value === 5) {
      await updateLogisticsStatus(logisticsId.value, 'DELIVERED', '自动更新为已送达')
      stopAutoGenerate()
      ElMessage.success('物流已自动签收，轨迹生成完成')
    }
    
    // 刷新轨迹列表
    await getDetail()
    await getTracks()
    
  } catch (error) {
    console.error('生成轨迹失败', error)
    ElMessage.error('生成轨迹失败: ' + (error.response?.data?.message || error.message))
    stopAutoGenerate()
  }
}

// 停止自动生成
const stopAutoGenerate = () => {
  if (autoGenerateInterval.value) {
    clearInterval(autoGenerateInterval.value)
    autoGenerateInterval.value = null
  }
  autoGenerating.value = false
}

// 组件卸载前清除定时器
onBeforeUnmount(() => {
  stopAutoGenerate()
})

// 页面加载时获取数据
onMounted(async () => {
  await getDetail()
  await getTracks()
})
</script>

<style scoped>
.logistics-detail-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}
.track-content {
  padding-bottom: 10px;
}
.track-status {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.track-location {
  margin-left: 10px;
  font-size: 14px;
  color: #606266;
}
.track-desc {
  margin-top: 5px;
  font-size: 14px;
}
.track-operator {
  margin-top: 5px;
  font-size: 12px;
  color: #909399;
}
</style> 