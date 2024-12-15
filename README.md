# The Go Game Todo Test API

## Before run this api

Create a .env file run this command:

```
cp .env.example .env
```

Fill the Port, JWT key and Firebase fields to connect the Database. You must create a new project in your Firebase console, create a Firebase Database, and download the file config to run the project. Finally, enter in a string array, the urls or ip addresses to allow connection with the API.

## Install dependencies

```
npm install
```

## Run project

```
npm run dev
```

## Run in production

```
npm run build
npm start
```

## API Documentation

Local Machine example:

http://localhost:8080/api-docs

Remote example:

https://example.tk/api-docs