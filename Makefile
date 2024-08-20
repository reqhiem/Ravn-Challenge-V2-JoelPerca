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