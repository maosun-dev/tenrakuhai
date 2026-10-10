# App Review への返事（1回目・2026-10-10）

Apple から「Guideline 2.1 - Information Needed」（新しい開発者なので、アプリの説明を追加でください）と言われたときの返事。
下の英文を App Review への返信に貼り、画面録画を添付する。同じ英文を「App Review に関する情報」のメモ欄の最後にも足す。

---

Hello App Review Team,

Thank you for reviewing Tenrakuhai. Here is the information you requested.

1. Screen recording
The attached screen recording was captured on a physical iPhone running the latest iOS. It starts with launching the app and shows the typical flow: the first-launch tracking permission prompt, the title screen, choosing a tile, dragging and dropping it onto the table, completing a winning hand ("Tsumo!"), the result screen, the Yaku Collection, and the Game Center leaderboard.
The app has no account registration, no login, no user-generated content, and no paid content or In-App Purchases.

2. Purpose and target audience
Tenrakuhai is a casual physics puzzle game for anyone aged 13 and over, including people who have never played mahjong. Players stack mahjong tiles on a small floating table and try to form winning mahjong hands without letting the tower fall. It turns the rules of mahjong, which many people find hard to learn, into a simple and visual stacking game. Beginner guides (tutorial bubbles, the tiles you are waiting for, and short explanations of each hand) help players learn mahjong hands naturally while playing.

3. Instructions
No login or setup is required.
- Tap "あそぶ" (Play) on the title screen.
- Tap one of the two tiles at the bottom, drag on the screen to choose where it lands, and release to drop it.
- When the tiles on the table form a winning hand, tap "ツモ！" (Tsumo) to score.
- A tile falling off the table costs one heart. The game ends when all 3 hearts are lost or the wall runs out.
- The world ranking can be opened from "ランキング" (Ranking) on the title screen, then "世界ランキング（Game Center）".

4. External services
- Google AdMob (Google Mobile Ads SDK and User Messaging Platform): banner ads on the title and result screens, and an optional rewarded video ad to recover one heart once per game.
- Apple Game Center: online leaderboards (normal and endless modes).
- Links to Apple Music: the music box screen links to the game's soundtrack on Apple Music.
The app does not use its own servers, authentication services, payment processors, or AI services. Game records are stored only on the device.

5. Regional differences
The app functions consistently in all regions where it is available. The only difference is that ad content and the ad consent form are provided by Google AdMob according to each region's requirements.

6. Third-party material
- Sound effects (three short sounds used for the special "Yakuman" effect): free sound materials distributed by SANSEI R&D Co., Ltd. on their official website, which explicitly allows both commercial and non-commercial use: https://www.sansei-rd.com/p_garo_archive/download/sound.html  The source is credited in the in-app "How to play" screen and on the support page.
- Background music (3 tracks): original songs created by the developer with a paid Suno subscription, which grants commercial use rights to the creator. The same tracks are distributed by the developer on music stores, including Apple Music.
- Fonts: Zen Maru Gothic, Noto Serif JP, Dela Gothic One, and Yuji Syuku (SIL Open Font License 1.1).
- Libraries: three.js and cannon.js (MIT License), Capacitor (MIT License).
- The mahjong tile graphics and icons were drawn by the developer.

Best regards,
maosun-dev
