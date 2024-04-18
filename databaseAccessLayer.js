const database = include("/databaseConnection");

async function getAllItem() {
  let sqlQuery = `
	SELECT 
    purchase_item_id,
    item_name,
    item_description,
    FORMAT(cost, 4) AS cost,
    quantity
    FROM purchase_item;

	`;

  try {
    const results = await database.query(sqlQuery);
    //console.log(" re : ")
    //console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error selecting from puchase_item table");
    console.log(err);
    return null;
  }
}

const addItem = async (postData) => {
  console.log("postData: ", postData);

  let sqlInsertItem = `
        INSERT INTO purchase_item (item_name, item_description, cost, quantity)
        VALUES (?, ?, ?, ?);
    `;

  let params = [postData.item_name, postData.item_description, postData.cost, postData.quantity];

  try {
    const results = await database.query(sqlInsertItem, params);
    console.log("Inserted item with ID:", results.insertId);
    return results;
  } catch (err) {
    console.error("Error inserting into purchase_item table", err);
    throw err;
  }
};

const deleteItem = async (itemId) => {
  let sqlDeleteItem = `
        DELETE FROM purchase_item WHERE purchase_item_id = ?;
    `;

  try {
    const results = await database.query(sqlDeleteItem, [itemId]);
    return results.affectedRows > 0;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const increaseItemQuantity = async (itemId) => {
  let sqlUpdateQuery = `
        UPDATE purchase_item
        SET quantity = quantity + 1
        WHERE purchase_item_id = ?;
    `;

  try {
    const results = await database.query(sqlUpdateQuery, [itemId]);
    console.log("Increased quantity of item with ID:", itemId);
    return results;
  } catch (err) {
    console.error("Error increasing item quantity in MySQL", err);
    throw err;
  }
};

const decreaseItemQuantity = async (itemId) => {
  let sqlUpdateQuery = `
        UPDATE purchase_item
        SET quantity = quantity - 1
        WHERE purchase_item_id = ?;
    `;

  try {
    const results = await database.query(sqlUpdateQuery, [itemId]);
    console.log("decreased quantity of item with ID:", itemId);
    return results;
  } catch (err) {
    console.error("Error increasing item quantity in MySQL", err);
    throw err;
  }
};

module.exports = { getAllItem, addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity };
