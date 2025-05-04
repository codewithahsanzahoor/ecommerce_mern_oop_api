# 🛒 E-Commerce Backend API – Build by OOP

A scalable, modular Express.js backend for an e-commerce application. This API includes product, user, and order routes with middleware support, request logging, and centralized error handling.

---

## 📌 Features

- 🚀 Express.js-based server
- 🧾 Modular route handling
- 🔐 Cookie parser integration
- 📄 Request logging via `morgan`
- 💥 Centralized global error handling
- 📦 JSON and URL-encoded data parsing

---

## 🧰 Tech Stack

- **Node.js**
- **Express.js**
- **Morgan** – HTTP request logger
- **Cookie-Parser** – for cookies
- **Custom Middleware** – for error handling

---






steps to initialize the backend project with typescript mern stack project
1. create a folder
2. create a package.json file with npm init -y
3. npm i -D typescript ts-node nodemon @types/node
4. npx tsc --init
5. initialize the git repo and create a readme.md file and create a gitignore file
6. add dev dev script in package.json file ["dev":"nodemon server.ts"]
7. setup eslint [npm init @eslint/config] and setup its rules
8. setup text formatter prettier extension and setup its rules in .prettierrc.json in root folder

9. setup express sever
    npm i express
    npm i -D @types/express

10. install dotenv
    npm i dotenv
    npm i -D @types/dotenv

11. setup morgan
    npm i morgan
    npm i -D @types/morgan

12. setup mongoose and mongodb
    npm i mongoose
    npm i -D @types/mongoose

13. setup global error handler
    by using errorhandler class

14. setup try catch block in every async function
    by using try catch block 
    and handle error by using error handler class


