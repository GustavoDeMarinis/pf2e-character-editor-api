# Pathfinder 2e Character Editor

## 📜 Project Overview
Pathfinder 2e Character Editor is a backend API designed to help players manage their Pathfinder character sheets, inventory, and bonuses with ease. Many existing apps struggle to handle character stats, bonuses, and inventories properly, making character maintenance confusing. This tool simplifies character tracking, ensuring players don’t forget important modifiers or bonuses during gameplay.

## 🎯 Target Audience
This project is for **Pathfinder 2e players** who want a **virtual tool** to assist with character management in their campaigns.

## ✨ Features
- Create and manage Pathfinder 2e characters.
- Track inventory, character sheets, and bonuses.
- Create homebrew assets with structured yet flexible rules.
- REST API to interact with characters, classes, weapons, armor, and more.

## 🛠️ Technologies Used
- **Backend:** Node.js v20, Express.js
- **Database:** PostgreSQL, Prisma ORM
- **Language:** TypeScript

## 🚀 Installation & Setup
To run the project locally:

```sh
git clone <repo-url>
cd pathfinder-2e-character-editor
ask gustadema@gmail.com for .env file or generate your own credentials.
npm install
docker-compose up
npx prisma generate
npx prisma migrate reset
npm start
```

## 🔗 API Endpoints
**Base URL:** `http://localhost:5000`

### Authentication
- `POST /auth/signUp` → Create a user account
- `POST /auth/signIn` → Login to receive an authentication token
- `PATCH /auth/password/{userId}` → Change a user's password

### Armor Base
- `GET /armor-base/` → Get all armor bases
- `GET /armor-base/{armorBaseId}` → Get a specific armor base
- `POST /armor-base/` → Create a new armor base
- `PATCH /armor-base/{armorBaseId}` → Update an armor base
- `DELETE /armor-base/{armorBaseId}` → Delete an armor base

Similar CRUD patterns exist for:
- **Weapon Base**
- **Ancestry**
- **Character**
- **Character Class**
- **Language**

### User API
- `PATCH /users/{userId}` → Update user information (excluding password)

## 🛠️ How to Use
- Connect a frontend application or use API tools like **Postman** or **Swagger**.
- Swagger documentation is available at:
  ```
  http://localhost:{port}/api-docs/
  ```

## 📝 Contribution
Currently, contributions are **not open** to the public.

## 🛠️ Reporting Issues
If you encounter any issues or have suggestions, please open an issue on **GitHub Issues**.

