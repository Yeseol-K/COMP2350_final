const database = include('/databaseConnection');

async function getAllUsers() {
    let sqlQuery = `
        SELECT 
        author_id,
        first_name,
        last_name,
        DATE_FORMAT(birth_date, '%M, %d %Y') AS 'Birth_Date', 
        (SELECT COUNT(*) FROM book WHERE book.author_id = author.author_id) AS 'num_of_books' 
        FROM author;
    `;
    
    try {
        const results = await database.query(sqlQuery);
        console.log("-----------------------")
        console.log("results: ", results[0]);
        console.log("-----------------------")
        return results[0];
    }
    catch (err) {
        console.log("Error selecting from author table");
        console.log(err);
        return null;
    }
}

async function addUser(postData) {
    console.log("postData: ", postData);

    let sqlInsertSalt = `
        INSERT INTO author (first_name, last_name, birth_date)
        VALUES (:first_name, :last_name, :birth_date);
    `;

    let params = {
        first_name: postData.first_name,
        last_name: postData.last_name,
        birth_date: postData.birth_date,
    };

    console.log(sqlInsertSalt);

    try {
        const results = await database.query(sqlInsertSalt, params);
        // console.log('result: ', results);
        // let insertedID = results.insertId;
        // let updatePasswordHash = `
        //     UPDATE author
        //     SET password_hash = sha2(concat(:password,:pepper,password_salt),512)
        //     WHERE web_user_id = :userId;
        // `;

        // let params2 = {
        //     userId: insertedID
        // };

        // console.log(updatePasswordHash);

        // const results2 = await database.query(updatePasswordHash, params2);

        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

async function deleteUser(webUserId) {
    console.log('websUserId?: ', webUserId);
    let sqlDeleteUser = `
        DELETE FROM author
        WHERE author_id = :userID
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

async function showBooks(authorId) {
    let sqlQuery = `
        SELECT *
        FROM book
        WHERE author_id = ${authorId};
    `;

    try {
        const results = await database.query(sqlQuery);
        console.log("-----------------------")
        console.log("book data: ", results[0]);
        console.log("-----------------------")
        return results[0];
    }
    catch (err) {
        console.log("Error selecting from author table");
        console.log(err);
        return null;
    }
}


async function addBook(newBook, authorId) {
    console.log("postData: ", newBook, authorId);

    let sqlInsertSalt = `
        INSERT INTO book (title, description, ISBN, author_id)
        VALUES (:title, :description, :ISBN, ${authorId.id});
    `;

    let params = {
        title: newBook.title,
        description: newBook.description,
        ISBN: newBook.ISBN,
    };

    console.log(sqlInsertSalt);

    try {
    
        await database.query(sqlInsertSalt, params);

        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

async function get_user_by_userId(userId) {
    let sqlGetUser = `
        SELECT first_name, last_name
        FROM author
        WHERE author_id = ${userId};
    `

    let params = {
        userId: userId,
    }

    try {
        const authorName = await database.query(sqlGetUser, params)
        return authorName[0];
    } catch(err) {
        console.log(err)
        return false;
    }
}

async function deleteBook(bookId) {
    console.log(bookId);
    let sqlDeleteBook = `
        DELETE FROM book
        WHERE book_id = :bookId;
    `;
    let params = {
        bookId: bookId,
    };
    console.log(sqlDeleteBook);
    try {
        await database.query(sqlDeleteBook, params);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = { getAllUsers, addUser, deleteUser, showBooks, addBook, deleteBook, get_user_by_userId };
