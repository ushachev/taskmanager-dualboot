import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { STATES } from 'presenters/TaskPresenter';
import * as TaskActions from 'slices/TasksSlice';
import TaskForm from 'forms/TaskForm';
import TasksRepository from 'repositories/TasksRepository';

const useTasks = () => {
  const board = useSelector((state) => state.TasksSlice.board);
  const dispatch = useDispatch();

  useEffect(() => {
    STATES.forEach(({ key: state }) => dispatch(TaskActions.selectTasks({ state })));
  }, []);

  const appendCards = (state, page) => dispatch(TaskActions.selectMoreTasks({ state, page }));

  const moveCard = (task, { toColumnId }) => {
    const transition = task.transitions.find(({ to }) => toColumnId === to);

    if (transition) {
      dispatch(TaskActions.changeTaskState({ task, stateEvent: transition.event }));
    }
  };

  const createTask = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    dispatch(TaskActions.createTask(attributes));
  };

  const updateTask = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);
    dispatch(TaskActions.updateTask({ task, attributes }));
  };

  const destroyTask = (task) => dispatch(TaskActions.destroyTask(task));

  return {
    board,
    appendCards,
    getCard: TasksRepository.show,
    moveCard,
    createTask,
    updateTask,
    destroyTask,
    attachImage: TasksRepository.attachImage,
    removeImage: TasksRepository.removeImage,
  };
};

export default useTasks;
