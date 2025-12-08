USE foodonic;

-- Insert sample users
INSERT INTO users (user_id, email, password_hash, full_name, phone, role) VALUES
('u-cust-0001-0000-0000-000000000001','alice@example.com','$2b$...','Alice','+91-9000000001','customer'),
('u-owner-0002-0000-0000-000000000002','resto@example.com','$2b$...','Ramesh','+91-9000000002','owner');

-- Insert addresses
INSERT INTO addresses (user_id, label, line1, city, state, postal_code, country, latitude, longitude, is_default)
VALUES
('u-cust-0001-0000-0000-000000000001','Home','123 Mango St','Hyderabad','Telangana','500097','India',17.4450,78.3489,TRUE);

-- Insert restaurant and menu
INSERT INTO restaurants (restaurant_id, owner_id, name, phone, email, address_id, can_drone_deliver)
VALUES ('rest-0001-0000-0000-000000000001','u-owner-0002-0000-0000-000000000002','Foodonic Central','+91-9000000002','resto@example.com',1,TRUE);

INSERT INTO categories (name, description) VALUES ('Pizza','Pizza items'),('Beverages','Drinks');

INSERT INTO menu_items (menu_item_id, restaurant_id, category_id, name, description, price) VALUES
(UUID(), 'rest-0001-0000-0000-000000000001', 1, 'Margherita', 'Classic cheese pizza', 199.00),
(UUID(), 'rest-0001-0000-0000-000000000001', 2, 'Cold Drink', '250ml soda', 29.00);

-- Insert drones and locations
INSERT INTO drone_types (model_name, manufacturer, cruising_speed_kmh, max_payload_grams, battery_capacity_mah)
VALUES ('FD-100','FoodonicDrones',60,2000,10000);

INSERT INTO drones (drone_id, drone_type_id, serial_number, current_status, battery_pct, max_payload_grams) VALUES
('11111111-1111-1111-1111-111111111111',1,'SN-FD-001','idle',95,1500),
('22222222-2222-2222-2222-222222222222',1,'SN-FD-002','idle',88,1500);

INSERT INTO drones_location (drone_id, latitude, longitude, battery_pct) VALUES
('11111111-1111-1111-1111-111111111111',17.4455,78.3490,95),
('22222222-2222-2222-2222-222222222222',17.4460,78.3500,88);

-- Insert a sample drone-enabled order
INSERT INTO orders (order_id, user_id, restaurant_id, address_id, delivery_mode, order_total, status) VALUES
('ord-0001-0000-0000-000000000001','u-cust-0001-0000-0000-000000000001','rest-0001-0000-0000-000000000001',1,'drone',228.00,'placed');

-- Mark assignment queued for worker
INSERT INTO drone_assignments (assignment_id, order_id, drone_id, assigned_at, assignment_status)
VALUES (UUID(),'ord-0001-0000-0000-000000000001','00000000-0000-0000-0000-000000000000',NOW(),'pending');
