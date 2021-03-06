import { connect } from 'react-redux';
import Router from 'react-router-redux';
import Task from '/imports/ui/Task';
import TaskMethods from '/imports/api/tasks/methods';

export default connect(null, {
  onRemove: (item) => TaskMethods.removeTask.action({ _id: item._id }),
  onFlip: (item) => TaskMethods.setTaskDone.action({ _id: item._id, done: !item.done }),
  onItemClick: (item) => Router.push(`/edit/${item._id}`),
})(Task);
