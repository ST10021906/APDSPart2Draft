const {MongoClient} = require('mongodb')
const dotenv = require('dotenv')

dotenv.config()

const connstring = process.env.ATLAS_URI
const client = new MongoClient(connstring)

async function connect() 
{
    try
    {
        await client.connect()
        console.log('MongoDB connected successfully')
    }
    catch(e)
    {
        console.error(e)
    }
}

module.exports = {connect, client}