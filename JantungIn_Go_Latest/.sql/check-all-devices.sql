SELECT 
    COUNT(DISTINCT user_id) as total_users,
    COUNT(*) as total_devices,
    ROUND((COUNT(*)::NUMERIC / COUNT(DISTINCT user_id))::NUMERIC, 2) as avg_devices_per_user,
    COUNT(CASE WHEN user_agent ILIKE '%Android%' THEN 1 END) as android_count,
    COUNT(CASE WHEN user_agent ILIKE '%iPhone%' THEN 1 END) as ios_count,
    COUNT(CASE WHEN user_agent ILIKE '%Windows%' THEN 1 END) as windows_count
FROM user_devices;
