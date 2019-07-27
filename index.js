/* *********************************************************
*                      INDEX.JS - IMPORTS                  *
************************************************************/
const express = require("express");
const cors = require("cors");
const db = require("./data/db");

/* *********************************************************
*                      CONFIGURATION                       *
************************************************************/
const server = express();
server.use(express.json());
server.use(cors());

/* *********************************************************
*                          GET /                           *
************************************************************/
server.get("/", (req, res) => {
  res.send("Hello world from express.");
});

/* *********************************************************
*                          POST                            *
************************************************************/
server.post("/api/users", (req, res) => {
  const user = req.body;

  if (!user.name || !user.bio) {
    const missingField = !user.name && !user.bio 
      ? "both a name and bio " 
      : !user.name ? "a name" : "a bio";
    
    res.status(400).json({ 
        success: false,
        error: `Please provide ${missingField} for the user.`
      });

  } else {
    db.insert({
      name: user.name,
      bio: user.bio
    })
      .then(user => {
        res.status(201).json({
          success: true,
          user
        });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          err
        });
      });
  }
});

/* *********************************************************
*                           GET /USERS                     *
************************************************************/
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
});

/* *********************************************************
*                          GET /USERS:ID                   *
************************************************************/
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(userID => {
      if (userID) {
        res.status(200).json({
          success: true,
          userID
        });
      } else {
        res.status(404).json({
          success: false,
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
});

/* *********************************************************
*                          DELETE                          *
************************************************************/
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(userID => {
      if (userID) {
        res.status(200).json({
          success: true,
          userID
        });
      } else {
        res.status(404).json({
          success: false,
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
});
/* *********************************************************
*                           PUT                            *
************************************************************/
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = req.body;

  if(!user.name || !user.bio) {
    const missingField = !user.name && !user.bio 
      ? "both a name and bio " 
      : !user.name ? "a name" : "a bio";

    res.status(404).json({
      success: false,
      message: `Please provide ${missingField} for the user.`
    })
  } else {
    db.update(id, user)
    .then(user => {
      if (user) {
        res.status(200).json({
          success: true,
          user
        });
      } else {
        res.status(404).json({
          success: false,
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
  }
});

/* *********************************************************
*                           PORT                           *
************************************************************/
server.listen(4000, () => {
  console.log("server listening on port 4000");
});
