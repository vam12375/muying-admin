import { ref, reactive, onMounted } from 'vue';
import {
  getRedisInfo,
  getRedisCacheKeys,
  getRedisCacheValue,
  deleteRedisCache,
  clearAllRedisCache,
  refreshRedisStats
} from '@/api/system';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Connection,
  Refresh,
  Key,
  Search,
  Delete,
  View,
  InfoFilled,
  DataAnalysis,
  Cpu,
  Timer,
  Operation,
  Monitor
} from '@element-plus/icons-vue';

export default {
  name: 'RedisMonitor',
  components: {
    Connection,
    Refresh,
    Key,
    Search,
    Delete,
    View,
    InfoFilled,
    DataAnalysis,
    Cpu,
    Timer,
    Operation,
    Monitor
  },
  setup() {
    // 加载状态
    const loading = reactive({
      info: false,
      keys: false
    });

    // Redis信息
    const redisInfo = ref({});
    
    // 缓存键
    const cacheKeys = ref([]);
    
    // 查询模式
    const keyPattern = ref('');
    
    // 分页信息
    const pagination = reactive({
      page: 1,
      size: 10,
      total: 0
    });
    
    // 键详情对话框
    const keyDetailDialog = reactive({
      visible: false,
      loading: false,
      key: '',
      type: '',
      ttl: -1,
      size: 0,
      value: null
    });
    
    // JSON查看模式
    const jsonViewMode = ref('tree');

    // 状态卡片数据
    const statsCards = reactive([
      {
        label: '键总数',
        value: 0,
        icon: 'Key',
        type: 'primary'
      },
      {
        label: '内存使用',
        value: '0 MB',
        icon: 'DataAnalysis',
        type: 'success'
      },
      {
        label: '运行时间',
        value: '0天',
        icon: 'Timer',
        type: 'warning'
      },
      {
        label: '命中率',
        value: '0%',
        icon: 'Operation',
        type: 'info'
      }
    ]);

    // 获取Redis信息
    const fetchRedisInfo = async () => {
      loading.info = true;
      try {
        const res = await getRedisInfo();
        if (res.code === 200) {
          redisInfo.value = res.data;
          
          // 更新统计卡片
          updateStatsCards(res.data);
        } else {
          ElMessage.error(res.message || 'Redis信息获取失败');
        }
      } catch (error) {
        console.error('获取Redis信息失败:', error);
        ElMessage.error('获取Redis信息失败');
      } finally {
        loading.info = false;
      }
    };

    // 更新统计卡片数据
    const updateStatsCards = (info) => {
      if (!info) return;
      
      // 更新键总数
      if (info.keyspaceStats && info.keyspaceStats.db0) {
        statsCards[0].value = info.keyspaceStats.db0.keys || 0;
      } else {
        statsCards[0].value = info.totalKeys || 0;
      }

      // 更新内存使用
      statsCards[1].value = info.usedMemoryHuman || '0 MB';

      // 更新运行时间
      statsCards[2].value = formatUptimeDays(info.uptimeInDays);

      // 更新命中率
      if (info.keyspaceHits !== undefined && info.keyspaceMisses !== undefined) {
        const hits = parseInt(info.keyspaceHits);
        const misses = parseInt(info.keyspaceMisses);
        
        if (hits + misses > 0) {
          const hitRate = (hits / (hits + misses) * 100).toFixed(2);
          statsCards[3].value = `${hitRate}%`;
        } else {
          statsCards[3].value = '0%';
        }
      }
    };

    // 格式化运行天数
    const formatUptimeDays = (days) => {
      if (days === undefined) return '未知';
      
      const dayNum = parseInt(days) || 0;
      return `${dayNum}天`;
    };

    // 获取Redis缓存键列表
    const fetchCacheKeys = async () => {
      loading.keys = true;
      try {
        const params = {
          pattern: keyPattern.value || '*',
          page: pagination.page,
          size: pagination.size
        };
        
        const res = await getRedisCacheKeys(params);
        if (res.code === 200) {
          cacheKeys.value = res.data.items || [];
          pagination.total = res.data.total || 0;
        } else {
          ElMessage.error(res.message || '获取缓存键列表失败');
        }
      } catch (error) {
        console.error('获取缓存键列表失败:', error);
        ElMessage.error('获取缓存键列表失败');
      } finally {
        loading.keys = false;
      }
    };

    // 搜索缓存键
    const searchKeys = (pattern) => {
      if (pattern !== undefined) {
        keyPattern.value = pattern;
      }
      pagination.page = 1;
      fetchCacheKeys();
    };

    // 处理每页数量变化
    const handleSizeChange = (size) => {
      pagination.size = size;
      pagination.page = 1; // 重置到第一页
      fetchCacheKeys();
    };

    // 处理页码变化
    const handlePageChange = (page) => {
      pagination.page = page;
      fetchCacheKeys();
    };

    // 获取缓存键类型对应的标签类型
    const getTypeTagType = (type) => {
      const typeMap = {
        string: 'primary',
        list: 'success',
        hash: 'warning',
        set: 'info',
        zset: 'danger'
      };
      return typeMap[type] || 'info';
    };

    // 格式化缓存键类型
    const formatKeyType = (type) => {
      const typeMap = {
        string: '字符串',
        list: '列表',
        hash: '哈希',
        set: '集合',
        zset: '有序集合'
      };
      return typeMap[type] || type;
    };

    // 格式化过期时间
    const formatTTL = (ttl) => {
      if (ttl === -1) {
        return '永不过期';
      } else if (ttl === -2) {
        return '已过期';
      } else if (ttl < 60) {
        return `${ttl}秒`;
      } else if (ttl < 3600) {
        return `${Math.floor(ttl / 60)}分钟`;
      } else if (ttl < 86400) {
        return `${Math.floor(ttl / 3600)}小时`;
      } else {
        return `${Math.floor(ttl / 86400)}天`;
      }
    };

    // 格式化大小
    const formatSize = (size) => {
      if (size < 1024) {
        return `${size} B`;
      } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} KB`;
      } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
      } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
      }
    };

    // 查看键详情
    const viewKeyDetails = async (row) => {
      keyDetailDialog.loading = true;
      keyDetailDialog.key = row.key;
      keyDetailDialog.type = row.type;
      keyDetailDialog.ttl = row.ttl;
      keyDetailDialog.size = row.size;
      keyDetailDialog.visible = true;

      try {
        const res = await getRedisCacheValue(row.key);
        if (res.code === 200) {
          keyDetailDialog.value = res.data.value;
        } else {
          ElMessage.error(res.message || '获取缓存值失败');
        }
      } catch (error) {
        console.error('获取缓存值失败:', error);
        ElMessage.error('获取缓存值失败');
      } finally {
        keyDetailDialog.loading = false;
      }
    };

    // 处理删除键
    const handleDeleteKey = async (key) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除缓存键 "${key}" 吗？`,
          '删除缓存',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );

        const res = await deleteRedisCache(key);
        if (res.code === 200) {
          ElMessage.success('缓存键删除成功');
          // 如果是从详情对话框删除，则关闭对话框
          if (keyDetailDialog.visible && keyDetailDialog.key === key) {
            keyDetailDialog.visible = false;
          }
          // 刷新键列表和Redis信息
          fetchCacheKeys();
          fetchRedisInfo();
        } else {
          ElMessage.error(res.message || '删除缓存键失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除缓存键失败:', error);
          ElMessage.error('删除缓存键失败');
        }
      }
    };

    // 处理清空所有缓存
    const handleClearAll = async () => {
      try {
        await ElMessageBox.confirm(
          '确定要清空所有缓存吗？此操作不可恢复！',
          '清空缓存',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'danger'
          }
        );

        const res = await clearAllRedisCache();
        if (res.code === 200) {
          ElMessage.success('所有缓存已清空');
          // 刷新键列表和Redis信息
          fetchCacheKeys();
          fetchRedisInfo();
        } else {
          ElMessage.error(res.message || '清空缓存失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('清空缓存失败:', error);
          ElMessage.error('清空缓存失败');
        }
      }
    };

    // 刷新Redis信息
    const refreshRedisInfo = async () => {
      try {
        const res = await refreshRedisStats();
        if (res.code === 200) {
          redisInfo.value = res.data;
          updateStatsCards(res.data);
          ElMessage.success('Redis信息已刷新');
        } else {
          ElMessage.error(res.message || '刷新Redis信息失败');
        }
      } catch (error) {
        console.error('刷新Redis信息失败:', error);
        ElMessage.error('刷新Redis信息失败');
      }
    };

    // 处理表格行点击
    const handleRowClick = (row) => {
      viewKeyDetails(row);
    };

    // 判断字符串是否为JSON格式
    const isJsonString = (str) => {
      if (typeof str !== 'string') {
        return false;
      }
      try {
        const result = JSON.parse(str);
        return typeof result === 'object' && result !== null;
      } catch (e) {
        return false;
      }
    };

    // 解析JSON字符串
    const parseJsonString = (str) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return {};
      }
    };

    // 格式化JSON
    const formatJson = (json) => {
      try {
        return JSON.stringify(JSON.parse(json), null, 2);
      } catch (e) {
        return json;
      }
    };

    // 格式化列表数据
    const formatListData = (value) => {
      if (!Array.isArray(value)) {
        return [];
      }
      return value.map((item, index) => ({
        index: index,
        value: item
      }));
    };

    // 格式化哈希数据
    const formatHashData = (value) => {
      if (!value || typeof value !== 'object') {
        return [];
      }
      return Object.entries(value).map(([field, val]) => ({
        field,
        value: val
      }));
    };

    // 格式化集合数据
    const formatSetData = (value) => {
      if (!Array.isArray(value)) {
        return [];
      }
      return value.map((item, index) => ({
        index: index + 1,
        value: item
      }));
    };

    // 格式化有序集合数据
    const formatZSetData = (value) => {
      if (!Array.isArray(value)) {
        return [];
      }
      return value.map(item => ({
        score: item.score,
        value: item.member
      }));
    };

    // 组件挂载时获取数据
    onMounted(() => {
      fetchRedisInfo();
      fetchCacheKeys();
    });

    return {
      loading,
      redisInfo,
      statsCards,
      cacheKeys,
      keyPattern,
      pagination,
      keyDetailDialog,
      jsonViewMode,
      getTypeTagType,
      formatKeyType,
      formatTTL,
      formatSize,
      searchKeys,
      handleSizeChange,
      handlePageChange,
      viewKeyDetails,
      handleDeleteKey,
      handleClearAll,
      refreshRedisInfo,
      handleRowClick,
      isJsonString,
      parseJsonString,
      formatJson,
      formatListData,
      formatHashData,
      formatSetData,
      formatZSetData
    };
  }
}; 