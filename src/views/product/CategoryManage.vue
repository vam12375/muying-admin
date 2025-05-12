<template>
  <div class="category-container" data-aos="fade-up">
    <el-card class="category-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="header-title">分类管理</span>
          <div class="header-operations">
            <el-button type="primary" class="operation-button" @click="handleAddRoot">
              <el-icon><Plus /></el-icon>添加一级分类
            </el-button>
          </div>
        </div>
      </template>

      <div class="category-content">
        <div class="tree-container">
          <el-tree
            ref="treeRef"
            :data="categoryTree"
            :props="defaultProps"
            node-key="id"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <div class="node-content">
                  <el-icon v-if="data.level === 1"><Folder /></el-icon>
                  <el-icon v-else><Grid /></el-icon>
                  <span class="category-label">{{ data.name }}</span>
                  <el-tag size="small" effect="plain" type="info" class="category-count" round>
                    {{ data.productCount || 0 }} 个商品
                  </el-tag>
                  <el-tag 
                    size="small" 
                    :type="data.status === 1 ? 'success' : 'danger'" 
                    effect="dark"
                    class="category-status"
                  >
                    {{ data.status === 1 ? '正常' : '禁用' }}
                  </el-tag>
                </div>
                <div class="node-actions">
                  <el-tooltip content="添加子分类" placement="top" v-if="data.level < 3">
                    <el-button type="primary" link @click.stop="handleAdd(data)">
                      <el-icon><Plus /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="编辑分类" placement="top">
                    <el-button type="primary" link @click.stop="handleEdit(data)">
                      <el-icon><EditPen /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip :content="data.status === 1 ? '禁用分类' : '启用分类'" placement="top">
                    <el-button 
                      :type="data.status === 1 ? 'danger' : 'success'" 
                      link 
                      @click.stop="handleToggleStatus(data)"
                    >
                      <el-icon><component :is="data.status === 1 ? 'Hide' : 'View'" /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="删除分类" placement="top">
                    <el-button type="danger" link @click.stop="handleDelete(node, data)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-tree>
        </div>

        <div class="detail-container" v-if="selectedCategory.id">
          <div class="detail-header">
            <h3>{{ selectedCategory.name }}</h3>
            <el-tag v-if="selectedCategory.level" :type="getCategoryLevelTag(selectedCategory.level)">
              {{ getCategoryLevelText(selectedCategory.level) }}
            </el-tag>
            <el-tag 
              :type="selectedCategory.status === 1 ? 'success' : 'danger'" 
              effect="dark"
              class="ml-10"
            >
              {{ selectedCategory.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </div>

          <el-descriptions :column="1" border>
            <el-descriptions-item label="分类ID">{{ selectedCategory.id }}</el-descriptions-item>
            <el-descriptions-item label="分类名称">{{ selectedCategory.name }}</el-descriptions-item>
            <el-descriptions-item label="分类层级">{{ getCategoryLevelText(selectedCategory.level) }}</el-descriptions-item>
            <el-descriptions-item label="上级分类" v-if="selectedCategory.parentId">
              {{ getCategoryNameById(selectedCategory.parentId) }}
            </el-descriptions-item>
            <el-descriptions-item label="商品数量">{{ selectedCategory.productCount || 0 }}</el-descriptions-item>
            <el-descriptions-item label="排序">{{ selectedCategory.sort }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-switch
                v-model="selectedCategory.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange"
                active-text="正常"
                inactive-text="禁用"
                :active-color="'#13ce66'"
                :inactive-color="'#ff4949'"
              />
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ selectedCategory.createTime }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ selectedCategory.updateTime }}</el-descriptions-item>
            <el-descriptions-item label="分类图标">
              <el-image 
                v-if="selectedCategory.icon" 
                :src="selectedCategory.icon" 
                class="category-icon" 
                :preview-src-list="[selectedCategory.icon]"
              />
              <span v-else>暂无图标</span>
            </el-descriptions-item>
            <el-descriptions-item label="操作">
              <el-button size="small" type="primary" @click="handleEdit(selectedCategory)">
                <el-icon><EditPen /></el-icon>编辑
              </el-button>
              <el-button 
                size="small" 
                type="success" 
                @click="handleAdd(selectedCategory)"
                v-if="selectedCategory.level < 3"
              >
                <el-icon><Plus /></el-icon>添加子分类
              </el-button>
              <el-button 
                size="small" 
                :type="selectedCategory.status === 1 ? 'warning' : 'success'"
                @click="handleToggleStatus(selectedCategory)"
              >
                <el-icon><component :is="selectedCategory.status === 1 ? 'Hide' : 'View'" /></el-icon>
                {{ selectedCategory.status === 1 ? '禁用' : '启用' }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(null, selectedCategory)">
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="empty-detail" v-else>
          <el-empty description="请选择一个分类查看详情" />
        </div>
      </div>
    </el-card>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="100px"
        label-position="right"
        status-icon
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="上级分类" prop="parentId">
          <el-cascader
            v-model="categoryForm.parentId"
            :options="cascaderOptions"
            :props="cascaderProps"
            clearable
            placeholder="请选择上级分类"
            style="width: 100%"
            :disabled="dialog.type === 'edit' && categoryForm.level === 1"
          />
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <el-upload
            class="category-upload"
            action="/api/admin/upload"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleIconSuccess"
            :before-upload="beforeIconUpload"
          >
            <img v-if="categoryForm.icon" :src="categoryForm.icon" class="preview-image" />
            <el-icon v-else class="upload-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="categoryForm.sort" :min="0" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="categoryForm.status"
            :active-value="1"
            :inactive-value="0"
            active-text="正常"
            inactive-text="禁用"
            :active-color="'#13ce66'"
            :inactive-color="'#ff4949'"
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
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { Plus, EditPen, Delete, Folder, Grid, Hide, View } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCategoryList, addCategory, updateCategory, deleteCategory, updateCategoryStatus } from '@/api/product';
import { getToken } from '@/utils/auth';

export default defineComponent({
  name: 'CategoryManage',
  components: {
    Plus,
    EditPen,
    Delete,
    Folder,
    Grid,
    Hide,
    View
  },
  setup() {
    // 分类树数据
    const categoryTree = ref([]);
    const allCategories = ref([]);
    const treeRef = ref(null);
    const selectedCategory = ref({});

    // 树形属性配置
    const defaultProps = {
      children: 'children',
      label: 'name'
    };

    // 级联选择器属性配置
    const cascaderProps = {
      value: 'id',
      label: 'name',
      children: 'children',
      checkStrictly: true,
      emitPath: false
    };

    // 对话框数据
    const dialog = reactive({
      visible: false,
      title: '',
      type: 'add' // 对话框类型：add-添加，edit-修改
    });

    // 表单对象
    const categoryFormRef = ref(null);
    const categoryForm = reactive({
      id: null,
      name: '',
      parentId: null,
      level: 1,
      icon: '',
      sort: 0,
      status: 1
    });

    // 表单校验规则
    const categoryRules = {
      name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
    };

    // 获取级联选择器数据
    const cascaderOptions = computed(() => {
      // 过滤出一级和二级分类
      const options = categoryTree.value.map(item => {
        const { id, name, children } = item;
        const filterChildren = children ? children.map(child => ({
          id: child.id,
          name: child.name,
          disabled: child.level >= 2 // 最多支持三级分类，二级分类下只能添加一层子分类
        })) : [];
        
        return {
          id,
          name,
          children: filterChildren
        };
      });
      
      return options;
    });

    // 上传请求头
    const uploadHeaders = computed(() => {
      return {
        Authorization: `Bearer ${getToken()}`
      };
    });

    // 获取分类列表
    const getCategoryData = async () => {
      try {
        const res = await getCategoryList();
        console.log('分类数据返回:', res);
        if (res.data) {
          console.log('分类数据内容:', res.data);
          
          // 添加数据映射层，将后端字段名映射为前端使用的字段名
          const mappedCategories = res.data.map(item => {
            return {
              id: item.categoryId,                // 将 categoryId 映射为 id
              parentId: item.parentId,            // parentId 字段名一致，不需要映射
              name: item.name,                    // name 字段名一致，不需要映射
              icon: item.icon,                    // icon 字段名一致，不需要映射
              sort: item.sortOrder,               // 将 sortOrder 映射为 sort
              level: item.parentId === 0 ? 1 : 
                     (item.parentId && item.parentId > 0 ? 2 : 1), // 根据 parentId 推断 level
              status: item.status,                // status 字段名一致，不需要映射
              createTime: item.createTime,        // createTime 字段名一致，不需要映射
              updateTime: item.updateTime,        // updateTime 字段名一致，不需要映射
              productCount: item.productCount || 0, // productCount 字段名一致，不需要映射
              children: []                        // 初始化空的 children 数组
            };
          });
          
          console.log('映射后的分类数据:', mappedCategories);
          
          // 构建树形结构
          allCategories.value = mappedCategories;
          categoryTree.value = buildCategoryTree(mappedCategories);
          console.log('构建的分类树:', categoryTree.value);
        }
      } catch (error) {
        console.error('获取分类列表失败:', error);
      }
    };

    // 构建分类树
    const buildCategoryTree = (categories) => {
      console.log('构建树的原始数据:', categories);
      const rootCategories = categories.filter(item => item.parentId === 0);
      console.log('一级分类:', rootCategories);
      const childCategories = categories.filter(item => item.parentId !== 0);
      console.log('子分类:', childCategories);
      
      // 递归构建树
      const buildTree = (roots) => {
        return roots.map(root => {
          console.log('处理分类:', root);
          const children = childCategories.filter(child => child.parentId === root.id);
          console.log(`${root.name}的子分类:`, children);
          return {
            ...root,
            children: children.length > 0 ? buildTree(children) : []
          };
        });
      };
      
      return buildTree(rootCategories);
    };

    // 节点点击
    const handleNodeClick = (data) => {
      selectedCategory.value = data;
    };

    // 添加一级分类
    const handleAddRoot = () => {
      dialog.title = '添加一级分类';
      dialog.type = 'add';
      // 重置表单
      Object.assign(categoryForm, {
        id: null,
        name: '',
        parentId: 0,  // 一级分类的parentId为0
        level: 1,
        icon: '',
        sort: 0,
        status: 1
      });
      dialog.visible = true;
    };

    // 添加子分类
    const handleAdd = (data) => {
      if (data.level >= 3) {
        ElMessage.warning('最多支持三级分类');
        return;
      }
      
      dialog.title = `添加${data.name}的子分类`;
      dialog.type = 'add';
      // 重置表单
      Object.assign(categoryForm, {
        id: null,
        name: '',
        parentId: data.id,
        level: data.level + 1,
        icon: '',
        sort: 0,
        status: 1
      });
      dialog.visible = true;
    };

    // 编辑分类
    const handleEdit = (data) => {
      dialog.title = '编辑分类';
      dialog.type = 'edit';
      // 填充表单
      Object.assign(categoryForm, {
        id: data.id,
        name: data.name,
        parentId: data.parentId,
        level: data.level,
        icon: data.icon,
        sort: data.sort,
        status: data.status
      });
      dialog.visible = true;
    };

    // 切换分类状态
    const handleToggleStatus = async (data) => {
      try {
        const newStatus = data.status === 1 ? 0 : 1;
        const statusText = newStatus === 1 ? '启用' : '禁用';
        
        // 确认操作
        await ElMessageBox.confirm(`确定要${statusText}分类"${data.name}"吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        
        // 调用接口更新状态
        await updateCategoryStatus(data.id, newStatus);
        
        // 更新本地数据
        data.status = newStatus;
        
        // 如果是当前选中的分类，也更新选中分类的状态
        if (selectedCategory.value.id === data.id) {
          selectedCategory.value.status = newStatus;
        }
        
        ElMessage.success(`${statusText}成功`);
      } catch (error) {
        if (error !== 'cancel') {
          console.error('更新分类状态失败:', error);
          ElMessage.error(`操作失败: ${error.message || '未知错误'}`);
        }
      }
    };
    
    // 状态切换（详情页开关）
    const handleStatusChange = async (value) => {
      try {
        const statusText = value === 1 ? '启用' : '禁用';
        
        // 调用接口更新状态
        await updateCategoryStatus(selectedCategory.value.id, value);
        
        // 更新树中对应节点的状态
        const updateTreeNodeStatus = (nodes) => {
          for (const node of nodes) {
            if (node.id === selectedCategory.value.id) {
              node.status = value;
              return true;
            }
            if (node.children && node.children.length > 0) {
              if (updateTreeNodeStatus(node.children)) {
                return true;
              }
            }
          }
          return false;
        };
        
        updateTreeNodeStatus(categoryTree.value);
        
        ElMessage.success(`${statusText}成功`);
      } catch (error) {
        console.error('更新分类状态失败:', error);
        ElMessage.error(`操作失败: ${error.message || '未知错误'}`);
        // 恢复状态
        selectedCategory.value.status = selectedCategory.value.status === 1 ? 0 : 1;
      }
    };

    // 删除分类
    const handleDelete = (node, data) => {
      // 判断是否有子分类
      if (data.children && data.children.length > 0) {
        ElMessage.warning('该分类下有子分类，无法直接删除');
        return;
      }
      
      // 确认删除
      ElMessageBox.confirm(`确定要删除分类"${data.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteCategory(data.id);
          ElMessage.success('删除成功');
          
          // 更新树
          await getCategoryData();
          
          // 清空选中状态
          if (selectedCategory.value.id === data.id) {
            selectedCategory.value = {};
          }
        } catch (error) {
          console.error('删除分类失败:', error);
        }
      }).catch(() => {});
    };

    // 图标上传前的校验
    const beforeIconUpload = (file) => {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        ElMessage.error('上传图标只能是 JPG 或 PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        ElMessage.error('上传图标大小不能超过 2MB!');
        return false;
      }
      return true;
    };

    // 图标上传成功
    const handleIconSuccess = (response) => {
      if (response.code === 200) {
        categoryForm.icon = response.data.url;
        ElMessage.success('图标上传成功');
      } else {
        ElMessage.error(response.message || '图标上传失败');
      }
    };

    // 提交表单
    const submitForm = async () => {
      if (!categoryFormRef.value) return;
      
      await categoryFormRef.value.validate(async (valid) => {
        if (!valid) return;
        
        try {
          // 将前端字段名映射为后端字段名
          const submitData = {
            categoryId: categoryForm.id,
            parentId: categoryForm.parentId,
            name: categoryForm.name,
            icon: categoryForm.icon,
            sortOrder: categoryForm.sort,
            status: categoryForm.status
          };
          
          console.log('提交的表单数据:', submitData);
          
          if (dialog.type === 'add') {
            await addCategory(submitData);
            ElMessage.success('添加分类成功');
          } else {
            await updateCategory(submitData.categoryId, submitData);
            ElMessage.success('修改分类成功');
          }
          dialog.visible = false;
          
          // 刷新分类数据
          await getCategoryData();
        } catch (error) {
          console.error('保存分类失败:', error);
        }
      });
    };

    // 获取分类级别文本
    const getCategoryLevelText = (level) => {
      const levelMap = {
        1: '一级分类',
        2: '二级分类',
        3: '三级分类'
      };
      return levelMap[level] || '未知级别';
    };

    // 获取分类级别标签类型
    const getCategoryLevelTag = (level) => {
      const typeMap = {
        1: 'danger',
        2: 'warning',
        3: 'info'
      };
      return typeMap[level] || '';
    };

    // 根据ID获取分类名称
    const getCategoryNameById = (id) => {
      const category = allCategories.value.find(item => item.id === id);
      return category ? category.name : '';
    };

    // 组件挂载时获取数据
    onMounted(() => {
      getCategoryData();
    });

    return {
      categoryTree,
      defaultProps,
      cascaderProps,
      cascaderOptions,
      treeRef,
      selectedCategory,
      dialog,
      categoryFormRef,
      categoryForm,
      categoryRules,
      uploadHeaders,
      handleNodeClick,
      handleAddRoot,
      handleAdd,
      handleEdit,
      handleToggleStatus,
      handleStatusChange,
      handleDelete,
      beforeIconUpload,
      handleIconSuccess,
      submitForm,
      getCategoryLevelText,
      getCategoryLevelTag,
      getCategoryNameById
    };
  }
});
</script>

<style scoped>
.category-container {
  margin: 16px;
}

.category-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.category-card:hover {
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

.operation-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

.category-content {
  display: flex;
  margin-top: 16px;
  min-height: calc(100vh - 250px);
}

.tree-container {
  flex: 0 0 400px;
  border-right: 1px solid #e6e6e6;
  padding-right: 16px;
  overflow: auto;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-label {
  font-size: 14px;
}

.category-count {
  margin-left: 8px;
}

.category-status {
  margin-left: 8px;
}

.node-actions {
  margin-left: 24px;
  display: none;
}

.custom-tree-node:hover .node-actions {
  display: flex;
}

.detail-container {
  flex: 1;
  padding-left: 24px;
  animation: fadeIn 0.5s;
}

.empty-detail {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 24px;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #e6e6e6;
}

.detail-header h3 {
  margin: 0;
  margin-right: 16px;
  font-size: 20px;
}

.ml-10 {
  margin-left: 10px;
}

.category-icon {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.category-upload {
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

.category-upload:hover {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 动画效果 */
:deep(.el-tree-node__content) {
  transition: all 0.3s;
}

:deep(.el-tree-node__content:hover) {
  background-color: #f0f9ff;
  transform: translateX(4px);
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #ecf5ff;
  color: #409eff;
  transform: translateX(4px);
}

:deep(.el-button) {
  transition: all 0.3s;
}

/* 悬浮动画 */
.btn-hover-effect {
  transition: all 0.3s;
}

.btn-hover-effect:hover {
  transform: scale(1.1);
}
</style> 