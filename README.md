# react-redux-pg-app

`react-redux-pg-app` is a sample TypeScript web application built on React,
Redux and PostgreSQL. The web application can be used to create and modify
users and user groups stored in two tables `user` and `user_group`,
respectively.  

The initialization script creates an admin user (and an admin group) which
can create other user groups and users. Other users may have group admin 
permissions which enables them to create other users in the same user group.
Group admin users may not create other user groups, though. A user may change
password and language, and update email, first name and last name.

The backend uses [koa](https://koajs.com/) to handle HTTP requests,
[io-ts](https://github.com/gcanti/io-ts) to validate request bodies and query
strings, and [pg-promise](https://github.com/vitaly-t/pg-promise) to run
SQL queries.

The frontend uses [React](https://reactjs.org/) and 
[React Bootstrap](https://react-bootstrap.github.io/) to render HTML and
[Redux](https://redux.js.org/) and 
[Redux Saga](https://github.com/redux-saga/redux-saga) for managing client-side state.

The sample application uses
[db-migrate](https://github.com/db-migrate/node-db-migrate) for database
migrations.

## Screenshots

<img src="https://github.com/tlaitinen/react-redux-pg-app/raw/master/screenshots/users.png" width=300>

<img src="https://github.com/tlaitinen/react-redux-pg-app/raw/master/screenshots/edit-user.png" width=300>

<img src="https://github.com/tlaitinen/react-redux-pg-app/raw/master/screenshots/edit-user-group.png" width=300>

## Quick start

```bash
git clone https://github.com/tlaitinen/react-redux-pg-app.git
npm install
./scripts/init-db-empty.sh
npm run dev-backend
```

In another terminal:
```bash
source ./scripts/postgres-env.sh
ADMIN_EMAIL=user@example.com ADMIN_PASSWORD=password npm run init 
npm run dev-frontend
```

Navigate to `http://localhost:8080`


