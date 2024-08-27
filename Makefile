INFRASTRUCTURE_DIR := infra

.phony: resources
resources:
	- cd $(INFRASTRUCTURE_DIR) && docker compose up -d

.phony: stop
stop:
	- cd $(INFRASTRUCTURE_DIR) && docker compose stop

# Prisma commands

.phony: format-prisma
format-prisma:
	- pnpm dlx prisma format

.phony: migrate
migrate:
	- pnpm dlx prisma migrate dev --name $(name)

.phony: hw
hw:
	- echo "Hello World $(name)"

.phony: run-prod
run-prod:
	- cd $(INFRASTRUCTURE_DIR) && docker compose -f docker-compose.prod.yaml up --build

.phony: stop-prod
stop-prod:
	- cd $(INFRASTRUCTURE_DIR) && docker compose -f docker-compose.prod.yaml stop