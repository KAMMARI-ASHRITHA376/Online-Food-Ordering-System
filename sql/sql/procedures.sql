USE foodonic;

-- Helper: Haversine distance function (approx meters)
DROP FUNCTION IF EXISTS haversine_distance_m;
DELIMITER $$
CREATE FUNCTION haversine_distance_m(lat1 DOUBLE, lon1 DOUBLE, lat2 DOUBLE, lon2 DOUBLE)
RETURNS DOUBLE DETERMINISTIC
BEGIN
  DECLARE R DOUBLE DEFAULT 6371000; -- earth radius meters
  DECLARE dLat DOUBLE; DECLARE dLon DOUBLE;
  DECLARE a DOUBLE; DECLARE c DOUBLE;

  SET dLat = RADIANS(lat2 - lat1);
  SET dLon = RADIANS(lon2 - lon1);

  SET a = SIN(dLat/2) * SIN(dLat/2) 
      + COS(RADIANS(lat1)) * COS(RADIANS(lat2)) 
      * SIN(dLon/2) * SIN(dLon/2);

  SET c = 2 * ATAN2(SQRT(a), SQRT(1-a));

  RETURN R * c;
END$$
DELIMITER ;



-- Procedure: find_nearest_idle_drone
DROP PROCEDURE IF EXISTS find_nearest_idle_drone;
DELIMITER $$
CREATE PROCEDURE find_nearest_idle_drone(
  IN dest_lat DOUBLE, 
  IN dest_lng DOUBLE, 
  IN required_payload INT, 
  IN min_battery_pct INT
)
BEGIN
  SELECT dl.drone_id, dl.latitude, dl.longitude, dl.battery_pct,
         haversine_distance_m(dest_lat, dest_lng, dl.latitude, dl.longitude) AS distance_m
  FROM drones_location dl
  JOIN drones d ON d.drone_id = dl.drone_id
  WHERE d.current_status = 'idle'
    AND d.max_payload_grams >= required_payload
    AND dl.battery_pct >= min_battery_pct
  ORDER BY distance_m
  LIMIT 1;
END$$
DELIMITER ;



-- Procedure: assign_drone_to_order
DROP PROCEDURE IF EXISTS assign_drone_to_order;
DELIMITER $$
CREATE PROCEDURE assign_drone_to_order(IN in_order_id CHAR(36))
BEGIN
  DECLARE dest_lat DOUBLE; 
  DECLARE dest_lng DOUBLE;
  DECLARE payload_req INT DEFAULT 0;
  DECLARE candidate_drone CHAR(36);
  DECLARE min_battery INT DEFAULT 40;

  -- Get destination of the order
  SELECT a.latitude, a.longitude 
  INTO dest_lat, dest_lng
  FROM orders o 
  JOIN addresses a ON o.address_id = a.address_id
  WHERE o.order_id = in_order_id
  LIMIT 1;

  START TRANSACTION;

  -- Lock & find nearest drone
  SELECT dl.drone_id INTO candidate_drone
  FROM drones_location dl
  JOIN drones d ON d.drone_id = dl.drone_id
  WHERE d.current_status = 'idle'
    AND dl.battery_pct >= min_battery
  ORDER BY haversine_distance_m(dest_lat, dest_lng, dl.latitude, dl.longitude)
  LIMIT 1
  FOR UPDATE;

  IF candidate_drone IS NOT NULL THEN
    -- Mark drone as reserved
    UPDATE drones 
    SET current_status = 'assigned' 
    WHERE drone_id = candidate_drone;

    -- Create assignment
    INSERT INTO drone_assignments 
    (assignment_id, order_id, drone_id, assigned_at, assignment_status)
    VALUES (UUID(), in_order_id, candidate_drone, NOW(), 'pending');

    -- Create drone flight schedule
    INSERT INTO drone_flights
    (flight_id, drone_id, order_id, start_lat, start_lng, end_lat, end_lng, scheduled_start_at, status)
    SELECT 
        UUID(),
        candidate_drone,
        in_order_id,
        dl.latitude,
        dl.longitude,
        dest_lat,
        dest_lng,
        NOW(),
        'scheduled'
    FROM drones_location dl
    WHERE dl.drone_id = candidate_drone;

    COMMIT;
  ELSE
    ROLLBACK;
  END IF;

END$$
DELIMITER ;



-- Trigger: on new order → if drone delivery → enqueue for assignment
DROP TRIGGER IF EXISTS trg_orders_after_insert;
DELIMITER $$
CREATE TRIGGER trg_orders_after_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  IF NEW.delivery_mode = 'drone' THEN
    INSERT INTO drone_assignments 
      (assignment_id, order_id, drone_id, assigned_at, assignment_status)
    VALUES 
      (UUID(), NEW.order_id, '00000000-0000-0000-0000-000000000000', NOW(), 'pending');
  END IF;
END$$
DELIMITER ;

