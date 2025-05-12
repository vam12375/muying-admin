<template>
  <div class="redis-monitor-container page-container">
    <el-card class="info-card" v-loading="loading.info">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <el-icon><Connection /></el-icon>
            <span>Redis 缓存服务状态</span>
          </div>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="refreshRedisInfo">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- Redis 状态概览 -->
      <div class="redis-info-section">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(stat, index) in statsCards" :key="index">
            <div class="stat-card" :class="stat.type">
              <div class="stat-icon">
                <el-icon>
                  <component :is="stat.icon"></component>
                </el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        
        <el-divider>
          <el-icon><InfoFilled /></el-icon>
          <span>服务器详情</span>
        </el-divider>
        
        <el-descriptions :column="2" border size="small" class="redis-details">
          <el-descriptions-item label="Redis 版本">{{ redisInfo.version || '-' }}</el-descriptions-item>
          <el-descriptions-item label="运行模式">{{ redisInfo.mode || '-' }}</el-descriptions-item>
          <el-descriptions-item label="操作系统">{{ redisInfo.os || '-' }}</el-descriptions-item>
          <el-descriptions-item label="连接客户端数">{{ redisInfo.connectedClients || '-' }}</el-descriptions-item>
          <el-descriptions-item label="运行时间">{{ redisInfo.uptime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="总内存使用">{{ redisInfo.usedMemoryHuman || '-' }}</el-descriptions-item>
          <el-descriptions-item label="内存峰值">{{ redisInfo.usedMemoryPeakHuman || '-' }}</el-descriptions-item>
          <el-descriptions-item label="已执行命令">{{ redisInfo.totalCommands || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    
    <!-- 缓存键管理 -->
    <el-card class="keys-card" v-loading="loading.keys">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <el-icon><Key /></el-icon>
            <span>缓存键管理</span>
          </div>
          <div class="header-actions">
            <el-button 
              type="danger" 
              size="small" 
              @click="handleClearAll" 
              :disabled="!cacheKeys.length">
              <el-icon><Delete /></el-icon>
              清空所有缓存
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-section">
        <el-input
          v-model="keyPattern"
          placeholder="输入键名或模式 (例如: user* 或 session:*)"
          clearable
          @keyup.enter="searchKeys"
          class="pattern-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button @click="searchKeys">搜索</el-button>
          </template>
        </el-input>
        <div class="pattern-hints">
          <div class="hint"><span class="keyword">*</span> - 匹配任意字符</div>
          <div class="hint"><span class="keyword">?</span> - 匹配单个字符</div>
          <div class="hint"><span class="keyword">[abc]</span> - 匹配方括号内任意字符</div>
        </div>
      </div>
      
      <!-- 缓存键列表 -->
      <div v-if="cacheKeys.length" class="keys-table-container">
        <el-table
          :data="cacheKeys"
          style="width: 100%"
          @row-click="handleRowClick"
          row-key="key"
          border
          highlight-current-row>
          <el-table-column type="selection" width="55" />
          <el-table-column prop="key" label="键名" show-overflow-tooltip>
            <template #default="scope">
              <div :title="scope.row.key" class="key-name">
                {{ scope.row.key }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="120">
            <template #default="scope">
              <el-tag :type="getTypeTagType(scope.row.type)">
                {{ formatKeyType(scope.row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ttl" label="过期时间" width="150">
            <template #default="scope">
              <el-tag 
                :type="scope.row.ttl === -1 ? 'success' : (scope.row.ttl < 3600 ? 'danger' : 'warning')"
                :effect="scope.row.ttl === -1 ? 'plain' : 'light'">
                {{ formatTTL(scope.row.ttl) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="大小" width="120">
            <template #default="scope">
              {{ formatSize(scope.row.size) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template #default="scope">
              <div class="table-actions">
                <el-button
                  type="primary"
                  size="small"
                  @click.stop="viewKeyDetails(scope.row)"
                  class="action-button"
                >
                  <el-icon><View /></el-icon>
                  详情
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click.stop="handleDeleteKey(scope.row.key)"
                  class="action-button"
                >
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.size"
            :total="pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
      
      <!-- 空状态 -->
      <el-empty 
        v-else 
        description="没有找到匹配的缓存键"
        :image-size="200">
        <el-button type="primary" @click="searchKeys('')">显示所有键</el-button>
      </el-empty>
    </el-card>
    
    <!-- 键值详情对话框 -->
    <el-dialog
      v-model="keyDetailDialog.visible"
      :title="`缓存键详情: ${keyDetailDialog.key}`"
      width="60%"
      destroy-on-close
    >
      <template v-if="!keyDetailDialog.loading">
        <div class="key-detail-header">
          <div class="detail-item">
            <span class="detail-label">类型:</span>
            <el-tag :type="getTypeTagType(keyDetailDialog.type)">
              {{ formatKeyType(keyDetailDialog.type) }}
            </el-tag>
          </div>
          <div class="detail-item">
            <span class="detail-label">过期时间:</span>
            <el-tag 
              :type="keyDetailDialog.ttl === -1 ? 'success' : (keyDetailDialog.ttl < 3600 ? 'danger' : 'warning')"
              :effect="keyDetailDialog.ttl === -1 ? 'plain' : 'light'">
              {{ formatTTL(keyDetailDialog.ttl) }}
            </el-tag>
          </div>
          <div class="detail-item">
            <span class="detail-label">大小:</span>
            <span>{{ formatSize(keyDetailDialog.size) }}</span>
          </div>
        </div>
        
        <el-divider content-position="left">值内容</el-divider>
        
        <!-- 字符串类型 -->
        <div v-if="keyDetailDialog.type === 'string'" class="string-value">
          <div class="value-display">
            <!-- 尝试自动识别JSON -->
            <div v-if="isJsonString(keyDetailDialog.value)" class="json-display">
              <el-tabs v-model="jsonViewMode">
                <el-tab-pane label="Tree视图" name="tree">
                  <pre class="json-tree">{{ formatJson(keyDetailDialog.value) }}</pre>
                </el-tab-pane>
                <el-tab-pane label="源码视图" name="code">
                  <pre class="formatted-json">{{ formatJson(keyDetailDialog.value) }}</pre>
                </el-tab-pane>
              </el-tabs>
            </div>
            <!-- 普通字符串 -->
            <div v-else class="plain-text-display">
              <pre>{{ keyDetailDialog.value }}</pre>
            </div>
          </div>
        </div>
        
        <!-- 列表类型 -->
        <div v-else-if="keyDetailDialog.type === 'list'" class="list-value">
          <el-table :data="formatListData(keyDetailDialog.value)" border>
            <el-table-column prop="index" label="索引" width="80" />
            <el-table-column prop="value" label="值" />
          </el-table>
        </div>
        
        <!-- 哈希类型 -->
        <div v-else-if="keyDetailDialog.type === 'hash'" class="hash-value">
          <el-table :data="formatHashData(keyDetailDialog.value)" border>
            <el-table-column prop="field" label="字段" show-overflow-tooltip />
            <el-table-column prop="value" label="值" show-overflow-tooltip />
          </el-table>
        </div>
        
        <!-- 集合类型 -->
        <div v-else-if="keyDetailDialog.type === 'set'" class="set-value">
          <el-table :data="formatSetData(keyDetailDialog.value)" border>
            <el-table-column prop="index" label="#" width="80" />
            <el-table-column prop="value" label="值" show-overflow-tooltip />
          </el-table>
        </div>
        
        <!-- 有序集合类型 -->
        <div v-else-if="keyDetailDialog.type === 'zset'" class="zset-value">
          <el-table :data="formatZSetData(keyDetailDialog.value)" border>
            <el-table-column prop="score" label="分数" width="100" />
            <el-table-column prop="value" label="值" show-overflow-tooltip />
          </el-table>
        </div>
        
        <!-- 不支持的类型 -->
        <el-alert
          v-else
          title="不支持的数据类型"
          type="warning"
          :closable="false"
          show-icon
        />
      </template>
      <template v-else>
        <div class="loading-placeholder">
          <el-skeleton animated :rows="5" />
        </div>
      </template>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="handleDeleteKey(keyDetailDialog.key)">
            <el-icon><Delete /></el-icon>
            删除该键
          </el-button>
          <el-button @click="keyDetailDialog.visible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script src="./redis.js"></script>
<style lang="scss">
@import './redis.scss';
</style> 