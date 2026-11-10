import mongoose from 'mongoose';

type MongooseCache = {
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var nietMongooseCache: MongooseCache | undefined;
}

const cache = global.nietMongooseCache ?? { promise: null };
global.nietMongooseCache = cache;

mongoose.connection.on('disconnected', () => {
  cache.promise = null;
});

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!cache.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not configured.');
    }

    cache.promise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB_NAME || 'NIETPharmacy',
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 8000,
      })
      .catch((error: unknown) => {
        cache.promise = null;
        throw error;
      });
  }

  return cache.promise;
}

export function serializeMongoDocument(
  _document: unknown,
  document: {
    _id: mongoose.Types.ObjectId;
    __v?: unknown;
    password?: unknown;
  }
) {
  const fields = Object.fromEntries(
    Object.entries(document).filter(([key]) => !['_id', '__v', 'password'].includes(key))
  );
  return {
    ...fields,
    id: document._id.toString(),
  };
}
