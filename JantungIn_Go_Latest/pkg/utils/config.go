package utils

import (
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	App      AppConfig
	Database DatabaseConfig
	Redis    RedisConfig
	JWT      JWTConfig
	SMTP     SMTPConfig
	CDN      CDNConfig
	Cors     CorsConfig
}

type AppConfig struct {
	Name            string
	Env             string
	Port            string
	Timezone        string
	ShutdownTimeout time.Duration
	EncryptionKey   string
}

type DatabaseConfig struct {
	Host            string
	Port            string
	User            string
	Password        string
	Name            string
	SSLMode         string
	MaxIdleConns    int
	MaxOpenConns    int
	ConnMaxLifetime time.Duration
}

type RedisConfig struct {
	Host      string
	Port      string
	Password  string
	DB        int
	SessionDB int
}

type JWTConfig struct {
	Secret             string
	AccessTokenExpire  time.Duration
	RefreshTokenExpire time.Duration
}

type SMTPConfig struct {
	Host      string
	Port      int
	Username  string
	Password  string
	FromEmail string
	FromName  string
}

type CDNConfig struct {
	APIURL       string
	CloudName    string
	APIKey       string
	APISecret    string
	UploadPreset string
}

type CorsConfig struct {
	AllowedOrigins []string
}

func LoadConfig() (*Config, error) {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	cfg := &Config{
		App: AppConfig{
			Name:            getEnv("APP_NAME", "My App"),
			Env:             getEnv("APP_ENV", "development"),
			Port:            getEnv("APP_PORT", "8080"),
			Timezone:        getEnv("APP_TIMEZONE", "Asia/Jakarta"),
			ShutdownTimeout: parseDuration("SHUTDOWN_TIMEOUT", "10s"),
			EncryptionKey:   getEnv("ENCRYPTION_KEY", "12345678901234567890123456789012"),
		},
		Database: DatabaseConfig{
			Host:            getEnv("DB_HOST", "localhost"),
			Port:            getEnv("DB_PORT", "5432"),
			User:            getEnv("DB_USER", "postgres"),
			Password:        getEnv("DB_PASSWORD", ""),
			Name:            getEnv("DB_NAME", "jantungin_db"),
			SSLMode:         getEnv("DB_SSLMODE", "disable"),
			MaxIdleConns:    getEnvInt("DB_MAX_IDLE_CONNS", 10),
			MaxOpenConns:    getEnvInt("DB_MAX_OPEN_CONNS", 100),
			ConnMaxLifetime: parseDuration("DB_CONN_MAX_LIFETIME", "1h"),
		},
		// Redis: RedisConfig{
		// 	Host:      getEnv("REDIS_HOST", "localhost"),
		// 	Port:      getEnv("REDIS_PORT", "6379"),
		// 	Password:  getEnv("REDIS_PASSWORD", ""),
		// 	DB:        getEnvInt("REDIS_DB", 0),
		// 	SessionDB: getEnvInt("REDIS_SESSION_DB", 1),
		// },
		JWT: JWTConfig{
			Secret:             getEnv("JWT_SECRET", "change-this-secret-key"),
			AccessTokenExpire:  parseDuration("JWT_ACCESS_TOKEN_EXPIRE", "15m"),
			RefreshTokenExpire: parseDuration("JWT_REFRESH_TOKEN_EXPIRE", "168h"), // 7 days
		},
		SMTP: SMTPConfig{
			Host:      getEnv("SMTP_HOST", "smtp.gmail.com"),
			Port:      getEnvInt("SMTP_PORT", 587),
			Username:  getEnv("SMTP_USERNAME", ""),
			Password:  getEnv("SMTP_PASSWORD", ""),
			FromEmail: getEnv("SMTP_FROM_EMAIL", "noreply@jantungin.com"),
			FromName:  getEnv("SMTP_FROM_NAME", "JantungIn no-reply"),
		},
		// CDN: CDNConfig{
		// 	APIURL:       getEnv("CDN_API_URL", ""),
		// 	CloudName:    getEnv("CDN_CLOUD_NAME", ""),
		// 	APIKey:       getEnv("CDN_API_KEY", ""),
		// 	APISecret:    getEnv("CDN_API_SECRET", ""),
		// 	UploadPreset: getEnv("CDN_UPLOAD_PRESET", ""),
		// },
		Cors: CorsConfig{
			AllowedOrigins: parseSlice("CORS_ALLOWED_ORIGINS", []string{"http://localhost:3000"}),
		},
	}

	// if err := cfg.Validate(); err != nil {
	// 	return nil, err
	// }

	return cfg, nil
}

// func (c *Config) Validate() error {
// 	if c.Database.Password == "" {
// 		return fmt.Errorf("DB_PASSWORD is required")
// 	}
// 	if c.JWT.Secret == "change-this-secret-key" && c.App.Env == "production" {
// 		return fmt.Errorf("JWT_SECRET must be changed in production")
// 	}
// 	return nil
// }

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func parseDuration(key, defaultValue string) time.Duration {
	value := getEnv(key, defaultValue)
	duration, err := time.ParseDuration(value)
	if err != nil {
		log.Printf("Warning: Invalid duration for %s, using default: %s", key, defaultValue)
		duration, _ = time.ParseDuration(defaultValue)
	}
	return duration
}

func parseSlice(key string, defaultValue []string) []string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return strings.Split(value, ",")
}
