var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require("./users")
const messageModel = require("./message")
const groupChatModel = require('./groupChat')
const statusModel = require('./status')
const upload = require('./multer')
const localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload', function (req, res, next) {
  res.render('upload', { title: 'Express' });
});

// router.post('/update-status', upload.single('media'),isLoggedIn,  async (req, res) => {
//   const user = await userModel.findOne({username: req.session.passport.user})
//   let mediaPath = '';
//   if (req.file) {
//     mediaPath = `uploads/${req.file.filename}`;
//   }

//   const status = await statusModel.findByIdAndUpdate(
//     user.status,
//     { text: req.body.text, media: mediaPath },
//     { new: true }
//   );
//   res.redirect('/profile')
// });

// router.get('/user/:userId/status/:statusId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const statusId = req.params.statusId;

//     // Fetch the user's status updates
//     const user = await User.findById(userId).populate('status');

//     // Find the specific status update based on the statusId
//     const statusUpdate = user.status.find(status => status.id === statusId);

//     // Render the EJS template with the specific status update
//     res.render('status', { statusUpdate, user });
//   } catch (error) {
//     console.error('Error fetching and rendering status update:', error);
//     res.status(500).send('Error fetching and rendering status update');
//   }
// });

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate('friends')
  const statusUpdates = await statusModel.find({ user: user }).sort({ createdAt: -1 });
  res.render('profile', { user, statusUpdates });
});

router.post('/searchUser', isLoggedIn, async function (req, res, next) {
  const data = req.body.data
  const allUsers = await userModel.find({
    username: {
      $regex: data,
      $options: 'i'
    }
  })
  console.log(allUsers)
  res.status(200).json(allUsers)
})

router.post('/addFriend', isLoggedIn, async function (req, res, next) {
  const friendId = req.body.friendId
  const friendUser = await userModel.findOne({ _id: friendId })
  const user = await userModel.findOne({ username: req.session.passport.user })
  const indexOfFriendUser = user.friends.indexOf(friendUser._id)

  if (indexOfFriendUser !== -1) {
    res.status(200).json({
      message: 'already friends'
    })
    return
  }

  user.friends.push(friendUser._id)
  friendUser.friends.push(user.id)

  await user.save()
  await friendUser.save()

  res.status(200).json({
    message: "friends added"
  })
})

router.post('/getMessages', isLoggedIn, async (req, res, next) => {
  const chats = await messageModel.find({
    $or: [
      {
        sender: req.user.username,
        receiver: req.body.oppositeUser,
      }, {
        sender: req.body.oppositeUser,
        receiver: req.user.username,
      }
    ]
  })
  res.status(200).json(chats)
})

router.post('/register', function (req, res) {
  var userdata = new userModel({
    username: req.body.username,
    email: req.body.email
  })

  userModel.register(userdata, req.body.password).then(function (registereduser) {
    passport.authenticate("local")(req, res, function () {
      res.redirect('/profile')
    })
  })
})

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function (req, res) { })

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err) }
    res.redirect("/login")
  })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/")
}

module.exports = router;
