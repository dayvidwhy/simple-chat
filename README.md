# Simple Chat
Simple chat implementation.

Application leverages:
* Remixjs for the application
* Prisma as the ORM to talk to SQLite

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

## Database
Project is using SQLite via Prisma.

Some useful commands:
```bash
# Migrate the db on schema change
npm run db:migrate

# View the db
npm run db:view
```