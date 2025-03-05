INSERT INTO locations (name, address, phone, url, court_type, pricing_info, created_at, updated_at)
VALUES
  (
    'Paddle Taps', 
    '535 Lakeview Plaza Blvd Worthington, Ohio 43085', 
    '(614) 368-6188', 
    'https://www.pbtaps.com/', 
    'indoor', 
    'Open play between $0 and $20 per hour depending on membership level, court reservation between $0 and $20 per hour depending on membership level', 
    NOW(), 
    NOW()
  ),
  (
    'Pickle and Chill', 
    '880 W Henderson Rd Columbus, Ohio 43214', 
    '(205) 354-6809 (txt)', 
    'https://pickleandchill.com/', 
    'indoor/outdoor', 
    'Open play $16 (non-members) or $11 (members). Court reservations $15 (non-members) or $10 (members) per hour.', 
    NOW(), 
    NOW()
  );