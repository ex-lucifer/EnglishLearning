# 医院信息中心每日英语

面向医院信息中心内部使用。系统无登录。顶部两个入口：

- **今日抽背**：每天可看上一学习日的 10 个词（中文点击才显示）。周一抽上周四，周六周日抽本周四
- **今日新词**：周一至周四 0:00 起可看当天 10 个词

9:00 前打开默认进抽背页，9:00 后默认进新词页。两边互不影响，可随时切换。抽人流程不在本系统内完成。

## 本地启动

```bash
npm test
node scripts/validate-word-bank.mjs
node src/server.js
```

## Docker 部署

```bash
docker compose up -d --build
```

部署后在内网访问 `http://服务器IP:3000`。

## IIS 部署（Windows Server）

IIS 不直接执行 Node，需安装 **HttpPlatformHandler**，由 IIS 拉起 `node src/server.js` 并反向代理。

请用**独立站点、网站根路径**（例如 `http://10.x.x.x/` 或 `http://english.hospital.local/`）。不要做成 `/english` 这类子应用，否则 `/api`、`/styles.css` 会 404。

1. 安装 [Node.js 20 LTS](https://nodejs.org/)（x64），确认 `C:\Program Files\nodejs\node.exe` 存在。若路径不同，改项目根目录 `web.config` 里的 `processPath`。
2. 安装 [HttpPlatformHandler 1.2](https://www.iis.net/downloads/microsoft/httpplatformhandler)。
3. 把整个项目拷到服务器，例如 `D:\apps\EnglishLearning`。
4. 在该目录下新建 `logs` 文件夹（给 Node 标准输出日志）。
5. 打开 IIS 管理器 → 添加网站：
   - 网站名称：`EnglishLearning`
   - 物理路径：`D:\apps\EnglishLearning`
   - 绑定：内网 IP 或主机名，端口 `80`（或你们规定的端口）
6. 应用程序池：
   - .NET CLR 版本选 **无托管代码**
   - 管道模式 **集成**
   - 标识对该物理路径有读、执行权限（默认 ApplicationPoolIdentity 时，给 `IIS AppPool\EnglishLearning` 读权限）
7. 浏览站点。抽背、新词、历史都应能打开。

排错：看 `logs\node_*.log`，以及 IIS 失败请求跟踪。若 502.3/502.5，多半是 `node.exe` 路径不对，或应用池无权读项目目录。

## 时区说明

业务逻辑使用 `Asia/Shanghai`，不依赖主机 `TZ` 环境变量。如需容器日志显示本地时间，可设置 `TZ=Asia/Shanghai`。

## 词库范围

词库覆盖 **2026-09-14** 至 **2027-09-09**。日期用尽后需重新生成词库并更新 `data/words/`。
