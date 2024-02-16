const database = include('/databaseConnection');

async function getAllUsers() {
    let sqlQuery = `
        SELECT web_user_id, first_name, last_name, email
        FROM web_user;
    `;
    
    try {
        const results = await database.query(sqlQuery);
        console.log("results: ", results[0]);
        return results[0];
    }
    catch (err) {
        console.log("Error selecting from todo table");
        console.log(err);
        return null;
    }
}

const passwordPepper = "SeCretPeppa4MySal+";

async function addUser(postData) {
    console.log("postData: ", postData);

    let sqlInsertSalt = `
        INSERT INTO web_user (first_name, last_name, email, password_salt)
        VALUES (:first_name, :last_name, :email, sha2(UUID(),512));
    `;

    let params = {
        first_name: postData.first_name,
        last_name: postData.last_name,
        email: postData.email
    };

    console.log(sqlInsertSalt);

    try {
        const results = await database.query(sqlInsertSalt, params);
        let insertedID = results.insertId;
        let updatePasswordHash = `
            UPDATE web_user
            SET password_hash = sha2(concat(:password,:pepper,password_salt),512)
            WHERE web_user_id = :userId;
        `;

        let params2 = {
            password: postData.password,
            pepper: passwordPepper,
            userId: insertedID
        };

        console.log(updatePasswordHash);

        const results2 = await database.query(updatePasswordHash, params2);

        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

async function deleteUser(webUserId) {
    let sqlDeleteUser = `
        DELETE FROM web_user
        WHERE web_user_id = :userID
    `;
    let params = {
        userID: webUserId
    };
    console.log(sqlDeleteUser);
    try {
        await database.query(sqlDeleteUser, params);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = { getAllUsers, addUser, deleteUser };
