-- ─── RareGh0st Store Schema ───
-- Creates the foundation for products, orders, settings, and savings/tax tracking.
-- Safe to run multiple times.

-- ─── Settings (singleton row) ────────────────────────────────────────────────
create table if not exists store_settings (
  id text primary key default 'singleton',
  shop_live boolean not null default false,
  income_tax_pct numeric(5,2) not null default 25.00,
  savings_buffer_pct numeric(5,2) not null default 10.00,
  aish_monthly_threshold numeric(10,2) not null default 1196.00,
  business_province text not null default 'AB',
  printful_enabled boolean not null default false,
  shop_announcement text default '',
  updated_at timestamptz not null default now()
);

insert into store_settings (id) values ('singleton') on conflict (id) do nothing;

-- ─── Products ────────────────────────────────────────────────────────────────
create table if not exists products (
  id bigserial primary key,
  slug text unique not null,
  title text not null,
  category text not null,
  subcategory text,
  description text,
  price_cad numeric(10,2) not null,
  artwork text,
  tags text[] not null default '{}',
  colors text[] not null default '{}',
  sizes text,
  duration text,
  image_url text,
  printful_product_id text,
  printful_variant_ids jsonb not null default '[]'::jsonb,
  is_digital boolean not null default false,
  digital_blob_url text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_category on products(category);
create unique index if not exists idx_products_printful on products(printful_product_id) where printful_product_id is not null;

-- ─── Orders ──────────────────────────────────────────────────────────────────
create table if not exists orders (
  id bigserial primary key,
  stripe_session_id text unique not null,
  stripe_payment_intent_id text,

  customer_email text,
  customer_name text,
  shipping_province text,
  shipping_country text,
  shipping_address jsonb,

  -- monetary (CAD, numeric for precision)
  subtotal_cad numeric(10,2) not null default 0,
  shipping_cad numeric(10,2) not null default 0,
  tax_cad numeric(10,2) not null default 0,
  total_cad numeric(10,2) not null default 0,

  -- savings/tax split snapshot (computed at order time using settings at that moment)
  gst_hst_owed_cad numeric(10,2) not null default 0,
  income_tax_setaside_cad numeric(10,2) not null default 0,
  savings_buffer_cad numeric(10,2) not null default 0,
  net_takehome_cad numeric(10,2) not null default 0,
  income_tax_pct_at_order numeric(5,2),
  savings_buffer_pct_at_order numeric(5,2),

  line_items jsonb not null default '[]'::jsonb,

  -- fulfillment
  status text not null default 'pending',
  printful_order_id text,
  contains_digital boolean not null default false,

  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_paid_at on orders(paid_at);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_email on orders(customer_email);

-- updated_at columns are maintained by application code (api/_lib/supabase.js).
