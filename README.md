# [mars26.com](https://mars26.com) 🚀

Open-source, high-resolution Mars explorer built using [ArcGIS](https://developers.arcgis.com/javascript/latest/).

Visit [mars26.com](https://mars26.com) to see the app in production, deployed via [netlify](https://www.netlify.com/).

## Local setup

To set up the app locally make sure to have the following:

- [Node.js](https://nodejs.org/en/) v14.X
- Running [mongoDB](https://www.mongodb.com/) instance
- Consumer key and secret for [Twitter OAuth](https://developer.twitter.com/en/docs/authentication/oauth-1-0a/obtaining-user-access-tokens)

Then run:

```bash
git clone git@github.com:mars-2026/mars26_com.git
cd mars26_com
npm i
cd functions
npm i
```

We also need to set the environmental variables for the backend. Inside the `./functions` directory run:

```
cp .env.example .env
```

Set the variables in your copied local `.env` file and edit the variables accordingly:

```
FRONTEND_URL=http://localhost:3000
PORT=8080
TWITTER_CONSUMER_KEY=<YOUR_TWITTER_CONSUMER_KEY>
TWITTER_CONSUMER_SECRET=<YOUR_TWITTER_CONSUMER_SECRET>
MONGODB_URI=<YOUR_MONGODB_URI>
```

Run the backend:

```bash
# Inside ./functions folder
npm run start
```

In another terminal run the frontend:

```bash
# Inside the root folder of the repository
npm run start
```

Done! Your local frontend should run on `localhost:3000` and the backend on `localhost:8080`.
