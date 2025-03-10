const sqlite3 = require("sqlite3").verbose()
const sqlite = require("sqlite")

let db

async function makeConnection()
{
    db = await sqlite.open({
        filename: 'posts.db',
        driver: sqlite3.Database
    })
}

async function getAllPosts()
{
    const results = await db.all("SELECT rowid, * FROM Posts")
    return results
}

module.exports = {makeConnection, getAllPosts}