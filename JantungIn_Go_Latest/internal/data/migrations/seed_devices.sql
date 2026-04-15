-- Seed devices dengan realistic distribution:
-- - Mayoritas users (137) punya 1 device
-- - 10 users special yang punya 2-3 devices (power users/sharing)
-- - Devices RANDOM dari pool yang ada
-- - IPs RANDOM dari pool yang ada

WITH device_types AS (
    -- Android devices (60% - mayoritas di Indonesia)
    SELECT 1 as idx, 'Android' as device_type, 'Samsung Galaxy A53' as device_name,
           'Mozilla/5.0 (Linux; Android 13; SM-A5350 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36' as ua
    UNION ALL SELECT 2, 'Android', 'Xiaomi Redmi Note 12',
           'Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36'
    UNION ALL SELECT 3, 'Android', 'OPPO A77s',
           'Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36'
    UNION ALL SELECT 4, 'Android', 'Vivo Y72 5G',
           'Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36'
    UNION ALL SELECT 5, 'Android', 'Samsung Galaxy M33',
           'Mozilla/5.0 (Linux; Android 12; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36'

    -- iPhone/iOS (20%)
    UNION ALL SELECT 6, 'iPhone', 'iPhone 15 Pro',
           'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
    UNION ALL SELECT 7, 'iPhone', 'iPhone 14',
           'Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.7 Mobile/15E148 Safari/604.1'
    UNION ALL SELECT 8, 'iPhone', 'iPad Air',
           'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'

    -- Windows Desktop/Laptop (20%)
    UNION ALL SELECT 9, 'Windows', 'Windows 11 Chrome',
           'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36'
    UNION ALL SELECT 10, 'Windows', 'Windows 10 Firefox',
           'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
),
-- IP pools untuk simulate berbagai lokasi di Indonesia
ip_pool AS (
    SELECT 1 as idx, '192.168.1' as ip
    UNION ALL SELECT 2, '192.168.0'
    UNION ALL SELECT 3, '203.0.113'
    UNION ALL SELECT 4, '10.0.0'
    UNION ALL SELECT 5, '172.16.0'
),
-- Get user IDs dari database dengan ranking
user_list AS (
    SELECT id, name, row_number() OVER (ORDER BY created_at) as rn,
           (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users
    FROM users
    WHERE role = 'user'
),
-- Assign devices: mayoritas 1 device, 10 users punya 2-3 devices
user_device_assignment AS (
    SELECT
        ul.id as user_id,
        ul.name,
        ul.rn,
        ul.total_users,
        CASE
            -- 10 users terakhir (rn >= total - 9) → punya 2-3 devices
            WHEN ul.rn >= (ul.total_users - 9) THEN
                CASE WHEN (ul.rn % 2) = 0 THEN 3 ELSE 2 END
            -- Rest: 1 device
            ELSE 1
        END as num_devices,
        CASE
            WHEN ul.rn >= (ul.total_users - 9) THEN 'power_user'
            ELSE 'regular_user'
        END as user_category
    FROM user_list ul
),
-- Generate devices dengan RANDOM selection
generated_devices AS (
    SELECT
        gen_random_uuid() as device_id,
        uda.user_id,
        uda.name as user_name,
        uda.user_category,
        uda.num_devices,
        uda.rn,
        gs.device_num,
        -- Select random device dari pool (1-10)
        (SELECT device_type FROM device_types WHERE idx = ((uda.rn + gs.device_num) % 10) + 1 LIMIT 1) as device_type,
        (SELECT device_name FROM device_types WHERE idx = ((uda.rn + gs.device_num) % 10) + 1 LIMIT 1) as device_name,
        (SELECT ua FROM device_types WHERE idx = ((uda.rn + gs.device_num) % 10) + 1 LIMIT 1) as user_agent,
        -- Select random IP dari pool (1-5)
        (SELECT ip FROM ip_pool WHERE idx = ((uda.rn + gs.device_num + 2) % 5) + 1 LIMIT 1) as ip_address
    FROM user_device_assignment uda
    CROSS JOIN LATERAL generate_series(1, uda.num_devices) as gs(device_num)
),
-- Final processing dengan fingerprint
final_devices AS (
    SELECT
        device_id,
        user_id,
        user_name,
        user_agent,
        ip_address,
        md5(user_id::text || '|' || user_agent || '|' || ip_address)::text as device_fingerprint,
        CASE
            WHEN user_category = 'power_user' THEN NOW() - ((device_num - 1) * INTERVAL '6 hours')
            ELSE NOW() - (INTERVAL '30 days' + (INTERVAL '1 day' * ((rn % 30))))
        END as last_login,
        CASE
            WHEN user_category = 'power_user' THEN NOW() - ((device_num - 1) * INTERVAL '12 hours')
            ELSE NOW() - (INTERVAL '45 days' + (INTERVAL '1 day' * ((rn % 45))))
        END as created_at
    FROM generated_devices
)
INSERT INTO user_devices (id, user_id, user_agent, ip_address, device_fingerprint, last_login, created_at, updated_at)
SELECT device_id, user_id, user_agent, ip_address, device_fingerprint, last_login, created_at, last_login as updated_at
FROM final_devices
ON CONFLICT (user_id, device_fingerprint) DO UPDATE
SET last_login = EXCLUDED.last_login, updated_at = EXCLUDED.updated_at;

-- Reporting
DO $$
DECLARE
    total_devices INT;
    total_users INT;
    android_devices INT;
    ios_devices INT;
    windows_devices INT;
    power_users INT;
    regular_users INT;
BEGIN
    SELECT COUNT(*) INTO total_devices FROM user_devices;
    SELECT COUNT(DISTINCT user_id) INTO total_users FROM user_devices;
    SELECT COUNT(*) INTO android_devices FROM user_devices WHERE user_agent ILIKE '%Android%';
    SELECT COUNT(*) INTO ios_devices FROM user_devices WHERE user_agent ILIKE '%iPhone%' OR user_agent ILIKE '%iPad%';
    SELECT COUNT(*) INTO windows_devices FROM user_devices WHERE user_agent ILIKE '%Windows%';
    SELECT COUNT(*) INTO power_users FROM (SELECT DISTINCT user_id FROM user_devices GROUP BY user_id HAVING COUNT(*) > 1) t;
    SELECT COUNT(*) INTO regular_users FROM (SELECT DISTINCT user_id FROM user_devices GROUP BY user_id HAVING COUNT(*) = 1) t;

    RAISE NOTICE '';
    RAISE NOTICE '================================';
    RAISE NOTICE 'Device Seeding Summary';
    RAISE NOTICE '================================';
    RAISE NOTICE 'Total Devices: %', COALESCE(total_devices, 0);
    RAISE NOTICE 'Total Users with Devices: %', COALESCE(total_users, 0);
    RAISE NOTICE '';

    IF total_devices > 0 THEN
        RAISE NOTICE 'Device Types:';
        RAISE NOTICE '  - Android: % (%.1f%%)', android_devices, (android_devices::FLOAT / total_devices * 100);
        RAISE NOTICE '  - iOS: % (%.1f%%)', ios_devices, (ios_devices::FLOAT / total_devices * 100);
        RAISE NOTICE '  - Windows: % (%.1f%%)', windows_devices, (windows_devices::FLOAT / total_devices * 100);
        RAISE NOTICE '';
        RAISE NOTICE 'User Distribution:';
        RAISE NOTICE '  - Power Users (2-3 devices): %', COALESCE(power_users, 0);
        RAISE NOTICE '  - Regular Users (1 device): %', COALESCE(regular_users, 0);
        RAISE NOTICE '';
        RAISE NOTICE 'Useful Queries:';
        RAISE NOTICE '  SELECT u.name, COUNT(ud.id) as num_devices, STRING_AGG(DISTINCT ud.device_name, '', '') as devices FROM users u JOIN user_devices ud ON u.id = ud.user_id GROUP BY u.id, u.name HAVING COUNT(ud.id) > 1 ORDER BY num_devices DESC;';
        RAISE NOTICE '';
    ELSE
        RAISE NOTICE 'ERROR: No devices were seeded. Check if users table has data.';
    END IF;
    RAISE NOTICE '';
END $$;
