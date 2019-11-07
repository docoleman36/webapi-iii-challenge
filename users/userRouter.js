const express = require('express');

const User = require('./userDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  User.insert(req.body)
    .then(users => {
      res.status(201).json(users)
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Error adding user' })
    });
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  try {
    const user = await User.insert(req.params.id)
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ err: "Error posting" })
  }
});

router.get('/', (req, res) => {
  User.get(req.query)
    .then(users => {
      res.status(201).json(users)
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Error getting users' })
    });
});

router.get('/:id', validateUserId, async (req, res) => {
  try {
    const user = await User.getById(req.params.id)
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ message: 'Error getting users' })
  }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  try {
    const user = await User.getUserPosts(req.params.id)
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ message: 'Error getting users posts' })
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  try {
    const removeUser = await User.remove(req.params.id)
    res.status(201).json(removeUser);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' })
  }
});

router.put('/:id', validateUserId, async (req, res) => {
  try {
    const changes = req.body;
    const update = await User.update(req.params.id, changes)
    res.status(201).json(update)
  } catch (err) {
    res.status(500).json({ err: "Cannot update" })
  }
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  User.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        next(new Error('does not exist'));
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'exception', err })
    })
};

function validateUser(req, res, next) {
  const bodyData = req.body;
  if (bodyData.name) {
    next()
  } else {
    res.status(400).json({ messsage: "Missing name on body" });
  }
};

function validatePost(req, res, next) {
  const bodyData = req.body;
  if (bodyData.text) {
    next()
  } else {
    res.status(400).json({ messsage: "Missing text on body" });
  }
};

module.exports = router;
