const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("posts.db");

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS PostHashtags");
    db.run("DROP TABLE IF EXISTS Posts");
    db.run("DROP TABLE IF EXISTS Hashtags");

    // Create Posts Table
    db.run(`CREATE TABLE Posts (
        ID INTEGER PRIMARY KEY AUTOINCREMENT, 
        post TEXT NOT NULL, 
        timestamp TIMESTAMP NOT NULL, 
        likes INTEGER DEFAULT 0
    )`);

    // Create Hashtags Table
    db.run(`CREATE TABLE Hashtags (
        ID INTEGER PRIMARY KEY AUTOINCREMENT, 
        hashtag TEXT UNIQUE NOT NULL
    )`);

    // Create Junction Table (PostHashtags)
    db.run(`CREATE TABLE PostHashtags (
        post_id INTEGER, 
        hashtag_id INTEGER, 
        FOREIGN KEY (post_id) REFERENCES Posts(ID) ON DELETE CASCADE, 
        FOREIGN KEY (hashtag_id) REFERENCES Hashtags(ID) ON DELETE CASCADE
    )`);
});

// Data Array
const posts = [
    { post: "I am so tired of pretending everything is fine. My friends think I am okay, but I am falling apart inside. It feels like no one would understand if I told them the truth.", hashtags: "tired,mentalhealth,truth", timestamp: "2024-12-24 10:34:09" },
    { post: "I miss the old version of me. Somewhere along the way, I lost myself. Now, I do not know who I am anymore, and it is so hard to find a way back.", hashtags: "lost,trying,selfdiscovery", timestamp: "2024-12-26 10:30:09" },
    { post: " do not know how much longer I can keep pushing forward. Every day feels like a battle, but no one can see it. I just need to be heard.", hashtags: "tired,battle,struggle", timestamp: "2025-01-12 12:02:09" },
    { post: "I feel like I am constantly letting everyone down. No matter how hard I try, it never feels like enough, and I do not know how to change that.", hashtags: "trying,frustrated,anxiety", timestamp: "2025-01-13 12:02:09" },
    { post: "I wish I could go back in time and make better choices. Maybe then I would not feel so lost and regretful. But I cannot undo the past.", hashtags: "regret,lost,past", timestamp: "2025-01-15 11:02:09" },
    { post: "Some days, I feel like I am invisible. Like I am just going through the motions and no one notices. It is like I do not even exist to some people.", hashtags: "numb,invisible,lonely", timestamp: "2025-01-16 11:02:09" }
];

// Function to insert a post and get its ID
function insertPost(post, timestamp, hashtags) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO Posts (post, timestamp, likes) VALUES (?, ?, ?)", [post, timestamp, 0], function (err) {
            if (err) reject(err);
            else resolve({ postId: this.lastID, hashtags });
        });
    });
}

// Function to insert a hashtag and get its ID
function insertHashtag(tag) {
    return new Promise((resolve, reject) => {
        db.run("INSERT OR IGNORE INTO Hashtags (hashtag) VALUES (?)", [tag], function (err) {
            if (err) reject(err);
            else {
                db.get("SELECT ID FROM Hashtags WHERE hashtag = ?", [tag], (err, row) => {
                    if (err) reject(err);
                    else resolve(row.ID);
                });
            }
        });
    });
}

// Function to link a post and a hashtag
function linkPostHashtag(postId, hashtagId) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO PostHashtags (post_id, hashtag_id) VALUES (?, ?)", [postId, hashtagId], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

// Insert all posts and link hashtags
async function insertData() {
    for (const { post, hashtags, timestamp } of posts) {
        try {
            const { postId, hashtags: hashtagString } = await insertPost(post, timestamp, hashtags);
            const hashtagArray = hashtagString.split(",").map(tag => tag.trim());

            for (const tag of hashtagArray) {
                const hashtagId = await insertHashtag(tag);
                await linkPostHashtag(postId, hashtagId);
            }
        } catch (error) {
            console.error("Error inserting data:", error);
        }
    }
    console.log("Database setup complete.");
    db.close();
}

insertData();
