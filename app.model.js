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

async function createPost(post, hashtags, timestamp) {
    await db.run("INSERT INTO Posts (post, hashtags, timestamp, likes) VALUES (?, ?, ?, 0)",
        [post, hashtags, timestamp]
    )
}   

async function incrementLikes(id) {
    const results = await db.all("UPDATE Posts SET likes = likes + 1 WHERE ID = ?", id)
    return results
}

async function getLikes(id) {
    const results = await db.all("SELECT likes FROM Posts WHERE id = ?", id)
    return results
}

module.exports = {makeConnection, getAllPosts, createPost, incrementLikes, getLikes}