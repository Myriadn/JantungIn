SHELL := powershell.exe
.SHELLFLAGS := -NoProfile -Command

APP_DIR := JantungIn_Go_Latest

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
