# 医院信息中心每日英语

面向医院信息中心内部使用。系统无登录；周一至周四 9:00 发布新词，周二至周五 8:00 用于抽背。抽人流程不在本系统内完成。

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

## 时区说明

业务逻辑使用 `Asia/Shanghai`，不依赖主机 `TZ` 环境变量。如需容器日志显示本地时间，可可选设置 `TZ=Asia/Shanghai`。

## 词库范围

词库覆盖 **2026-09-14** 至 **2027-09-09**。日期用尽后需重新生成词库并更新 `data/words/`。
