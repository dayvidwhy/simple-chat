# Simple Chat

![GitHub last commit](https://img.shields.io/github/last-commit/dayvidwhy/simple-chat)
![GitHub issues](https://img.shields.io/github/issues/dayvidwhy/simple-chat)
![GitHub pull requests](https://img.shields.io/github/issues-pr/dayvidwhy/simple-chat)
![GitHub](https://img.shields.io/github/license/dayvidwhy/simple-chat)

Simple chat implementation leveraging Remixjs for the frontend and Prisma ORM for SQLite database management.

## Features

- Real-time chat messages
- Easy setup with Remixjs and SQLite
- Lightweight and fast

## Install
Clone the repository and start development mode.
```bash
git clone git@github.com:dayvidwhy/simple-chat.git
cd simple-chat
npm i
npm run db:migrate
npm run dev
```

Project uses NVM for [node](https://github.com/nvm-sh/nvm) version. 

```bash
# Set node to 21
nvm use
```

## Usage
After installation, the application will be available on http://localhost:3000. Visit this URL in your web browser to start using the chat application.

## Database Configuration
The project uses SQLite, managed through Prisma. Here are some useful commands for database management:

```bash
# Migrate the db on schema change
npm run db:migrate

# View the db
npm run db:view
```