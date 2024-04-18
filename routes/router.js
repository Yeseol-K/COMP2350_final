const express = require("express");
const bodyParser = require("body-parser");
const router = require("express").Router();
const database = include("databaseConnection");
const dbModel = include("databaseAccessLayer");
//const dbModel = include('staticData');

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  console.log("page hit");

  try {
    const result = await dbModel.getAllItem();
    //console.log(`result : `)
    //console.log(result);
    res.render("index", { allItem: result });

    //Output the results of the query to the Heroku Logs
    console.log(result);
  } catch (err) {
    res.render("error", { message: "Error reading from MySQL" });
    console.log("Error reading from mysql");
  }
});

router.post("/addItem", async (req, res) => {
  console.log("POST hit on /addItem");

  try {
    const postData = {
      item_name: req.body.name,
      item_description: req.body.description,
      cost: req.body.cost,
      quantity: req.body.quantity,
    };
    // console.log("post data : ")
    // console.log(postData)
    const addResult = await dbModel.addItem(postData);
    console.log(`Add item result: `);
    console.log(addResult);

    if (addResult) {
      res.redirect("/");
    } else {
      throw new Error("Failed to add new Item");
    }
  } catch (err) {
    console.error("Error adding new Item to MySQL", err);
    res.render("error", { message: "Error adding new Item to MySQL" });
  }
});

router.get("/deleteItem", async (req, res) => {
  const itemId = req.query.id;
  if (!itemId) {
    return res.status(400).send("item ID is required");
  }

  try {
    const deleteResult = await dbModel.deleteItem(itemId);
    if (deleteResult) {
      console.log(`Deleted Item with ID: ${itemId}`);
    } else {
      console.log(`Item with ID: ${itemId} not found or could not be deleted`);
    }
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting Item from MySQL", err);
    res.status(500).send("Error deleting Item");
  }
});

router.get("/increase", async (req, res) => {
  console.log("GET: incrase");
  const itemId = req.query.id;
  console.log(`itemId : ${itemId}`);
  if (!itemId) {
    res.render("error", { message: "missing item id" });
  }

  try {
    const results = await dbModel.increaseItemQuantity(itemId);
    console.log(results);
    res.redirect("/");
  } catch (err) {
    console.error("Error increase item from MySQL", err);
    res.render("error", { message: "Error increase item" });
  }
});

router.get("/decrease", async (req, res) => {
  console.log("GET: decrease");
  const itemId = req.query.id;
  console.log(`itemId : ${itemId}`);
  if (!itemId) {
    res.render("error", { message: "missing item id" });
  }

  try {
    const results = await dbModel.decreaseItemQuantity(itemId);
    console.log(results);
    res.redirect("/");
  } catch (err) {
    console.error("Error decrease item from MySQL", err);
    res.render("error", { message: "Error decrease item" });
  }
});

module.exports = router;
