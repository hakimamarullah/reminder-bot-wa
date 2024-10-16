import sqlite3 from 'sqlite3';

// Open the database
const db = new sqlite3.Database('./attendance.db', (err) => {
    if (err) {
        console.error('Error opening attendance.db:', err);
    } else {
        console.log('Connected to attendance.db');
    }
});

// Create the table with sender_id and name columns if it doesn't exist
db.run(
    'CREATE TABLE IF NOT EXISTS attendance_log (sender_id TEXT UNIQUE, name TEXT)',
    (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table created or already exists');
        }
    }
);

// Function to insert a sender_id and name
// Function to insert a sender_id and name
const insertSenderId = (senderId, name) => {
    return new Promise((resolve, reject) => {
        const insertStmt = db.prepare('INSERT INTO attendance_log(sender_id, name) VALUES (?, ?)', (err) => {
            if (err) {
                return reject('Error preparing insert statement: ' + err);
            }
        });

        insertStmt.run(senderId, name, function(err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    // Unique constraint error
                    return reject('UniqueConstraint');
                }
                return reject('Error inserting data: ' + err);
            } else {
                console.log('Data inserted successfully');
                resolve(this.lastID); // Return the ID of the inserted row
            }
        });

        insertStmt.finalize();
    });
};


// Function to select all sender_ids and names as an array of objects
const selectAllSenderIds = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT sender_id, name FROM attendance_log', [], (err, rows) => {
            if (err) {
                return reject('Error selecting data: ' + err);
            }
            const results = rows.map(row => ({ sender_id: row.sender_id, name: row.name })); // Map to objects
            resolve(results); // Return array of objects
        });
    });
};

// Export the functions
export { insertSenderId, selectAllSenderIds };

// Close the database on exit (if desired)
process.on('exit', () => {
    db.close();
});
