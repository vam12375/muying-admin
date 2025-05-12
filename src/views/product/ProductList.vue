<template>
  <div class="product-list-container" data-aos="fade-up">
    <el-card class="filter-card" shadow="hover">
      <div class="filter-container">
        <el-input
          v-model="queryParams.keyword"
          placeholder="输入商品名称或编号搜索"
          class="filter-item"
          clearable
          prefix-icon="Search"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="queryParams.categoryId"
          placeholder="商品分类"
          clearable
          class="filter-item"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.categoryId"
            :label="item.name"
            :value="item.categoryId"
          />
        </el-select>
        <el-select
          v-model="queryParams.brandId"
          placeholder="商品品牌"
          clearable
          class="filter-item"
        >
          <el-option
            v-for="item in brandOptions"
            :key="item.brandId"
            :label="item.name"
            :value="item.brandId"
          />
        </el-select>
        <el-select
          v-model="queryParams.status"
          placeholder="商品状态"
          clearable
          class="filter-item"
        >
          <el-option label="上架" value="1" />
          <el-option label="下架" value="0" />
        </el-select>
        <el-button type="primary" class="filter-button" @click="handleSearch">
          <el-icon><Search /></el-icon>搜索
        </el-button>
        <el-button class="filter-button" @click="resetQuery">
          <el-icon><Refresh /></el-icon>重置
        </el-button>
        <el-button type="info" class="filter-button" @click="getList(true)">
          <el-icon><RefreshRight /></el-icon>强制刷新
        </el-button>
      </div>
    </el-card>

    <el-card class="table-card" shadow="hover" data-aos="fade-up" data-aos-delay="100">
      <template #header>
        <div class="card-header">
          <span class="header-title">商品列表</span>
          <div class="header-operations">
            <el-button type="primary" class="operation-button" @click="handleAdd">
              <el-icon><Plus /></el-icon>添加商品
            </el-button>
            <el-button type="success" class="operation-button" @click="handleExport">
              <el-icon><Download /></el-icon>导出商品
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="productList"
        stripe
        border
        row-key="id"
        height="calc(100vh - 360px)"
        class="product-table"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="商品ID" min-width="100" align="center" />
        <el-table-column label="商品图片" min-width="100" align="center">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              fit="cover"
              class="product-thumbnail"
              :preview-src-list="[row.image]"
              style="width: 60px; height: 60px; border-radius: 4px;"
            >
              <template #error>
                <div class="image-error" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="product-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="商品分类" min-width="120" show-overflow-tooltip />
        <el-table-column prop="brandName" label="商品品牌" min-width="120" show-overflow-tooltip />
        <el-table-column prop="price" label="价格" min-width="100" align="center">
          <template #default="{ row }">
            <span class="price">¥{{ row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" min-width="100" align="center">
          <template #default="{ row }">
            <div v-if="row.stock <= row.stockWarning" class="stock-warning">
              {{ row.stock }}
            </div>
            <div v-else class="stock-normal">
              {{ row.stock }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success" effect="light">上架</el-tag>
            <el-tag v-else type="info" effect="light">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="250" align="center">
          <template #default="{ row }">
            <el-tooltip content="修改商品" placement="top">
              <el-button type="primary" link @click.stop="handleUpdate(row)">
                <el-icon><EditPen /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="库存管理" placement="top">
              <el-button type="info" link @click.stop="handleStock(row)">
                <el-icon><Files /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="商品图片" placement="top">
              <el-button type="success" link @click.stop="handleImages(row)">
                <el-icon><PictureFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="商品详情" placement="top">
              <el-button type="warning" link @click.stop="handleDetail(row)">
                <el-icon><Document /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip :content="row.status === 1 ? '下架' : '上架'" placement="top">
              <el-button type="success" link @click.stop="handleToggleStatus(row)">
                <el-icon v-if="row.status === 1"><TurnOff /></el-icon>
                <el-icon v-else><Open /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
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

    <!-- 添加/修改商品对话框 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="650px"
      draggable
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="productFormRef"
        :model="productForm"
        :rules="productRules"
        label-width="100px"
        label-position="right"
        status-icon
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryId">
          <el-select v-model="productForm.categoryId" placeholder="请选择商品分类" style="width: 100%">
            <el-option
              v-for="item in categoryOptions"
              :key="item.categoryId"
              :label="item.name"
              :value="item.categoryId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品品牌" prop="brandId">
          <el-select v-model="productForm.brandId" placeholder="请选择商品品牌" style="width: 100%">
            <el-option
              v-for="item in brandOptions"
              :key="item.brandId"
              :label="item.name"
              :value="item.brandId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="productForm.price" :min="0" :precision="2" :step="0.1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input-number v-model="productForm.stock" :min="0" :precision="0" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存预警值" prop="stockWarning">
          <el-input-number v-model="productForm.stockWarning" :min="0" :precision="0" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="商品主图" prop="image">
          <el-upload
            class="product-upload"
            action="/api/admin/upload"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
          >
            <img v-if="productForm.image" :src="productForm.image" class="preview-image" />
            <el-icon v-else class="upload-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品详情" prop="description">
          <el-input
            v-model="productForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入商品详情"
          />
        </el-form-item>
        <el-form-item label="上架状态" prop="status">
          <el-radio-group v-model="productForm.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 库存管理对话框 -->
    <el-dialog
      v-model="stockDialog.visible"
      title="库存管理"
      width="500px"
      center
      destroy-on-close
    >
      <div class="stock-info">
        <div class="stock-product-info">
          <el-image :src="stockDialog.product.image" fit="cover" class="stock-product-image" />
          <div class="stock-product-details">
            <h3>{{ stockDialog.product.name }}</h3>
            <p>当前库存: <span class="highlight">{{ stockDialog.product.stock }}</span></p>
            <p>预警值: <span class="warning">{{ stockDialog.product.stockWarning }}</span></p>
          </div>
        </div>

        <el-divider />

        <el-form label-width="100px">
          <el-form-item label="操作类型">
            <el-radio-group v-model="stockDialog.type">
              <el-radio label="add">增加库存</el-radio>
              <el-radio label="set">设置库存</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="stockDialog.type === 'add' ? '增加数量' : '设置数量'">
            <el-input-number
              v-model="stockDialog.value"
              :min="1"
              :step="1"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="stockDialog.remark" type="textarea" :rows="2" placeholder="请输入操作备注" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="stockDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitStockChange">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 商品图片管理对话框 -->
    <el-dialog
      v-model="imagesDialog.visible"
      title="商品图片管理"
      width="800px"
      destroy-on-close
    >
      <div class="images-container">
        <el-upload
          class="images-upload"
          action="/api/admin/upload"
          :headers="uploadHeaders"
          :on-success="handleProductImageSuccess"
          :before-upload="beforeImageUpload"
          multiple
          list-type="picture-card"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </div>
      <div class="images-list">
        <div v-for="(image, index) in imagesDialog.images" :key="index" class="image-item">
          <el-image :src="image.url" fit="cover" class="product-detail-image" :preview-src-list="imagesDialog.images.map(img => img.url)" />
          <div class="image-actions">
            <el-button type="danger" circle size="small" @click="removeProductImage(index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="imagesDialog.visible = false">关 闭</el-button>
          <el-button type="primary" @click="saveProductImages">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { 
  Plus, Search, Refresh, EditPen, Delete, Document, 
  PictureFilled, Files, Picture, TurnOff, Open, Download, RefreshRight
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
  getProductPage, getProduct, addProduct, updateProduct, deleteProduct, 
  toggleProductStatus, updateProductStock, getCategoryList, getBrandList 
} from '@/api/product';
import { getToken } from '@/utils/auth';

export default defineComponent({
  name: 'ProductList',
  components: {
    Plus,
    Search,
    Refresh, 
    EditPen,
    Delete,
    Document,
    PictureFilled,
    Files,
    Picture,
    TurnOff,
    Open,
    Download,
    RefreshRight
  },
  setup() {
    // 查询参数
    const queryParams = reactive({
      page: 1,
      size: 10,
      keyword: '',
      categoryId: null,
      brandId: null,
      status: null
    });

    // 列表数据
    const loading = ref(false);
    const productList = ref([]);
    const total = ref(0);
    const categoryOptions = ref([]);
    const brandOptions = ref([]);

    // 添加/修改对话框
    const dialog = reactive({
      visible: false,
      title: '',
      type: 'add' // 对话框类型：add-添加，edit-修改
    });

    // 表单对象
    const productFormRef = ref(null);
    const productForm = reactive({
      id: null,
      name: '',
      categoryId: null,
      brandId: null,
      price: 0,
      stock: 0,
      stockWarning: 10,
      image: '',
      description: '',
      status: 1
    });

    // 表单校验规则
    const productRules = {
      name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
      categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
      brandId: [{ required: true, message: '请选择商品品牌', trigger: 'change' }],
      price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
      stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
      image: [{ required: true, message: '请上传商品主图', trigger: 'change' }]
    };

    // 库存管理对话框
    const stockDialog = reactive({
      visible: false,
      product: {},
      type: 'add', // 操作类型：add-增加库存，set-设置库存
      value: 1,
      remark: ''
    });

    // 商品图片对话框
    const imagesDialog = reactive({
      visible: false,
      productId: null,
      images: []
    });

    // 上传请求头
    const uploadHeaders = computed(() => {
      return {
        Authorization: `Bearer ${getToken()}`
      };
    });

    // 获取分类列表
    const getCategoryOptions = async () => {
      try {
        const res = await getCategoryList();
        // 处理分类图标路径
        categoryOptions.value = (res.data || []).map(category => {
          if (category.icon && !category.icon.startsWith('http') && !category.icon.startsWith('/')) {
            category.icon = `http://localhost:5173/categories/${category.icon}`;
          }
          return category;
        });
      } catch (error) {
        console.error('获取分类列表失败:', error);
      }
    };

    // 获取品牌列表
    const getBrandOptions = async () => {
      try {
        const res = await getBrandList();
        console.log('获取品牌列表原始数据:', res.data);
        // 处理品牌图标路径
        brandOptions.value = (res.data || []).map(brand => {
          // 确保正确获取品牌ID
          const brandId = brand.id || brand.brandId;
          
          // 创建标准化的品牌对象
          const brandItem = {
            brandId: brandId,
            id: brandId, // 为兼容性添加id字段
            name: brand.name,
            logo: brand.logo
          };
          
          if (brandItem.logo && !brandItem.logo.startsWith('http') && !brandItem.logo.startsWith('/')) {
            brandItem.logo = `http://localhost:5173/brands/${brandItem.logo}`;
          }
          
          console.log('处理后的品牌数据:', brandItem);
          return brandItem;
        });
        console.log('最终品牌列表:', brandOptions.value);
      } catch (error) {
        console.error('获取品牌列表失败:', error);
      }
    };

    // 获取商品列表
    const getList = async (forceClear = true) => {
      loading.value = true;
      try {
        // 添加时间戳，防止浏览器缓存
        const timestamp = new Date().getTime();
        const res = await getProductPage(
          queryParams.page,
          queryParams.size,
          queryParams.keyword,
          queryParams.categoryId,
          queryParams.brandId,
          queryParams.status,
          forceClear ? timestamp : undefined
        );
        
        console.log('API Response:', res);
        
        if (!res || !res.data) {
          console.error('API返回数据格式异常:', res);
          loading.value = false;
          return;
        }
        
        // 检查返回数据结构
        let productData = res.data;
        console.log('商品数据结构:', productData);
        
        // 判断是否有list字段包装
        let productItems = Array.isArray(productData) ? productData : 
                          (productData.list ? productData.list : 
                           (productData.records ? productData.records : []));
        
        // 检查总数字段
        total.value = productData.total || 
                      (typeof productData === 'object' ? (productData.total || 0) : 0);
        
        console.log('解析后的商品列表:', productItems);
        console.log('第一个商品数据样例:', productItems.length > 0 ? productItems[0] : 'No items');
        
        // 将后端返回的字段名映射到前端期望的字段名
        productList.value = productItems.map(item => {
          // 处理图片路径，确保带有完整URL
          let imagePath = item.product_img || item.productImg || item.image || '';
          if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('/')) {
            imagePath = `http://localhost:5173/products/${imagePath}`;
          }
          
          // 尝试确定正确的字段名
          const productId = item.product_id || item.productId || item.id;
          const productName = item.product_name || item.productName || item.name;
          const price = item.price_new || item.priceNew || item.price || 0;
          const stockValue = parseInt(item.stock) || 0;
          
          // console.log(`商品[${productId}] ${productName} 原始库存数据:`, {
          //   rawStock: item.stock,
          //   parsedStock: stockValue,
          //   type: typeof item.stock
          // });
          
          // 处理商品状态，确保正确映射
          let status;
          if (typeof item.product_status === 'string') {
            status = item.product_status === '上架' ? 1 : 0;
          } else if (typeof item.status === 'string') {
            status = item.status === '上架' ? 1 : 0;
          } else {
            status = item.product_status || item.status || 0;
          }
          
          // 查找对应的分类名称 - 优先使用后端返回的值
          const categoryId = item.category_id || item.categoryId;
          let categoryName = item.category_name || item.categoryName;
          if (!categoryName) {
            const category = categoryOptions.value.find(c => c.categoryId == categoryId);
            categoryName = category ? category.name : '未分类';
          }
          
          // 查找对应的品牌名称 - 优先使用后端返回的值
          const brandId = item.brand_id || item.brandId;
          let brandName = item.brand_name || item.brandName;
          if (!brandName) {
            const brand = brandOptions.value.find(b => b.brandId == brandId || b.id == brandId);
            console.log(`查找品牌: brandId=${brandId}, 结果:`, brand);
            brandName = brand ? brand.name : '无品牌';
          }
          
          // console.log(`商品[${productId}]字段映射:`, {
          //   id: productId,
          //   name: productName,
          //   categoryId,
          //   categoryName,
          //   brandId,
          //   brandName,
          //   originalImage: item.product_img || item.productImg,
          //   mappedImage: imagePath,
          //   price: price,
          //   status: status,
          //   rawStatus: item.product_status || item.status
          // });
          
          return {
            id: productId,
            name: productName,
            image: imagePath,
            price: price,
            stock: stockValue,
            stockWarning: item.stock_warning || item.stockWarning || 10,
            status: status,
            categoryId: categoryId,
            brandId: brandId,
            categoryName: categoryName,
            brandName: brandName,
            // 保留其他原始字段
            rawData: item
          };
        });
        
        console.log('最终处理后的商品列表:', productList.value);
      } catch (error) {
        console.error('获取商品列表失败:', error);
      } finally {
        loading.value = false;
      }
    };

    // 搜索商品
    const handleSearch = () => {
      queryParams.page = 1;
      getList();
    };

    // 重置查询条件
    const resetQuery = () => {
      queryParams.keyword = '';
      queryParams.categoryId = null;
      queryParams.brandId = null;
      queryParams.status = null;
      handleSearch();
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

    // 添加商品按钮点击
    const handleAdd = () => {
      dialog.title = '添加商品';
      dialog.type = 'add';
      Object.keys(productForm).forEach(key => {
        if (key !== 'status' && key !== 'stockWarning') {
          productForm[key] = key === 'price' || key === 'stock' ? 0 : null;
        }
      });
      productForm.status = 1;
      productForm.stockWarning = 10;
      dialog.visible = true;
    };

    // 修改商品按钮点击
    const handleUpdate = async (row) => {
      dialog.title = '修改商品';
      dialog.type = 'edit';
      
      // 先重置表单
      Object.keys(productForm).forEach(key => {
        if (key !== 'status' && key !== 'stockWarning') {
          productForm[key] = key === 'price' || key === 'stock' ? 0 : null;
        }
      });
      productForm.status = 1;
      productForm.stockWarning = 10;
      
      // 获取最新商品信息
      try {
        console.log('获取商品详情，ID:', row.id);
        // 添加时间戳参数，防止缓存
        const timestamp = new Date().getTime();
        const res = await getProduct(row.id, timestamp);
        console.log('获取商品详情响应:', res);
        
        if (res.data) {
          // 处理后端返回的数据，确保正确映射到表单字段
          const productData = res.data;
          
          console.log('商品详情原始数据:', productData);
          
          // 处理主要字段
          productForm.id = productData.id || productData.product_id || row.id;
          productForm.name = productData.name || productData.product_name || row.name;
          productForm.price = productData.price || productData.price_new || row.price || 0;
          productForm.stock = parseInt(productData.stock) || row.stock || 0;
          productForm.stockWarning = parseInt(productData.stock_warning) || productData.stockWarning || row.stockWarning || 10;
          productForm.status = typeof productData.status !== 'undefined' ? productData.status : (row.status || 1);
          productForm.description = productData.description || productData.product_description || '';
          
          // 处理图片路径
          let imagePath = productData.image || productData.product_img || row.image || '';
          if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('/')) {
            imagePath = `http://localhost:5173/products/${imagePath}`;
          }
          productForm.image = imagePath;
          
          // 处理分类ID
          const categoryId = productData.category_id || productData.categoryId;
          if (categoryId) {
            productForm.categoryId = parseInt(categoryId);
          }
          
          // 处理品牌ID
          const brandId = productData.brand_id || productData.brandId;
          if (brandId) {
            productForm.brandId = parseInt(brandId);
          }
          
          console.log('处理后的商品表单数据:', productForm);
        } else {
          // 如果后端没有返回详情数据，则使用列表中的数据
          Object.assign(productForm, {
            id: row.id,
            name: row.name,
            categoryId: row.categoryId,
            brandId: row.brandId,
            price: row.price,
            stock: row.stock,
            stockWarning: row.stockWarning || 10,
            image: row.image,
            description: row.description || '',
            status: row.status
          });
          console.log('使用列表数据填充表单:', productForm);
        }
      } catch (error) {
        console.error('获取商品详情失败:', error);
        // 失败时也使用列表数据
        Object.assign(productForm, {
          id: row.id,
          name: row.name,
          categoryId: row.categoryId,
          brandId: row.brandId,
          price: row.price,
          stock: row.stock,
          stockWarning: row.stockWarning || 10,
          image: row.image,
          description: row.description || '',
          status: row.status
        });
        ElMessage.error('获取商品详情失败，将使用列表数据');
        return;
      }
      
      dialog.visible = true;
    };

    // 图片上传前的校验
    const beforeImageUpload = (file) => {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        ElMessage.error('上传图片只能是 JPG 或 PNG 格式!');
        return false;
      }
      if (!isLt2M) {
        ElMessage.error('上传图片大小不能超过 2MB!');
        return false;
      }
      return true;
    };

    // 主图上传成功
    const handleImageSuccess = (response) => {
      if (response.code === 200) {
        let imageUrl = response.data.url;
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
          imageUrl = `http://localhost:5173/products/${imageUrl}`;
        }
        productForm.image = imageUrl;
        ElMessage.success('图片上传成功');
      } else {
        ElMessage.error(response.message || '图片上传失败');
      }
    };

    // 表单提交
    const submitForm = async () => {
      if (!productFormRef.value) return;
      
      await productFormRef.value.validate(async (valid) => {
        if (!valid) return;
        
        try {
          if (dialog.type === 'add') {
            await addProduct(productForm);
            ElMessage.success('添加商品成功');
          } else {
            await updateProduct(productForm.id, productForm);
            ElMessage.success('修改商品成功');
          }
          dialog.visible = false;
          getList();
        } catch (error) {
          console.error('保存商品失败:', error);
        }
      });
    };

    // 删除商品
    const handleDelete = (row) => {
      ElMessageBox.confirm(`确定要删除商品【${row.name}】吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteProduct(row.id);
          ElMessage.success('删除成功');
          getList();
        } catch (error) {
          console.error('删除商品失败:', error);
        }
      }).catch(() => {});
    };

    // 上下架状态切换
    const handleToggleStatus = (row) => {
      const statusText = row.status === 1 ? '下架' : '上架';
      const newStatus = row.status === 1 ? 0 : 1;
      
      ElMessageBox.confirm(`确定要${statusText}商品【${row.name}】吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await toggleProductStatus(row.id, newStatus);
          ElMessage.success(`${statusText}成功`);
          getList();
        } catch (error) {
          console.error(`${statusText}失败:`, error);
        }
      }).catch(() => {});
    };

    // 库存管理
    const handleStock = (row) => {
      stockDialog.product = { ...row };
      stockDialog.type = 'add';
      stockDialog.value = 1;
      stockDialog.remark = '';
      stockDialog.visible = true;
    };

    // 提交库存变更
    const submitStockChange = async () => {
      try {
        await updateProductStock(
          stockDialog.product.id,
          stockDialog.value,
          stockDialog.type
        );
        ElMessage.success('库存更新成功');
        stockDialog.visible = false;
        // 强制刷新列表，获取最新库存数据
        await getList();
      } catch (error) {
        console.error('更新库存失败:', error);
      }
    };

    // 商品图片管理
    const handleImages = async (row) => {
      imagesDialog.productId = row.id;
      imagesDialog.images = row.images || [];
      imagesDialog.visible = true;
    };

    // 商品图片上传成功
    const handleProductImageSuccess = (response) => {
      if (response.code === 200) {
        let imageUrl = response.data.url;
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
          imageUrl = `http://localhost:5173/products/${imageUrl}`;
        }
        imagesDialog.images.push({
          url: imageUrl,
          sort: imagesDialog.images.length + 1
        });
        ElMessage.success('图片上传成功');
      } else {
        ElMessage.error(response.message || '图片上传失败');
      }
    };

    // 移除商品图片
    const removeProductImage = (index) => {
      imagesDialog.images.splice(index, 1);
    };

    // 保存商品图片
    const saveProductImages = async () => {
      try {
        await updateProduct(imagesDialog.productId, {
          images: imagesDialog.images
        });
        ElMessage.success('商品图片保存成功');
        imagesDialog.visible = false;
        getList();
      } catch (error) {
        console.error('保存商品图片失败:', error);
      }
    };

    // 导出商品数据
    const handleExport = () => {
      ElMessage.success('商品数据导出功能待实现');
    };

    // 查看商品详情
    const handleDetail = (row) => {
      ElMessage.info('商品详情功能待实现');
    };

    // 行点击事件
    const handleRowClick = (row) => {
      handleDetail(row);
    };

    // 组件挂载时执行
    onMounted(() => {
      getCategoryOptions();
      getBrandOptions();
      getList();
    });

    return {
      queryParams,
      loading,
      productList,
      total,
      categoryOptions,
      brandOptions,
      dialog,
      productFormRef,
      productForm,
      productRules,
      stockDialog,
      imagesDialog,
      uploadHeaders,
      handleSearch,
      resetQuery,
      handleSizeChange,
      handleCurrentChange,
      handleAdd,
      handleUpdate,
      beforeImageUpload,
      handleImageSuccess,
      submitForm,
      handleDelete,
      handleToggleStatus,
      handleStock,
      submitStockChange,
      handleImages,
      handleProductImageSuccess,
      removeProductImage,
      saveProductImages,
      handleExport,
      handleDetail,
      handleRowClick
    };
  }
});
</script>

<style scoped>
.product-list-container {
  margin: 16px;
}

.filter-card {
  margin-bottom: 16px;
  transition: all 0.3s;
}

.filter-card:hover {
  box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.2);
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.filter-item {
  width: 220px;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

.table-card {
  transition: all 0.3s;
}

.table-card:hover {
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
  gap: 12px;
}

.operation-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

.product-table {
  margin-top: 8px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-thumbnail {
  border-radius: 4px;
  object-fit: cover;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.product-thumbnail:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.product-image:hover {
  transform: scale(1.05);
}

.image-error {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.product-name {
  font-weight: 500;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.stock-warning {
  color: #e6a23c;
  font-weight: bold;
}

.stock-normal {
  color: #409eff;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.product-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.product-upload:hover {
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

.stock-info {
  padding: 16px;
}

.stock-product-info {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.stock-product-image {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  object-fit: cover;
}

.stock-product-details {
  flex: 1;
}

.stock-product-details h3 {
  margin-top: 0;
  margin-bottom: 12px;
}

.highlight {
  color: #409eff;
  font-weight: bold;
}

.warning {
  color: #e6a23c;
  font-weight: bold;
}

.images-container {
  margin-bottom: 16px;
}

.images-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.image-item {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 6px;
  overflow: hidden;
}

.product-detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-item:hover .image-actions {
  opacity: 1;
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

:deep(.el-table__cell) {
  transition: all 0.3s;
}

.btn-hover-effect {
  transition: all 0.3s;
}

.btn-hover-effect:hover {
  transform: scale(1.1);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 列表动画 */
:deep(.fade-transform-leave-active),
:deep(.fade-transform-enter-active) {
  transition: all 0.5s;
}

:deep(.fade-transform-enter-from) {
  opacity: 0;
  transform: translateX(-30px);
}

:deep(.fade-transform-leave-to) {
  opacity: 0;
  transform: translateX(30px);
}
</style> 