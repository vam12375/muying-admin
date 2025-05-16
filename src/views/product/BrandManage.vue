<template>
  <div class="brand-container" data-aos="fade-up">
    <el-card class="brand-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="header-title">品牌管理</span>
          <div class="header-operations">
            <el-input
              v-model="queryParams.keyword"
              placeholder="输入品牌名称搜索"
              clearable
              prefix-icon="Search"
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <el-button type="primary" class="operation-button" @click="handleSearch">
              <el-icon><Search /></el-icon>搜索
            </el-button>
            <el-button type="success" class="operation-button" @click="handleAdd">
              <el-icon><Plus /></el-icon>添加品牌
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="brandList"
        border
        stripe
        row-key="id"
        height="calc(100vh - 260px)"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="品牌ID" min-width="100" align="center" />
        <el-table-column prop="name" label="品牌名称" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="logo" label="品牌图片" width="120" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.logo"
              :src="formatImageUrl(row.logo)"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px;"
              :preview-src-list="[row.logo]"
            >
              <template #error>
                <div class="image-error-large">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <span v-else>无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="firstLetter" label="首字母" width="100" align="center">
          <template #default="{ row }">
            <el-tag effect="light">{{ row.firstLetter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" align="center" />
        <el-table-column prop="productCount" label="商品数量" min-width="120" align="center">
          <template #default="{ row }">
            <el-tag type="info" effect="light">{{ row.productCount || 0 }} 个商品</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="showStatus" label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.showStatus"
              :active-value="1"
              :inactive-value="0"
              @change="(val) => handleStatusChange(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180" align="center">
          <template #default="{ row }">
            <el-tooltip content="编辑品牌" placement="top">
              <el-button type="primary" link @click.stop="handleEdit(row)">
                <el-icon><EditPen /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="品牌详情" placement="top">
              <el-button type="info" link @click.stop="handleDetail(row)">
                <el-icon><InfoFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="删除品牌" placement="top">
              <el-button type="danger" link @click.stop="handleDelete(row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑品牌对话框 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="550px"
      draggable
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="brandFormRef"
        :model="brandForm"
        :rules="brandRules"
        label-width="100px"
        label-position="right"
        status-icon
      >
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="brandForm.name" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="品牌首字母" prop="firstLetter">
          <el-input 
            v-model="brandForm.firstLetter" 
            placeholder="请输入品牌首字母" 
            :maxlength="1" 
            show-word-limit
            style="width: 100px;"
            @input="handleFirstLetterInput" 
          />
          <span class="form-tip">用于快速检索，只需填写一个大写字母</span>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logo">
          <el-upload
            class="brand-upload"
            action="/api/admin/upload"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload"
          >
            <img v-if="brandForm.logo" :src="brandForm.logo" class="preview-image" />
            <el-icon v-else class="upload-icon"><Plus /></el-icon>
          </el-upload>
          <span class="form-tip">建议上传品牌LOGO，以提高品牌识别度</span>
        </el-form-item>
        <el-form-item label="品牌介绍">
          <el-input
            v-model="brandForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入品牌介绍"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="brandForm.sort" :min="0" :step="1" style="width: 150px" />
          <span class="form-tip">数值越小越靠前</span>
        </el-form-item>
        <el-form-item label="显示状态">
          <el-switch
            v-model="brandForm.showStatus"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 品牌详情抽屉 -->
    <el-drawer
      v-model="drawer.visible"
      title="品牌详情"
      direction="rtl"
      size="400px"
    >
      <template v-if="drawer.brand.id">
        <div class="brand-detail-header">
          <div class="brand-detail-logo">
            <el-image
              v-if="drawer.brand.logo"
              :src="formatImageUrl(drawer.brand.logo)"
              fit="cover"
              class="detail-logo"
              :preview-src-list="[drawer.brand.logo]"
            >
              <template #error>
                <div class="detail-logo-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="brand-detail-title">
            <h2>{{ drawer.brand.name }}</h2>
            <el-tag type="info" effect="light">ID: {{ drawer.brand.id }}</el-tag>
          </div>
        </div>

        <el-divider content-position="center">基本信息</el-divider>

        <div class="brand-detail-info">
          <div class="info-item">
            <span class="info-label">品牌名称：</span>
            <span class="info-value">{{ drawer.brand.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">品牌首字母：</span>
            <span class="info-value">{{ drawer.brand.firstLetter }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">排序：</span>
            <span class="info-value">{{ drawer.brand.sort }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">商品数量：</span>
            <span class="info-value">{{ drawer.brand.productCount || 0 }} 个商品</span>
          </div>
          <div class="info-item">
            <span class="info-label">显示状态：</span>
            <el-tag :type="drawer.brand.showStatus === 1 ? 'success' : 'info'" effect="light">
              {{ drawer.brand.showStatus === 1 ? '显示' : '隐藏' }}
            </el-tag>
          </div>
        </div>

        <el-divider content-position="center">品牌介绍</el-divider>
        
        <div class="brand-detail-description">
          <p v-if="drawer.brand.description">{{ drawer.brand.description }}</p>
          <el-empty v-else description="暂无品牌介绍" />
        </div>

        <el-divider content-position="center">操作</el-divider>

        <div class="brand-detail-actions">
          <el-button type="primary" @click="handleEdit(drawer.brand)">
            <el-icon><EditPen /></el-icon>编辑品牌
          </el-button>
          <el-button type="danger" @click="handleDelete(drawer.brand)">
            <el-icon><Delete /></el-icon>删除品牌
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { 
  Plus, Search, EditPen, Delete, Picture, InfoFilled 
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getBrandList, addBrand, updateBrand, deleteBrand } from '@/api/product';
import { getToken } from '@/utils/auth';
import { formatImageUrl } from '@/utils/imageUtils';

export default defineComponent({
  name: 'BrandManage',
  components: {
    Plus,
    Search,
    EditPen,
    Delete,
    Picture,
    InfoFilled
  },
  setup() {
    // 查询参数
    const queryParams = reactive({
      page: 1,
      size: 10,
      keyword: ''
    });

    // 品牌列表数据
    const loading = ref(false);
    const brandList = ref([]);
    const total = ref(0);

    // 对话框数据
    const dialog = reactive({
      visible: false,
      title: '',
      type: 'add' // 对话框类型：add-添加，edit-修改
    });

    // 抽屉数据
    const drawer = reactive({
      visible: false,
      brand: {}
    });

    // 表单对象
    const brandFormRef = ref(null);
    const brandForm = reactive({
      id: null,
      name: '',
      firstLetter: '',
      logo: '',
      description: '',
      sort: 0,
      showStatus: 1
    });

    // 表单校验规则
    const brandRules = {
      name: [
        { required: true, message: '请输入品牌名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      firstLetter: [
        { required: true, message: '请输入品牌首字母', trigger: 'blur' },
        { pattern: /^[A-Z]$/, message: '首字母必须为大写字母', trigger: 'blur' }
      ],
      logo: [
        { required: true, message: '请上传品牌LOGO', trigger: 'change' }
      ]
    };

    // 上传请求头
    const uploadHeaders = computed(() => {
      return {
        Authorization: `Bearer ${getToken()}`
      };
    });

    // 获取品牌列表
    const getList = async () => {
      loading.value = true;
      try {
        const { data } = await getBrandList(queryParams);
        brandList.value = data.list;
        total.value = data.total;
      } catch (error) {
        console.error('获取品牌列表失败:', error);
      } finally {
        loading.value = false;
      }
    };

    // 搜索品牌
    const handleSearch = () => {
      queryParams.page = 1;
      getList();
    };

    // 每页条数变化
    const handleSizeChange = (size) => {
      queryParams.size = size;
      getList();
    };

    // 页码变化
    const handleCurrentChange = (page) => {
      queryParams.page = page;
      getList();
    };

    // 添加品牌
    const handleAdd = () => {
      dialog.title = '添加品牌';
      dialog.type = 'add';
      
      // 重置表单
      brandForm.id = null;
      brandForm.name = '';
      brandForm.firstLetter = '';
      brandForm.logo = '';
      brandForm.description = '';
      brandForm.sort = 0;
      brandForm.showStatus = 1;
      
      dialog.visible = true;
    };

    // 编辑品牌
    const handleEdit = (row) => {
      dialog.title = '编辑品牌';
      dialog.type = 'edit';
      
      // 填充表单
      brandForm.id = row.id;
      brandForm.name = row.name;
      brandForm.firstLetter = row.firstLetter;
      brandForm.logo = row.logo;
      brandForm.description = row.description;
      brandForm.sort = row.sort;
      brandForm.showStatus = row.showStatus;
      
      dialog.visible = true;
    };

    // 查看品牌详情
    const handleDetail = (row) => {
      drawer.brand = { ...row };
      drawer.visible = true;
    };

    // 删除品牌
    const handleDelete = (row) => {
      ElMessageBox.confirm(`确定要删除品牌"${row.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteBrand(row.id);
          ElMessage.success('删除成功');
          // 关闭抽屉
          drawer.visible = false;
          // 刷新列表
          getList();
        } catch (error) {
          console.error('删除品牌失败:', error);
        }
      }).catch(() => {});
    };

    // 切换品牌状态
    const handleStatusChange = async (row, value) => {
      try {
        await updateBrand(row.id, { showStatus: value });
        ElMessage.success(`${value === 1 ? '显示' : '隐藏'}成功`);
        // 更新抽屉中的数据
        if (drawer.brand.id === row.id) {
          drawer.brand.showStatus = value;
        }
      } catch (error) {
        console.error('切换状态失败:', error);
        // 恢复原值
        row.showStatus = row.showStatus === 1 ? 0 : 1;
      }
    };

    // 首字母输入处理
    const handleFirstLetterInput = () => {
      // 转为大写
      brandForm.firstLetter = brandForm.firstLetter.toUpperCase();
    };

    // 图片上传前的校验
    const beforeLogoUpload = (file) => {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        ElMessage.error('上传LOGO只能是 JPG 或 PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        ElMessage.error('上传LOGO大小不能超过 2MB!');
        return false;
      }
      return true;
    };

    // LOGO上传成功
    const handleLogoSuccess = (response) => {
      if (response.code === 200) {
        brandForm.logo = response.data.url;
        ElMessage.success('LOGO上传成功');
      } else {
        ElMessage.error(response.message || 'LOGO上传失败');
      }
    };

    // 表单提交
    const submitForm = async () => {
      if (!brandFormRef.value) return;
      
      await brandFormRef.value.validate(async (valid) => {
        if (!valid) return;
        
        try {
          if (dialog.type === 'add') {
            await addBrand(brandForm);
            ElMessage.success('添加品牌成功');
          } else {
            await updateBrand(brandForm.id, brandForm);
            ElMessage.success('修改品牌成功');
          }
          dialog.visible = false;
          
          // 刷新品牌列表
          getList();
        } catch (error) {
          console.error('保存品牌失败:', error);
        }
      });
    };

    // 行点击事件
    const handleRowClick = (row) => {
      handleDetail(row);
    };

    // 组件挂载时执行
    onMounted(() => {
      getList();
    });

    return {
      queryParams,
      loading,
      brandList,
      total,
      dialog,
      drawer,
      brandFormRef,
      brandForm,
      brandRules,
      uploadHeaders,
      formatImageUrl,
      handleSearch,
      handleSizeChange,
      handleCurrentChange,
      handleAdd,
      handleEdit,
      handleDetail,
      handleDelete,
      handleStatusChange,
      handleFirstLetterInput,
      beforeLogoUpload,
      handleLogoSuccess,
      submitForm,
      handleRowClick
    };
  }
});
</script>

<style scoped>
.brand-container {
  margin: 16px;
}

.brand-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.brand-card:hover {
  box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.header-operations {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 250px;
}

.operation-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

.brand-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s;
}

.brand-logo:hover {
  transform: scale(1.1);
}

.image-error {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 50%;
}

.image-error-large {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 20px;
  color: #909399;
}

.brand-name {
  font-weight: 500;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.brand-upload {
  display: flex;
  flex-direction: column;
}

.brand-upload .el-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.brand-upload .el-upload:hover {
  border-color: #409eff;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-tip {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.brand-detail-header {
  display: flex;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.brand-detail-logo {
  flex: 0 0 80px;
}

.detail-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.detail-logo-placeholder {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  border-radius: 50%;
  font-size: 24px;
  color: #909399;
}

.brand-detail-title {
  flex: 1;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-detail-title h2 {
  margin: 0 0 10px 0;
  font-size: 20px;
}

.brand-detail-info {
  padding: 16px;
}

.info-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.info-label {
  flex: 0 0 100px;
  color: #909399;
}

.info-value {
  flex: 1;
  color: #303133;
  font-weight: 500;
}

.brand-detail-description {
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 0 16px;
  min-height: 120px;
}

.brand-detail-description p {
  margin: 0;
  line-height: 1.8;
  color: #606266;
}

.brand-detail-actions {
  padding: 16px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 动画效果 */
:deep(.el-table__row) {
  transition: all 0.3s;
}

:deep(.el-table__row:hover) {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.1);
}

:deep(.el-button) {
  transition: all 0.3s;
}

:deep(.el-switch) {
  transition: all 0.3s;
}

:deep(.el-switch:hover) {
  transform: scale(1.1);
}
</style> 