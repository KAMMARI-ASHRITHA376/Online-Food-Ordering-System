# telemetry_generator.py
# Generates synthetic telemetry rows and prints CSV lines (or inserts via MySQL connector)
# Use for testing ingestion throughput and seed telemetry for drone flights.

import time
import uuid
import random
from datetime import datetime

# If you want to insert directly into MySQL, uncomment and configure the connector section below
# import mysql.connector
# DB_CONFIG = {
#     'host': 'localhost',
#     'user': 'root',
#     'password': '',
#     'database': 'foodonic'
# }

# Sample drone and flight IDs (you can replace these with real ones from the DB)
FLIGHT_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
DRONE_IDS = [
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555'
]

# Change base_lat/base_lng to your test area (Hyderabad example)
BASE_LAT = 17.4450
BASE_LNG = 78.3489

def random_point_near(lat, lng, meters):
    """Return a lat/lng randomly within +/- meters of given point (approx)."""
    # very rough conversion: 1 deg ~ 111km
    deg = meters / 111000.0
    return lat + random.uniform(-deg, deg), lng + random.uniform(-deg, deg)

def generate_row(flight_id, lat, lng):
    return {
        'flight_id': flight_id,
        'timestamp': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
        'lat': round(lat, 6),
        'lng': round(lng, 6),
        'altitude_meters': round(random.uniform(10, 120), 2),
        'speed_m_s': round(random.uniform(5, 20), 2),
        'battery_pct': random.randint(20, 100),
        'heading_deg': round(random.uniform(0, 360), 2),
        'payload_weight_grams': random.randint(0, 1500),
        'signal_strength_dbm': random.randint(-100, -50)
    }

def print_csv_line(row):
    csv_line = f"{row['flight_id']},{row['timestamp']},{row['lat']},{row['lng']},{row['altitude_meters']},{row['speed_m_s']},{row['battery_pct']},{row['heading_deg']},{row['payload_weight_grams']},{row['signal_strength_dbm']}"
    print(csv_line)

def main(rows=500, delay_sec=0.01):
    """
    Generate `rows` telemetry lines and print to stdout.
    delay_sec controls approximate rate (0.01 -> ~100 rows/sec).
    """
    base_flight = FLIGHT_ID
    for i in range(rows):
        # pick a drone/flight id for variety (rotate)
        flight_idx = i % len(DRONE_IDS)
        flight_id = DRONE_IDS[flight_idx]
        lat, lng = random_point_near(BASE_LAT, BASE_LNG, 2000)  # within ~2km
        row = generate_row(flight_id, lat, lng)
        print_csv_line(row)
        time.sleep(delay_sec)

if __name__ == '__main__':
    # Default: generate 500 rows at ~100 rows/sec
    main(rows=500, delay_sec=0.01)
