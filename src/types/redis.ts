/**
 * Redis管理类型定义
 * Redis Management Type Definitions
 * 
 * Source: 基于旧系统 muying-admin-react
 */

/**
 * Redis键数据
 */
export interface RedisKeyData {
  key: string;           // 键名
  type: string;          // 类型: string, list, hash, set, zset
  ttl: number;           // 过期时间(秒): -1=永不过期, -2=已过期
  size: number;          // 大小(字节)
}

/**
 * Redis服务器信息
 */
export interface RedisInfoData {
  version: string;                // Redis版本
  mode: string;                   // 运行模式
  os: string;                     // 操作系统
  connectedClients: string;       // 连接数
  uptime: string;                 // 运行时间(秒)
  uptimeInDays: string;           // 运行天数
  usedMemory: string;             // 已用内存(字节)
  usedMemoryHuman: string;        // 已用内存(可读)
  usedMemoryPeakHuman: string;    // 内存峰值(可读)
  totalCommands: string;          // 总命令数
  keyspaceHits: string;           // 命中次数
  keyspaceMisses: string;         // 未命中次数
  keyspaceHitRate: string;        // 命中率
  totalKeys: number;              // 键总数
  keyspaceStats: {                // 键空间统计
    [key: string]: {
      keys: string;               // 键数量
      expires: string;            // 过期键数量
      avg_ttl: string;            // 平均TTL
    };
  };
}

/**
 * Redis键值数据
 */
export interface RedisValueData {
  key: string;           // 键名
  type: string;          // 类型
  ttl: number;           // 过期时间
  size: number;          // 大小
  value: any;            // 值
}

/**
 * Redis键列表查询参数
 */
export interface RedisListParams {
  page?: number;         // 页码
  size?: number;         // 每页大小
  pattern?: string;      // 搜索模式(支持通配符)
}

/**
 * 设置Redis键值参数
 */
export interface SetRedisValueParams {
  key: string;           // 键名
  value: any;            // 值
  ttl?: number;          // 过期时间(秒)
}
