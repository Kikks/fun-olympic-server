# FunOlympic Games API

This is the backend repository for the FunOlympic Games project.

The entrypoint to the application is contained within the index.js file. Unless specified otherwise, the application will run on port `5000`.

## Getting Started

First create a `.env` file in the root of the project with the following parameters:

```env
MERN=<replace with your mondo db url>
SECRET_KEY=<any random string, for creating token>
```

Next, start the server ny running the following comand in the terminal:

```bash
npm run start
# or
yarn start
```

If you plan to make changes and would want the server to reload when any change is made, you can run the development server by running the following commmand in the terminal:

```bash
npm run dev
# or
yarn dev
```

You can now make requests to the server at [http://localhost:5000](http://localhost:5000) with any client you wish to make calls from.

## REST API

The REST API to the application is described below:
[See API Documentation](./routes/README.md)
