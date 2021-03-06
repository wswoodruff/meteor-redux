import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Tasks } from '../collection';

const taskPubFields = {
  description: true,
  details: true,
  done: true,
};

const getTaskPublication = function (filter, pageSkip = 0) {
  const query = {};

  switch (filter) {
    case 'SHOW_COMPLETED':
      query.done = true;
      break;
    case 'SHOW_ACTIVE':
      query.done = false;
      break;
    default:
      break;
  }

  Counts.publish(this, 'tasksCount', Tasks.find(query));

  return Tasks.find(query, {
    fields: taskPubFields,
    skip: pageSkip,
    limit: 10,
  });
};

Meteor.publish('getTasks', getTaskPublication);
