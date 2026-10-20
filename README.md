# 50音道場

每日測驗認識日文 50 音(平假名 + 片假名),自動記錄答錯的假名並可回顧複習。純前端靜態網頁,無需伺服器。

## 本機開發

```bash
python3 -m http.server 8080
```

打開 `http://localhost:8080` 即可使用(必須透過 http server 開啟,因為使用了 ES Modules,直接用 `file://` 開啟會被瀏覽器的 CORS 政策擋下)。

## 執行測試

```bash
node --test
```

## 部署到 GitHub Pages

1. 把這個資料夾 push 到 GitHub repo
2. Repo → Settings → Pages → Source 選擇 `main` branch、資料夾選 `/ (root)`
3. 等待 1-2 分鐘,Pages 網址會顯示在同一個設定頁面
4. 手機瀏覽器打開網址後,可用「加入主畫面」安裝成 App 圖示

## 功能

- 六階段解鎖:平假名清音 → 濁音/半濁音 → 拗音 → 片假名清音 → 濁音/半濁音 → 拗音,每階段需整體正確率達 80% 才解鎖下一階段
- 每日 15 題測驗,依答錯率自動加權出題
- 連續天數(streak)紀錄
- 錯題本與「只練錯題」複習模式
- 點擊假名可用瀏覽器內建語音朗讀發音(需瀏覽器支援 Web Speech API)
- PWA,可加入手機主畫面,並有基本離線快取
