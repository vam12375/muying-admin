# MyBatis 动态 SQL 修复

## 问题描述

访问个人中心的"统计概览"标签时，控制台报错：

```
Error querying database. Cause: java.sql.SQLSyntaxErrorException: 
You have an error in your SQL syntax; check the manual that corresponds 
to your MySQL server version for the right syntax to use near 
'test='adminId != null'> AND admin_id = null </if><if test='days != null'> 
AND lo' at line 1
```

## 根本原因

在 `AdminLoginRecordMapper.java` 中，有三个方法的 `@Select` 注解包含了 MyBatis 动态 SQL 标签（`<if>`），但**没有用 `<script>` 标签包裹**。

### 错误示例

```java
@Select("SELECT AVG(duration_seconds) as avg_duration " +
        "FROM admin_login_records " +
        "WHERE duration_seconds IS NOT NULL AND login_status = 'success' " +
        "<if test='adminId != null'> AND admin_id = #{adminId} </if>" +  // ❌ 没有 <script> 包裹
        "<if test='days != null'> AND login_time >= DATE_SUB(NOW(), INTERVAL #{days} DAY) </if>")
Double selectAvgOnlineTime(@Param("adminId") Integer adminId, @Param("days") Integer days);
```

**问题**：MyBatis 无法识别 `<if>` 标签，将其作为普通字符串直接发送给数据库，导致 SQL 语法错误。

### 正确写法

```java
@Select("<script>" +  // ✅ 添加 <script> 标签
        "SELECT AVG(duration_seconds) as avg_duration " +
        "FROM admin_login_records " +
        "WHERE duration_seconds IS NOT NULL AND login_status = 'success' " +
        "<if test='adminId != null'> AND admin_id = #{adminId} </if>" +
        "<if test='days != null'> AND login_time >= DATE_SUB(NOW(), INTERVAL #{days} DAY) </if>" +
        "</script>")  // ✅ 闭合 <script> 标签
Double selectAvgOnlineTime(@Param("adminId") Integer adminId, @Param("days") Integer days);
```

## 修复内容

### 1. selectAvgOnlineTime 方法

**修复前**：
```java
@Select("SELECT AVG(duration_seconds) as avg_duration " +
        "FROM admin_login_records " +
        "WHERE duration_seconds IS NOT NULL AND login_status = 'success' " +
        "<if test='adminId != null'> AND admin_id = #{adminId} </if>" +
        "<if test='days != null'> AND login_time >= DATE_SUB(NOW(), INTERVAL #{days} DAY) </if>")
```

**修复后**：
```java
@Select("<script>" +
        "SELECT AVG(duration_seconds) as avg_duration " +
        "FROM admin_login_records " +
        "WHERE duration_seconds IS NOT NULL AND login_status = 'success' " +
        "<if test='adminId != null'> AND admin_id = #{adminId} </if>" +
        "<if test='days != null'> AND login_time >= DATE_SUB(NOW(), INTERVAL #{days} DAY) </if>" +
        "</script>")
```

### 2. selectMaxSessionTime 方法

**修复前**：
```java
@Select("SELECT MAX(duration_seconds) as max_duration " +
        "FROM admin_login_records " +
        "WHERE duration_seconds IS NOT NULL AND login_status = 'success' " +
        "<if test='adminId != null'> AND admin_id = #{adminId} </if>" +
        "<if test='days != null'> AND login_time >= DATE_SUB(NOW(), INTERVAL #{days} DAY) </if>")
```

**修复后**：
```java
@Select("<script>" +
        "SELECT MAX(duration_seconds) as max_duration " +
        "FROM admin_login_records " +
        "WHERE duration_seconds IS NOT NULL AND login_status = 'success' " +
        "<if test='adminId != null'> AND admin_id = #{adminId} </if>" +
        "<if test='days != null'> AND login_time >= DATE_SUB(NOW(), INTERVAL #{days} DAY) </if>" +
        "</script>")
```

### 3. selectLoginStatistics 方法

**修复前**：
```java
@Select("SELECT " +
        "DATE(login_time) as date, " +
        "COUNT(*) as count, " +
        "COUNT(CASE WHEN login_status = 'success' THEN 1 END) as success_count, " +
        "COUNT(CASE WHEN login_status = 'failed' THEN 1 END) as failed_count " +
        "FROM admin_login_records " +
        "WHERE login_time >= #{startTime} AND login_time <= #{endTime} " +
        "<if test='adminId != null'> AND admin_id = #{adminId} </if>" +
        "GROUP BY DATE(login_time) " +
        "ORDER BY date DESC")
```

**修复后**：
```java
@Select("<script>" +
        "SELECT " +
        "DATE(login_time) as date, " +
        "COUNT(*) as count, " +
        "COUNT(CASE WHEN login_status = 'success' THEN 1 END) as success_count, " +
        "COUNT(CASE WHEN login_status = 'failed' THEN 1 END) as failed_count " +
        "FROM admin_login_records " +
        "WHERE login_time >= #{startTime} AND login_time &lt;= #{endTime} " +
        "<if test='adminId != null'> AND admin_id = #{adminId} </if>" +
        "GROUP BY DATE(login_time) " +
        "ORDER BY date DESC" +
        "</script>")
```

**注意**：同时将 `<=` 改为 `&lt;=`（XML 转义）。

## MyBatis 动态 SQL 规则

### 1. 使用 `<script>` 标签

当在 `@Select`、`@Update`、`@Insert`、`@Delete` 注解中使用动态 SQL 标签时，**必须**用 `<script>` 标签包裹：

```java
@Select("<script>" +
        "SELECT * FROM table " +
        "WHERE 1=1 " +
        "<if test='condition'> AND field = #{value} </if>" +
        "</script>")
```

### 2. XML 特殊字符转义

在 `<script>` 标签内，需要对 XML 特殊字符进行转义：

| 字符 | 转义 | 说明 |
|------|------|------|
| `<` | `&lt;` | 小于号 |
| `>` | `&gt;` | 大于号 |
| `&` | `&amp;` | 与符号 |
| `"` | `&quot;` | 双引号 |
| `'` | `&apos;` | 单引号 |

**示例**：
```java
// ❌ 错误
"WHERE age <= #{age}"

// ✅ 正确
"WHERE age &lt;= #{age}"
```

### 3. 常用动态 SQL 标签

- `<if test='condition'>` - 条件判断
- `<choose>` / `<when>` / `<otherwise>` - 多条件选择
- `<where>` - 自动处理 WHERE 子句
- `<set>` - 自动处理 SET 子句
- `<foreach>` - 循环遍历

## 验证步骤

### 1. 重启后端服务

```bash
# 方法1：IDEA 重启
Ctrl+F2 停止
Shift+F10 启动

# 方法2：Maven 重新编译
mvn clean compile
```

### 2. 测试接口

访问个人中心 → 统计概览标签，检查：
- ✅ 页面正常加载
- ✅ 统计数据正确显示
- ✅ 控制台无 SQL 错误

### 3. 检查日志

后端控制台应该显示：
```
Preparing: SELECT AVG(duration_seconds) as avg_duration FROM admin_login_records WHERE duration_seconds IS NOT NULL AND login_status = 'success' AND login_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
Parameters: 30(Integer)
```

## 相关文件

- `muying-mall/src/main/java/com/muyingmall/mapper/AdminLoginRecordMapper.java` - Mapper 接口
- `muying-mall/src/main/java/com/muyingmall/service/impl/AdminLoginRecordServiceImpl.java` - Service 实现
- `muying-admin/src/components/profile/AdminStatistics.tsx` - 前端统计组件

## 最佳实践

### 1. 优先使用 XML 映射文件

对于复杂的动态 SQL，建议使用 XML 映射文件而不是注解：

```xml
<!-- AdminLoginRecordMapper.xml -->
<select id="selectAvgOnlineTime" resultType="java.lang.Double">
    SELECT AVG(duration_seconds) as avg_duration
    FROM admin_login_records
    WHERE duration_seconds IS NOT NULL AND login_status = 'success'
    <if test="adminId != null">
        AND admin_id = #{adminId}
    </if>
    <if test="days != null">
        AND login_time >= DATE_SUB(NOW(), INTERVAL #{days} DAY)
    </if>
</select>
```

**优点**：
- 更清晰的 SQL 结构
- 不需要字符串拼接
- 不需要 XML 转义
- 更容易维护

### 2. 简单查询使用注解

对于不包含动态 SQL 的简单查询，可以直接使用注解：

```java
@Select("SELECT * FROM admin_login_records WHERE admin_id = #{adminId} ORDER BY login_time DESC LIMIT #{limit}")
List<AdminLoginRecord> selectRecentLogins(@Param("adminId") Integer adminId, @Param("limit") Integer limit);
```

### 3. 代码审查检查点

- ✅ 动态 SQL 是否用 `<script>` 包裹
- ✅ XML 特殊字符是否正确转义
- ✅ 参数名是否与 `@Param` 一致
- ✅ SQL 语法是否正确

## 预防措施

### 1. 开发阶段

- 使用 IDE 的 MyBatis 插件进行语法检查
- 编写单元测试验证 SQL 语句
- 在测试环境充分测试

### 2. 代码规范

- 统一使用 XML 映射文件或注解
- 复杂 SQL 优先使用 XML
- 添加详细的注释说明

### 3. 日志配置

在 `application.yml` 中开启 MyBatis SQL 日志：

```yaml
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

---

**修复时间**：2025-11-14  
**遵循协议**：AURA-X-KYS (KISS/YAGNI/SOLID)  
**修复状态**：✅ 已完成，需要重启后端
