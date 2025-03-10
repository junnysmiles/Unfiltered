const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("posts.db");

db.serialize(function() {
    // Drop table if it exists
    db.run("DROP TABLE IF EXISTS Posts", function(err) {
        if (err) {
            console.error("Error dropping table:", err);
        }
    });

    // Create Posts Table with a 'likes' column
    db.run("CREATE TABLE IF NOT EXISTS Posts (ID INTEGER PRIMARY KEY AUTOINCREMENT, post TEXT NOT NULL, hashtags TEXT NOT NULL, timestamp TIMESTAMP NOT NULL, likes INTEGER DEFAULT 0)", function(err) {
        if (err) {
            console.error("Error creating table:", err);
        }
    });

    // Insert some records into the Posts table
    const posts = [
        ["I'm so tired of pretending everything is fine. My friends think I'm okay, but I'm falling apart inside. It feels like no one would understand if I told them the truth.", "tired, the truth", "2024-12-24 10:34:09"],
        ["I miss the old version of me. Somewhere along the way, I lost myself. Now, I don’t know who I am anymore, and it’s so hard to find a way back.", "lost, trying", "2024-12-26 10:30:09"],
        ["I don't know how much longer I can keep pushing forward. Every day feels like a battle, but no one can see it. I just need to be heard.", "tired, battle", "2025-01-12 12:02:09"],
        ["I feel like I'm constantly letting everyone down. No matter how hard I try, it never feels like enough, and I don't know how to change that.", "trying, frustrated", "2025-01-13 12:02:09"],
        ["I wish I could go back in time and make better choices. Maybe then I wouldn't feel so lost and regretful. But I can't undo the past.", "regret, lost", "2025-01-15 11:02:09"],
        ["Some days, I feel like I’m invisible. Like I’m just going through the motions and no one notices. It’s like I don’t even exist to some people.", "numb, invisible", "2025-01-16 11:02:09"]
    ];

    // Insert each post record into the Posts table
    posts.forEach(function(post) {
        db.run("INSERT INTO Posts (post, hashtags, timestamp) VALUES (?, ?, ?)", post, function(err) {
            if (err) {
                console.error("Error inserting data:", err);
            }
        });
    });
});
