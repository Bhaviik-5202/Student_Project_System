const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './backend/.env' });

async function main() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected successfully to server');
        const adminDb = client.db().admin();
        const dbs = await adminDb.listDatabases();
        console.log('Databases found:');
        dbs.databases.forEach(db => console.log(` - ${db.name}`));
    } catch (e) {
        console.error('Error listing databases:', e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
