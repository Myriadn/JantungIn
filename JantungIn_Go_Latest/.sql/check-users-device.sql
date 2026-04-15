SELECT 
    u.name,
    u.role,
    COUNT(ud.id) as device_count,
    STRING_AGG(DISTINCT 
        CASE 
            WHEN ud.user_agent ILIKE '%Android%' THEN 'Android'
            WHEN ud.user_agent ILIKE '%iPhone%' OR ud.user_agent ILIKE '%iPad%' THEN 'iOS'
            WHEN ud.user_agent ILIKE '%Windows%' THEN 'Windows'
            WHEN ud.user_agent ILIKE '%Mac%' THEN 'macOS'
            ELSE 'Other'
        END, 
        ', ' ORDER BY 
        CASE 
            WHEN ud.user_agent ILIKE '%Android%' THEN 'Android'
            WHEN ud.user_agent ILIKE '%iPhone%' OR ud.user_agent ILIKE '%iPad%' THEN 'iOS'
            WHEN ud.user_agent ILIKE '%Windows%' THEN 'Windows'
            WHEN ud.user_agent ILIKE '%Mac%' THEN 'macOS'
            ELSE 'Other'
        END
    ) as device_types,
    MIN(ud.created_at) as first_login,
    MAX(ud.last_login) as last_login
FROM users u
JOIN user_devices ud ON u.id = ud.user_id
WHERE u.role = 'user'
GROUP BY u.id, u.name, u.role
HAVING COUNT(ud.id) > 1
ORDER BY device_count DESC
LIMIT 10;
