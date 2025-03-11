const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("posts.db");

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS Posts");

    // Create Posts Table
    db.run(`CREATE TABLE Posts (
        post TEXT NOT NULL, 
        hashtags TEXT UNIQUE NOT NULL,
        timestamp TIMESTAMP NOT NULL, 
        likes INTEGER DEFAULT 0
    )`);

    // Data Array
    const posts = [
        { post: "I am so tired of pretending everything is fine. My friends think I am okay, but I am falling apart inside. It feels like no one would understand if I told them the truth.", hashtags: "tired,mentalhealth,truth", timestamp: "2024-12-24 10:34:09" },
        { post: "I miss the old version of me. Somewhere along the way, I lost myself. Now, I do not know who I am anymore, and it is so hard to find a way back.", hashtags: "lost,trying,selfdiscovery", timestamp: "2024-12-26 10:30:09" },
        { post: "I do not know how much longer I can keep pushing forward. Every day feels like a battle, but no one can see it. I just need to be heard.", hashtags: "tired,battle,struggle", timestamp: "2025-01-12 12:02:09" },
        { post: "I feel like I am constantly letting everyone down. No matter how hard I try, it never feels like enough, and I do not know how to change that.", hashtags: "trying,frustrated,anxiety", timestamp: "2025-01-13 12:02:09" },
        { post: "I wish I could go back in time and make better choices. Maybe then I would not feel so lost and regretful. But I cannot undo the past.", hashtags: "regret,lost,past", timestamp: "2025-01-15 11:02:09" },
        { post: "Some days, I feel like I am invisible. Like I am just going through the motions and no one notices. It is like I do not even exist to some people.", hashtags: "numb,invisible,lonely", timestamp: "2025-01-16 11:02:09" }
    ];

    // Insert posts into the table
    posts.forEach(({ post, hashtags, timestamp }) => {
        db.run("INSERT INTO Posts (post, hashtags, timestamp, likes) VALUES (?, ?, ?, ?)", [post, hashtags, timestamp, 0], function (err) {
            if (err) {
                console.error("Error inserting post:", err);
            } else {
                console.log("Inserted post with ID:", this.lastID);
            }
        });
    });

});

db.close();

