-- Schema for Foodonic (MySQL)
-- Core user, restaurant, menu, ordering, payment, drone tables

CREATE DATABASE IF NOT EXISTS foodonic;
USE foodonic;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  user_id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(30),
  role ENUM('customer','owner','agent','admin') NOT NULL DEFAULT 'customer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
  address_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  label VARCHAR(50),
  line1 VARCHAR(255),
  line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  latitude DOUBLE,
  longitude DOUBLE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- RESTAURANTS
CREATE TABLE IF NOT EXISTS restaurants (
  restaurant_id CHAR(36) PRIMARY KEY,
  owner_id CHAR(36),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  phone VARCHAR(30),
  email VARCHAR(255),
  address_id BIGINT,
  can_drone_deliver BOOLEAN DEFAULT FALSE,
  is_open BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (address_id) REFERENCES addresses(address_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
) ENGINE=InnoDB;

-- MENU ITEMS
CREATE TABLE IF NOT EXISTS menu_items (
  menu_item_id CHAR(36) PRIMARY KEY,
  restaurant_id CHAR(36) NOT NULL,
  category_id INT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  prep_time_minutes INT DEFAULT 10,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  order_id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  restaurant_id CHAR(36) NOT NULL,
  delivery_agent_id CHAR(36),
  address_id BIGINT NOT NULL,
  delivery_mode ENUM('human','drone') DEFAULT 'human',
  order_total DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  payment_id CHAR(36),
  status ENUM('placed','confirmed','preparing','ready','picked_up','out_for_delivery','delivered','cancelled','refunded') DEFAULT 'placed',
  placed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
  FOREIGN KEY (delivery_agent_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (address_id) REFERENCES addresses(address_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  menu_item_id CHAR(36) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(menu_item_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  payment_id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('card','wallet','cod','upi') DEFAULT 'card',
  status ENUM('pending','success','failed','refunded') DEFAULT 'pending',
  gateway_reference VARCHAR(255),
  paid_at DATETIME,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  review_id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  restaurant_id CHAR(36) NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- PROMO CODES
CREATE TABLE IF NOT EXISTS promo_codes (
  promo_id CHAR(36) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type ENUM('percentage','fixed') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INT DEFAULT 0,
  expires_at DATETIME
) ENGINE=InnoDB;

-- ORDER STATUS HISTORY
CREATE TABLE IF NOT EXISTS order_status_history (
  history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by CHAR(36),
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- DRONE TYPES
CREATE TABLE IF NOT EXISTS drone_types (
  drone_type_id INT AUTO_INCREMENT PRIMARY KEY,
  model_name VARCHAR(150) NOT NULL,
  manufacturer VARCHAR(150),
  cruising_speed_kmh FLOAT,
  max_payload_grams INT,
  battery_capacity_mah INT
) ENGINE=InnoDB;

-- DRONES
CREATE TABLE IF NOT EXISTS drones (
  drone_id CHAR(36) PRIMARY KEY,
  drone_type_id INT NOT NULL,
  serial_number VARCHAR(100) UNIQUE,
  current_status ENUM('idle','assigned','in_flight','charging','maintenance','retired') DEFAULT 'idle',
  battery_pct TINYINT DEFAULT 100,
  max_payload_grams INT,
  max_flight_time_minutes INT,
  last_maintenance_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (drone_type_id) REFERENCES drone_types(drone_type_id)
) ENGINE=InnoDB;

-- DRONES LOCATION
CREATE TABLE IF NOT EXISTS drones_location (
  drone_id CHAR(36) PRIMARY KEY,
  latitude DOUBLE,
  longitude DOUBLE,
  battery_pct TINYINT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (drone_id) REFERENCES drones(drone_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- DRONE ASSIGNMENTS
CREATE TABLE IF NOT EXISTS drone_assignments (
  assignment_id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  drone_id CHAR(36) NOT NULL,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  accepted_at DATETIME,
  rejected_at DATETIME,
  assignment_status ENUM('pending','accepted','rejected','cancelled') DEFAULT 'pending',
  reason TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (drone_id) REFERENCES drones(drone_id)
) ENGINE=InnoDB;

-- DRONE FLIGHTS
CREATE TABLE IF NOT EXISTS drone_flights (
  flight_id CHAR(36) PRIMARY KEY,
  drone_id CHAR(36) NOT NULL,
  order_id CHAR(36),
  start_lat DOUBLE, start_lng DOUBLE,
  end_lat DOUBLE, end_lng DOUBLE,
  scheduled_start_at DATETIME,
  actual_start_at DATETIME,
  landed_at DATETIME,
  status ENUM('scheduled','enroute','arrived','completed','aborted') DEFAULT 'scheduled',
  estimated_duration_minutes INT,
  actual_duration_minutes INT,
  estimated_distance_meters INT,
  actual_distance_meters INT,
  FOREIGN KEY (drone_id) REFERENCES drones(drone_id),
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
) ENGINE=InnoDB;

-- FLIGHT TELEMETRY
CREATE TABLE IF NOT EXISTS flight_telemetry (
  telemetry_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  flight_id CHAR(36) NOT NULL,
  timestamp DATETIME NOT NULL,
  lat DOUBLE, lng DOUBLE, altitude_meters FLOAT,
  speed_m_s FLOAT, battery_pct TINYINT, heading_deg FLOAT,
  payload_weight_grams INT,
  signal_strength_dbm INT,
  FOREIGN KEY (flight_id) REFERENCES drone_flights(flight_id)
) ENGINE=InnoDB;

-- NO-FLY ZONES
CREATE TABLE IF NOT EXISTS no_fly_zones (
  nfz_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  description TEXT,
  polygon_geojson TEXT,
  active_from DATETIME,
  active_to DATETIME
) ENGINE=InnoDB;

-- BATTERY LOGS
CREATE TABLE IF NOT EXISTS battery_logs (
  battery_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  drone_id CHAR(36) NOT NULL,
  logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  battery_pct TINYINT,
  voltage FLOAT,
  current_draw_mA FLOAT,
  temperature_c FLOAT,
  FOREIGN KEY (drone_id) REFERENCES drones(drone_id)
) ENGINE=InnoDB;

-- DRONE MAINTENANCE
CREATE TABLE IF NOT EXISTS drone_maintenance (
  maintenance_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  drone_id CHAR(36) NOT NULL,
  service_type ENUM('routine','repair','firmware') DEFAULT 'routine',
  performed_by VARCHAR(255),
  notes TEXT,
  performed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (drone_id) REFERENCES drones(drone_id)
) ENGINE=InnoDB;

-- Indexes
CREATE INDEX idx_menu_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_available ON menu_items(available);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_drone_status ON drones(current_status);
CREATE INDEX idx_drones_location_updated ON drones_location(updated_at);
CREATE INDEX idx_flight_telemetry_time ON flight_telemetry(timestamp);

-- End of schema
