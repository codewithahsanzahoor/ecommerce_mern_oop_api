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