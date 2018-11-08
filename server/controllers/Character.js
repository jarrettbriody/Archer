const models = require('../models');

const Character = models.Character;

const createCharacterPage = (req, res) => {
  // console.log("/characterCreator");
  Character.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), characters: docs });
  });
};

const createCharacter = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Character name is required.' });
  }

  const characterData = {
    name: req.body.name,
    level: 1,
    experience: 0,
    bow: 'Wooden',
    owner: req.session.account._id,
  };

  const newCharacter = new Character.CharacterModel(characterData);

  const characterPromise = newCharacter.save();

  characterPromise.then(() => res.json({ redirect: '/characterCreator' }));

  characterPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Character already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return characterPromise;
};

const getCharacters = (request, response) => {
  const req = request;
  const res = response;

  return Character.CharacterModel.findByOwner(
    req.session.account._id,
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      return res.json({ characters: docs });
    });
};

const deleteCharacter = (request, response) => {
  const req = request;
  const res = response;

  return Character.CharacterModel.deleteOneCharacter(
    req.session.account._id,
    req.body.name,
    (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      return res.status(200).json({ redirect: '/characterCreator' });
    });
};

const setCurrentCharacter = (request, response) => {
  Character.CharacterModel.findByOwnerAndID(
    request.session.account._id,
    request.body.id,
    (err, doc) => {
      if (err) {
        console.log(err);
        return response.status(400).json({ error: 'Character does not exist.' });
      }
      // request.session.currentCharacter = doc;
      response.cookie('currentCharacter', doc);
      return response.json({ redirect: '/archer' });
    });
};

module.exports.createCharacterPage = createCharacterPage;
module.exports.createCharacter = createCharacter;
module.exports.deleteCharacter = deleteCharacter;
module.exports.getCharacters = getCharacters;
module.exports.setCurrentCharacter = setCurrentCharacter;
