const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let TaskModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  dueDate: {
    type: Date,
    required: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

TaskSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  level: doc.level,
  experience: doc.experience,
  bow: doc.bow,
});

TaskSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return TaskModel.find(search).select('name dueDate description createdDate').exec(callback);
};

TaskSchema.statics.findByOwnerAndID = (ownerId, _id, callback) => {
  const search = {
    owner: convertId(ownerId),
    _id,
  };

  return TaskModel.find(search).select('name dueDate description createdDate').exec(callback);
};

TaskSchema.statics.deleteOneTask = (ownerId, _id, callback) => {
  const search = {
    owner: convertId(ownerId),
    _id,
  };

  return TaskModel.deleteOne(search).exec(callback);
};

TaskModel = mongoose.model('Task', TaskSchema);

module.exports.TaskModel = TaskModel;
module.exports.TaskSchema = TaskSchema;
