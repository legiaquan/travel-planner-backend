db = db.getSiblingDB('travel-planner');

db.createUser({
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: 'travel-planner',
    },
  ],
}); 