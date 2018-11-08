const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let CharacterModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  level: {
    type: Number,
    min: 0,
    required: true,
  },

  experience: {
    type: Number,
    min: 0,
    required: true,
  },

  bow: {
    type: String,
    required: true,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

CharacterSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  level: doc.level,
  experience: doc.experience,
  bow: doc.bow,
});

CharacterSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return CharacterModel.find(search).select('name level experience bow').exec(callback);
};

CharacterSchema.statics.findByOwnerAndID = (ownerId, _id, callback) => {
  const search = {
    owner: convertId(ownerId),
    _id,
  };

  return CharacterModel.find(search).select('name level experience bow').exec(callback);
};

CharacterSchema.statics.deleteOneCharacter = (ownerId, name, callback) => {
  const search = {
    owner: convertId(ownerId),
    name,
  };

  return CharacterModel.deleteOne(search).exec(callback);
};

CharacterModel = mongoose.model('Character', CharacterSchema);

module.exports.CharacterModel = CharacterModel;
module.exports.CharacterSchema = CharacterSchema;
