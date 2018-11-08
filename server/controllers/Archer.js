
const gamePage = (req, res) => {
  // console.dir(req.session.currentCharacter);
  console.dir(req.cookies.currentCharacter);
  res.render('game', { csrfToken: req.csrfToken() });
};

module.exports.gamePage = gamePage;
