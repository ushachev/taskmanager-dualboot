import { propEq } from 'ramda';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { changeColumn } from '@asseinfo/react-kanban';

import { STATES } from 'presenters/TaskPresenter';
import TasksRepository from 'repositories/TasksRepository';

const initialState = {
  board: {
    columns: STATES.map((column) => ({
      id: column.key,
      title: column.value,
      cards: [],
      meta: {},
    })),
  },
};

const getTasksByState = async ({ state, page = 1, perPage = 10 }) => {
  const { items, meta } = await TasksRepository.index({
    q: { stateEq: state, s: 'id DESC' },
    page,
    perPage,
  });

  return { items, meta, state };
};

export const selectTask = TasksRepository.show;

export const selectTasks = createAsyncThunk('tasks/selectTasks', getTasksByState);

export const selectMoreTasks = createAsyncThunk('tasks/selectMoreTasks', getTasksByState);

export const changeTaskState = createAsyncThunk('tasks/changeTaskState', async ({ task, stateEvent }, { dispatch }) => {
  const updatedTask = await TasksRepository.update(task.id, { stateEvent });

  dispatch(selectTasks({ state: task.state }));
  dispatch(selectTasks({ state: updatedTask.state }));
});

export const createTask = createAsyncThunk('tasks/createTask', async (attributes) => {
  const task = await TasksRepository.create(attributes);
  const tasks = await getTasksByState({ state: task.state });

  return tasks;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ task: { id, state }, attributes }) => {
  await TasksRepository.update(id, attributes);
  const tasks = await getTasksByState({ state });

  return tasks;
});

export const destroyTask = createAsyncThunk('tasks/destroyTask', async ({ id, state }) => {
  await TasksRepository.destroy(id);
  const tasks = await getTasksByState({ state });

  return tasks;
});

const setBoardColumn = (state, { payload }) => {
  const { items: cards, meta, state: columnId } = payload;
  const column = state.board.columns.find(propEq('id', columnId));

  state.board = changeColumn(state.board, column, { cards, meta });

  return state;
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(selectTasks.fulfilled, setBoardColumn)
      .addCase(selectMoreTasks.fulfilled, (state, { payload }) => {
        const { items, meta, state: columnId } = payload;
        const column = state.board.columns.find(propEq('id', columnId));
        const cards = column.cards.concat(items);

        state.board = changeColumn(state.board, column, { cards, meta });

        return state;
      })
      .addCase(createTask.fulfilled, setBoardColumn)
      .addCase(updateTask.fulfilled, setBoardColumn)
      .addCase(destroyTask.fulfilled, setBoardColumn);
  },
});

export default tasksSlice.reducer;
