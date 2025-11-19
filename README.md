kurumi-pamphlet
=================

文化祭で使用したデジタルパンフレット Web アプリケーションです。来場者が企画・会場・混雑状況をわかりやすく確認できるよう、マップ表示、検索、スタンプラリー（クイズ・QRスキャン）などの機能を提供します。



## 技術スタック

- Framework: Next.js 15（App Router）
- Language: TypeScript / React 19
- Styling: Tailwind CSS v4
- DB/ORM: PostgreSQL + Prisma 6
- UI/Icons: Shadcn UI, lucide-react
- Analytics: @vercel/analytics


## 必要要件

- Node.js 18.18 以上（LTS 推奨）
- PostgreSQL（接続文字列は環境変数で設定）




## スクリプト一覧（package.json）

- dev: 開発サーバー起動（next dev）
- build: 本番ビルド（next build）
- start: 本番起動（next start）
- lint: Lint 実行（next lint）
- postinstall: Prisma クライアント生成（prisma generate）


## データベースと Prisma

- Prisma スキーマ: `prisma/schema.prisma`
- プロバイダ: PostgreSQL
- 接続: 環境変数 `DATABASE_URL`
- モデル例: Buildings / Floor / Projects / MapPin / FoodData / StampPlace / UserStamps / notifications ほか

開発時によく使うコマンド:

```powershell
# モデル変更後のマイグレーション生成＆適用
npx prisma migrate dev --name <change_name>

# Prisma Studio でデータ確認
npx prisma studio
```


## ディレクトリ構成（抜粋）

```
app/
	api/             # Next.js Route Handlers（REST API）
	map/, food/, event/, notification/, stamp/, ...  # 各ページ
components/
	Map/, Food/, Notification/, Stamp/, KurumiAI/    # UI コンポーネント群
lib/
	prisma.ts        # Prisma クライアント
prisma/
	schema.prisma    # データモデル
scripts/
	*.js             # スキーマ/データ移行ユーティリティ
```


## 主な API エンドポイント（読み取り中心）

Next.js の Route Handlers として `app/api` 配下に実装されています。レスポンスは基本 JSON、成功時はキャッシュヘッダ（`Cache-Control: public, max-age=…`）を返します。

- GET `/api/get_buildings` … 建物一覧（階数・企画数カウント含む）
- GET `/api/get_building/[id]` … 建物詳細
- GET `/api/get_project_data/[id]` … 企画詳細
- GET `/api/get_floor_data/get_floor_info` … フロア情報
- GET `/api/get_floor_data/get_floor_project_list` … フロア内の企画一覧
- GET `/api/get_floor_data/get_floor_status` … フロアの混雑ステータス
- GET `/api/get_map_pin/get_building_pin` … 建物ピン
- GET `/api/get_map_pin/get_floor_project_pin` … フロア/企画ピン
- GET `/api/get_food/get_food_data` … 食品データ一覧
- GET `/api/get_food/get_food_status` … 在庫/販売状況
- GET `/api/get_event_data/event_time_line` … イベントタイムライン
- GET `/api/get_event_data/get_all_place` … イベント会場一覧
- GET `/api/get_status/get_all_status` / `/api/get_status/get_one_status`
- GET `/api/get_tag/get_all_tags`
- GET `/api/notification_data/get_all_notification` / `/api/notification_data/get_part_notification`
- GET `/api/search?q=word1,word2,...` … 複合 OR 検索（Projects.name / room_name / project_genre / team_name, Buildings.name / index）
- POST `/api/get_stamp_data/register_user_stamp` … ユーザーの押印登録（冪等、重複は success:true で返却）
- GET `/api/get_stamp_data/get_all`, `/api/get_stamp_data/get_stamp_quiz`, `/api/get_stamp_data/get_user_stamp` … スタンプ関連

エンドポイント詳細や入力バリデーションは各 `route.ts` を参照してください。


## ページ

- `/map` … 校内マップ・ピン表示（ズーム/パン）
- `/food` … 食品一覧とフィルタ・在庫状況表示
- `/event` … タイムライン
- `/notification` … お知らせ一覧
- `/stamp` … スタンプラリー（`/stamp/quiz/[id]`, `/stamp/scan` 等）


## 画像/外部ストレージ

`next.config.ts` の `images.remotePatterns` に Supabase Storage 配下の読み込みを許可しています。該当の画像 URL を使用する場合は、CORS や公開設定を確認してください。


## 開発メモ / トラブルシュート

- 本番ビルド時の ESLint エラーでデプロイが止まらないように `ignoreDuringBuilds: true` を設定しています
- 開発時のみ `experimental.allowedDevOrigins` を許可（ngrok など）
- スキーマ改変により scripts/*.js のフィールドが一致しない場合は適宜修正してください（例: Projects の `project_genre` など）

