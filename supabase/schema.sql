create extension if not exists pgcrypto;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  account_type text not null default 'Standard',
  status text not null default 'Pending',
  kyc_status text not null default 'Pending review',
  risk_level text not null default 'Moderate',
  created_at timestamptz not null default now()
);

create table if not exists payment_methods (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  method_type text not null check (method_type in ('mtn', 'airtel', 'mpesa', 'bank', 'visa', 'mastercard')),
  account_label text not null,
  account_last4 text,
  provider_token text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists payment_transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  provider text not null check (provider in ('mtn', 'airtel', 'mpesa')),
  provider_reference text unique not null,
  amount numeric(18, 2) not null check (amount > 0),
  currency text not null default 'UGX',
  phone_last4 text,
  status text not null default 'pending_customer_confirmation',
  provider_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id),
  payment_method_id uuid not null references payment_methods(id),
  amount numeric(18, 2) not null check (amount > 0),
  currency text not null default 'UGX',
  status text not null default 'pending_review',
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table customers enable row level security;
alter table payment_methods enable row level security;
alter table payment_transactions enable row level security;
alter table withdrawal_requests enable row level security;

create index if not exists payment_transactions_reference_idx on payment_transactions(provider_reference);
create index if not exists withdrawal_requests_customer_idx on withdrawal_requests(customer_id);
