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

async function getHashtags()
{
    const query = `
        SELECT Posts.ID, Posts.post, Posts.timestamp, Posts.likes, 
        IFNULL(GROUP_CONCAT(Hashtags.hashtag), '') AS hashtags
        FROM Posts
        LEFT JOIN PostHashtags ON Posts.ID = PostHashtags.post_id
        LEFT JOIN Hashtags ON PostHashtags.hashtag_id = Hashtags.ID
        GROUP BY Posts.ID
        ORDER BY timestamp DESC;`

    
    const results = db.all(query, [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
    
            // Convert the hashtag string to an array for proper Mustache rendering
            rows.forEach(post => {
                post.hashtags = post.hashtags ? post.hashtags.split(",") : [];
            });
    
            res.json(rows);
        });
    return results
}

module.exports = {makeConnection, getAllPosts, getHashtags}