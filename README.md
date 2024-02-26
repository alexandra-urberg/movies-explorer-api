# Movies-explorer-api
This is the final project/diploma for Yandex-Practicum Bootcamp(backend version).

The backend built to registrate and authorized user, update users information, choose a film from other server and add/delete to/from users wall.

**The following stack was used during development of the project:**
1. NodeJs
2. Express 
3. Mongo DB
4. Nodemon
5. Mongoose

**The protection is built up utilizing the following:**
1. helmet
2. cookies
3. .env(secret-key)
4. express Rate Limit
5. SSL(Secure Socket Layer)

Backend locatead at the subdomain. Due to that, the cors settings locatead at the server at the Nginx(default file). 
Backend setupted to automatic, constant work. In case of server reboat database and other stack will restart automatically.


**Startup commands**

To start the server
```sh
npm run start
```
or 
```sh
npm run dev
```

To start eslint
```sh
npm run lint
```


Prepared by
Alexandra Stepanova

