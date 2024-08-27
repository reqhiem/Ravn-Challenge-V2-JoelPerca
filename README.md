# Sip & Savor Store

This project is a NestJS application that provides a backend for a online shop. It utilizes the NestJS framework, which is a progressive Node.js framework for building efficient, scalable, and maintainable server-side applications.

The project setup is simple. Just navigate to the project directory and run the following command to install the dependencies:


## Install dependencies &  Setup

```bash
$ pnpm install
```

Once the dependencies are installed, you can compile and run the project using the following commands:

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev
```

## Usage

The project is deployed and ready to use in https://api.sipandsavor.reqhiem.lat/api/v1

## Swagger docs

The swagger docs are available in https://api.sipandsavor.reqhiem.lat/api/v1/docs

## Coverage

### Technical requirements
| Mandatory Features | Status |
|--------------------|--------|
| R1. Authentication endpoints (sign up, sign in, sign out) | ✅ |
| R2. List products with pagination | ✅ |
| R3. Search products by category | |
| R4. Add 2 kind of users (Manager, Client) | ✅ |
| **As a Manager I can**   |
| R5. Create products | ✅ |
| R6. Update products | ✅ |
| R7. Delete products | ✅ |
| R8. Disable products | ✅ |
| R9. Show client orders | ✅ |
| R10. Upload images per product | ✅ |
| **As a Client I can**: |
| R11.  See products | ✅ |
| R12. See the product details | ✅ |
| R13. Buy products | ✅ |
| R14. Add products to cart | ✅ |
| R15. Like products | ✅ |
| R16. Show my order | ✅ |
| R18. The product information (including images) should be visible for logged and not logged users | ✅ |
| R19. Swagger/Postman documentation | ✅ |
| R20. Tests, with at least 80% coverage | |
| **Extra Points** |
| R21. Add forgot password functionality | ✅ |
| R22. Send an email when the user changes the password | ✅ |
| R23. Deployed on a VPS with custom domain | ✅ |



