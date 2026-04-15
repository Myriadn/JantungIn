-- Hapus admin user yang di-seed
DELETE FROM users
WHERE email = 'admin@jantungin.com'
  AND role = 'admin';
