const express = require("express");
const db = require("./postDb");

const router = express.Router();

router.get("/", (req, res) => {
  db.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving data", err });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
  db.remove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      res.status(500).json({ message: "Error interacting with server" });
    });
});

router.put("/:id", validatePostId, (req, res) => {
  const updateInfo = req.body;
  updateInfo.id = req.params.id;
  updateInfo.text && updateInfo.user_id
    ? db
      .update(updateInfo.id, updateInfo)
      .then(() => {
        db.getById(updateInfo.id)
          .then(post => {
            res.status(201).json(post);
          })
          .catch(err => {
            res
              .status(500)
              .json({ message: "Error retrieving data from server" });
          });
      })
      .catch(err => {
        res.status(500).json({ message: "Error editing post", err });
      })
    : res
      .status(400)
      .json({
        message: "Bad request. Body is missing text or user_id key",
        updateInfo
      });
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  db.getById(id)
    .then(post => {
      post
        ? ((req.post = post), next())
        : res
          .status(404)
          .json({ message: `Post with id ${id} could not be found` });
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving data", error });
    });
}

module.exports = router;