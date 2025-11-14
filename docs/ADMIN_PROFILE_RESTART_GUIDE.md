# 管理员个人中心 - 重启指南

## 🔄 问题现象

访问个人中心API时出现错误：
```
No static resource admin/profile/login-records
No static resource admin/profile/operation-records
```

日志显示：
- ✅ JWT认证成功（`username=admin, role=admin, userId=1`）
- ❌ Spring MVC找不到Controller映射

## 🎯 原因分析

新创建的 `AdminProfileController` 没有被Spring Boot加载，需要重新编译和重启后端服务。

## ✅ 解决步骤

### 步骤1：停止当前后端服务

在运行后端的终端按 `Ctrl+C` 停止服务。

### 步骤2：清理并重新编译

```bash
cd muying-mall
mvn clean install -DskipTests
```

**预期输出**：
```
[INFO] BUILD SUCCESS
[INFO] Total time: XX.XXX s
```

### 步骤3：重新启动后端

```bash
mvn spring-boot:run
```

**预期输出**：
```
(♥◠‿◠)ﾉﾞ  母婴商城启动成功   ლ(´ڡ`ლ)ﾞ
```

### 步骤4：验证Controller已加载

查看启动日志，应该能看到类似信息：
```
Mapped "{[/admin/profile/info],methods=[GET]}" onto ...
Mapped "{[/admin/profile/statistics],methods=[GET]}" onto ...
Mapped "{[/admin/profile/login-records],methods=[GET]}" onto ...
Mapped "{[/admin/profile/operation-records],methods=[GET]}" onto ...
Mapped "{[/admin/profile/hourly-activity],methods=[GET]}" onto ...
```

### 步骤5：测试API

访问Swagger UI：
```
http://localhost:8080/swagger-ui/index.html
```

查找 "管理员个人中心" 标签，测试API。

或使用curl测试：
```bash
# 获取个人信息
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/admin/profile/info

# 获取统计数据
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/admin/profile/statistics
```

## 🔍 故障排查

### 问题1：编译失败

**错误信息**：
```
[ERROR] COMPILATION ERROR
```

**解决方案**：
1. 检查 `AdminProfileController.java` 是否有语法错误
2. 确认所有import语句正确
3. 运行 `mvn clean compile` 查看详细错误

### 问题2：启动失败

**错误信息**：
```
APPLICATION FAILED TO START
```

**解决方案**：
1. 检查端口8080是否被占用
2. 检查数据库连接配置
3. 查看完整的错误堆栈

### 问题3：Controller仍然找不到

**错误信息**：
```
No static resource admin/profile/xxx
```

**解决方案**：

1. **确认文件位置**：
```bash
ls -la src/main/java/com/muyingmall/controller/admin/AdminProfileController.java
```

2. **确认注解正确**：
```java
@RestController
@RequestMapping("/admin/profile")
public class AdminProfileController { ... }
```

3. **检查包扫描**：
确认 `MuyingMallApplication.java` 在 `com.muyingmall` 包下

4. **清理target目录**：
```bash
rm -rf target/
mvn clean install -DskipTests
```

### 问题4：数据库表不存在

**错误信息**：
```
Table 'xxx.admin_login_records' doesn't exist
```

**解决方案**：
```bash
mysql -u root -p your_database < src/main/resources/db/admin_profile_tables.sql
```

## 📝 验证清单

启动成功后，检查以下内容：

- [ ] 后端服务正常启动（看到启动成功的ASCII艺术）
- [ ] Swagger UI可以访问
- [ ] "管理员个人中心" 标签存在
- [ ] 5个API接口都显示在Swagger中
- [ ] 测试API返回正常（不是404或500）
- [ ] 前端页面可以正常加载数据

## 🎯 预期结果

重启后，访问个人中心页面应该：

1. ✅ 个人信息正常显示
2. ✅ 统计数据正常显示
3. ✅ 登录记录列表正常显示
4. ✅ 操作记录列表正常显示
5. ✅ 24小时活跃度图表正常显示

## 💡 提示

1. **首次访问数据可能为空**
   - 登录记录：重新登录后会有数据
   - 操作记录：执行操作后会有数据

2. **开发模式**
   - 使用 `spring-boot-devtools` 可以实现热重载
   - 修改代码后自动重启

3. **生产环境**
   - 使用 `mvn package` 打包
   - 使用 `java -jar` 运行

---

**创建时间**: 2025-11-14  
**状态**: 📋 待执行
