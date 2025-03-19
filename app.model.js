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
    await db.run("UPDATE Posts SET likes = likes + 1 WHERE rowid = ?", id);
}

async function getLikes(id) {
    const results = await db.run("SELECT likes FROM Posts WHERE rowid = ?", id)
    return results
}

async function sortByLatest() {
    return await db.all("SELECT * FROM Posts ORDER BY timestamp DESC")
}

async function sortByOldest() {
    return await db.all("SELECT * FROM Posts ORDER BY timestamp ASC")
}

async function sortByMostPopular() {
    return await db.all("SELECT * FROM Posts ORDER BY likes DESC");
}

async function sortByLeastPopular() {
    return await db.all("SELECT * FROM Posts ORDER BY likes ASC");
}

module.exports = {makeConnection, getAllPosts, createPost, incrementLikes, getLikes, sortByLatest, sortByOldest, sortByMostPopular, sortByLeastPopular}