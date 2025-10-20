-- 店舗テーブル
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  business_hours JSONB NOT NULL DEFAULT '{"open": "11:00", "close": "22:00"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 予約テーブル
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size > 0),
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_reservations_restaurant_id ON reservations(restaurant_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- サンプル店舗データの挿入
INSERT INTO restaurants (name, phone, address, business_hours) VALUES
('レストラン サンプル', '03-1234-5678', '東京都渋谷区サンプル1-2-3', '{"open": "11:00", "close": "22:00"}');

-- Row Level Security (RLS) の設定
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- 予約テーブルは誰でも読み書き可能（LINEミニアプリ用）
CREATE POLICY "予約は誰でも作成可能" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "予約は誰でも読み取り可能" ON reservations FOR SELECT USING (true);
CREATE POLICY "予約は誰でも更新可能" ON reservations FOR UPDATE USING (true);
CREATE POLICY "予約は誰でも削除可能" ON reservations FOR DELETE USING (true);

-- 店舗テーブルは誰でも読み取り可能
CREATE POLICY "店舗情報は誰でも読み取り可能" ON restaurants FOR SELECT USING (true);
