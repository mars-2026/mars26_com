import { Collection, MongoClient } from "mongodb";

import config from "../config";

const DB_NAME = "mars26";

async function connectionDecorator(
  collectionName: string,
  func: (collection: Collection) => Promise<any>
) {
  const mongoClient = new MongoClient(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await mongoClient.connect();
    const db = mongoClient.db(DB_NAME);

    const collection = db.collection(collectionName);
    const result = await func(collection);
    return result;
  } finally {
    await mongoClient.close();
  }
}

export async function insertTweet(tweet: {
  tweetId: string;
  displayUrl: string;
  expandedUrl: string;
  latitude: number;
  longitude: number;
}) {
  return connectionDecorator("tweets", async (collection) => {
    await collection.insertOne(tweet);
  });
}

export async function getTweets(query: {
  latitudeFrom?: number;
  latitudeTo?: number;
  longitudeFrom?: number;
  longitudeTo?: number;
}) {
  return connectionDecorator("tweets", async (collection) => {
    const {
      latitudeFrom = -90,
      latitudeTo = 90,
      longitudeFrom = -180,
      longitudeTo = 180,
    } = query;
    const cursor = await collection.find({
      longitude: {
        $gte: longitudeFrom,
        $lte: longitudeTo,
      },
      latitude: {
        $gte: latitudeFrom,
        $lte: latitudeTo,
      },
    });

    return cursor.toArray();
  });
}

export async function upsertTokens(
  oauth_token: string,
  tokens: {
    oauth_token_secret?: string;
    oauth_access_token?: string;
    oauth_access_token_secret?: string;
  }
) {
  return connectionDecorator("tokens", async (collection) => {
    await collection.updateOne(
      {
        oauth_token,
      },
      {
        $set: {
          oauth_token,
          ...tokens,
        },
      },
      {
        upsert: true,
      }
    );
  });
}

export async function getTokens(oauth_token: string) {
  return connectionDecorator("tokens", async (collection) => {
    const tokensDoc = await collection.findOne({
      oauth_token,
    });
    return tokensDoc;
  });
}

export async function deleteTokens(oauth_token: string) {
  return connectionDecorator("tokens", async (collection) => {
    await collection.deleteOne({
      oauth_token,
    });
  });
}

const db = {
  insertTweet,
  getTweets,
  upsertTokens,
  getTokens,
  deleteTokens,
};

export default db;
