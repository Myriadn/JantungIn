include .env

SHELL := pwsh.exe
.SHELLFLAGS := -NoProfile -Command

DB_URL := postgresql://$(strip $(DB_USER)):$(strip $(DB_PASSWORD))@$(strip $(DB_HOST)):$(strip $(DB_PORT))/$(strip $(DB_NAME))?sslmode=$(strip $(DB_SSLMODE))

APP_DIR := JantungIn_Go_Latest
ML_DIR := JantungIn_ML

.PHONY: run stop

run:
	@echo "Starting JantungIn Backend..."
	@cd $(APP_DIR) ; go run main.go

sync:
	@echo "Syncing Module..."
	@cd $(APP_DIR) ; go mod tidy

clean:
	@echo "Cleaning Cache..."
	@cd $(APP_DIR) ; go clean

# make db-go name=create_users_table
db-go:
	@echo "Creating file migrations..."
	migrate create -ext sql -dir $(APP_DIR)/internal/data/migrations -seq $(name)

db-up:
	@echo "Migrations to $(DB_NAME)..."
	migrate -path $(APP_DIR)/internal/data/migrations -database "$(DB_URL)" -verbose up

db-down:
	@echo "Rolling back $(DB_NAME)..."
	migrate -path $(APP_DIR)/internal/data/migrations -database "$(DB_URL)" down 1

ml-run:
	@echo "Machine is learning...."
	cd $(ML_DIR) ; uv run main.py
