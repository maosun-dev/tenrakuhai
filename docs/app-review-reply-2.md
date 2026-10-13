# App Review への返事（2回目・2026-10-13）

Apple から「Guideline 2.1 - Information Needed」（追跡の許可の確認画面が審査の端末で見つからない）と言われたときの返事。
直したビルド（release-1.0 ブランチ、ビルド9以降）に差し替えてから、下の英文を App Review への返信に貼り、画面録画を添付する。
同じ英文を「App Review に関する情報」のメモ欄の最後にも足す（Apple の指示）。

録画に入れるもの（Apple の指示）:
- 設定 → プライバシーとセキュリティ → トラッキング →「Appからのトラッキング要求を許可」がオンの状態で、アプリを削除して入れ直したところから起動
- 追跡の確認画面が出る
- 選んだあと、タイトル画面からゲームに進む（公開前は本物の広告がほとんど出ないので、広告が映らなくてよい）

---

Hello App Review Team,

Thank you for your feedback regarding App Tracking Transparency.

We found that the tracking permission request could be silently skipped on some devices, because it was requested while the app was still launching and not yet active. In build [BUILD NUMBER], the request is now made only after the app's screen is fully shown, and it is retried if it was not presented. The Google Mobile Ads SDK is initialized only after the user has responded to the request, so no tracking data is collected before the permission request.

The attached screen recording was captured on a physical iPhone running the latest iOS. It shows:
1. Launching the app after a fresh install (with "Allow Apps to Request to Track" turned on in Settings).
2. The App Tracking Transparency permission request appearing about one second after launch, before any ads are loaded.
3. The flow after the request: the title screen, then starting a game.

Ads may not appear in the recording because the app is not yet published and Google AdMob serves few or no ads to unpublished apps. The ad SDK is still initialized only after the tracking permission request.

Please note that if "Allow Apps to Request to Track" is turned off in Settings > Privacy & Security > Tracking, iOS does not show the request to any app.

Best regards,
maosun-dev
