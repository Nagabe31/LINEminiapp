# 飲食店予約システム - Next.js + Supabase + Vercel

## 概要
飲食店向けの予約管理システムのLINEミニアプリです。Next.js、Supabase、Vercelを使用して構築されています。

## 技術スタック
- **フロントエンド**: Next.js 15, React, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: Supabase (PostgreSQL)
- **ホスティング**: Vercel
- **アイコン**: Lucide React

## 機能

### お客様向け機能
- 📝 予約フォーム（お名前、電話番号、希望日時、人数、要望）
- ✅ 予約内容の確認画面
- 🎉 予約完了通知
- 📱 レスポンシブデザイン（スマートフォン対応）

### 店舗側管理機能
- 📊 予約一覧ダッシュボード
- 🔍 検索・フィルター機能
- ✅ 予約の確定・キャンセル
- 📈 リアルタイム更新

## セットアップ手順

### 1. リポジトリのクローン
```bash
git clone https://github.com/Nagabe31/LINEminiapp.git
cd restaurant-booking
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. Supabaseプロジェクトの設定

#### 3.1 Supabaseプロジェクトを作成
1. [Supabase](https://supabase.com/)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAPIキーを取得

#### 3.2 データベースのセットアップ
```sql
-- supabase/migrations/001_initial_schema.sql の内容を実行
```

#### 3.3 環境変数の設定
`.env.local` ファイルを作成：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 4. ローカル開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセス

## デプロイ手順

### Vercelへのデプロイ

#### 1. Vercelアカウントの作成
1. [Vercel](https://vercel.com/)にアクセス
2. GitHubアカウントでログイン

#### 2. プロジェクトのデプロイ
1. Vercelダッシュボードで「New Project」
2. GitHubリポジトリを選択
3. 環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. デプロイを実行

#### 3. カスタムドメインの設定（オプション）
- Vercelダッシュボードでドメインを設定

## LINEミニアプリとしての設定

### 1. LINE Developers Consoleでの設定
1. [LINE Developers Console](https://developers.line.biz/)にアクセス
2. 新しいプロバイダーを作成
3. ミニアプリを作成
4. ミニアプリのURLにVercelのデプロイURLを設定

### 2. ミニアプリの設定
- **App Name**: レストラン予約システム
- **Description**: 飲食店向けの予約管理システム
- **Category**: Food & Drink
- **Icon**: 適切なアイコンをアップロード

## プロジェクト構造

```
restaurant-booking/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── reservations/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           └── route.ts
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
│       ├── ConfirmationModal.tsx
│       ├── ReservationForm.tsx
│       └── SuccessMessage.tsx
├── lib/
│   ├── database.ts
│   └── supabase.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── vercel.json
└── README.md
```

## API エンドポイント

### 予約関連
- `POST /api/reservations` - 予約を作成
- `GET /api/reservations` - 予約一覧を取得
- `GET /api/reservations/[id]` - 特定の予約を取得
- `PUT /api/reservations/[id]` - 予約を更新
- `DELETE /api/reservations/[id]` - 予約を削除

## データベーススキーマ

### reservations テーブル
- `id`: UUID (Primary Key)
- `restaurant_id`: UUID (Foreign Key)
- `customer_name`: TEXT
- `phone_number`: TEXT
- `reservation_date`: DATE
- `reservation_time`: TIME
- `party_size`: INTEGER
- `special_requests`: TEXT
- `status`: TEXT ('pending', 'confirmed', 'cancelled')
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### restaurants テーブル
- `id`: UUID (Primary Key)
- `name`: TEXT
- `phone`: TEXT
- `address`: TEXT
- `business_hours`: JSONB
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## カスタマイズ

### 営業時間の変更
`src/components/ReservationForm.tsx` の `timeSlots` 配列を編集

### スタイルの変更
`src/app/globals.css` または各コンポーネントのTailwindクラスを編集

### 機能の追加
- 新しいAPIエンドポイントを `src/app/api/` に追加
- 新しいコンポーネントを `src/components/` に追加

## 今後の拡張予定
- 📧 メール通知機能
- 🔔 予約リマインダー
- 📈 売上分析機能
- 🎯 顧客管理機能
- 📱 プッシュ通知
- 🔐 店舗側認証機能

## ライセンス
MIT License

## 作者
Nagabe31

## サポート
ご質問やご要望がございましたら、GitHubのIssuesでお知らせください。