import React, { useState, useEffect } from 'react';
import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import { propOr } from 'ramda';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Task from 'components/Task';
import ColumnHeader from 'components/ColumnHeader';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import TasksRepository from 'repositories/TasksRepository.js';
import TaskForm from 'forms/TaskForm';

import useStyles from './useStyles.js';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

const MODES = {
  ADD: 'add',
  NONE: 'none',
  EDIT: 'edit',
};

const initialBoard = {
  columns: STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {},
  })),
};

function TaskBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState({});
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);
  const styles = useStyles();

  const loadTasks = (state, page = 1, perPage = 10) =>
    TasksRepository.index({
      q: { stateEq: state, s: 'id DESC' },
      page,
      perPage,
    });

  const setColumnCards = async (state) => {
    const { items: cards, meta } = await loadTasks(state);

    setBoardCards((prevCards) => ({ ...prevCards, [state]: { cards, meta } }));
  };

  const updateColumnCards = async (state, page) => {
    const { items: cards, meta } = await loadTasks(state, page);

    setBoardCards((prevCards) => ({
      ...prevCards,
      [state]: { cards: prevCards[state].cards.concat(cards), meta },
    }));
  };

  useEffect(() => STATES.forEach(({ key }) => setColumnCards(key)), []);
  useEffect(() => {
    const columns = STATES.map(({ key, value }) => ({
      id: key,
      title: value,
      cards: propOr([], 'cards', boardCards[key]),
      meta: propOr({}, 'meta', boardCards[key]),
    }));

    setBoard({ columns });
  }, [boardCards]);

  const handleCardDragEnd = async (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);

    try {
      if (transition) {
        await TasksRepository.update(task.id, { stateEvent: transition.event });
        setColumnCards(destination.toColumnId);
        setColumnCards(source.fromColumnId);
      }
    } catch (error) {
      alert(`Move failed! ${error.message}`);
    }
  };

  const handleAddPopupOpen = () => {
    setMode(MODES.ADD);
  };

  const handleEditPopupOpen = (task) => {
    setOpenedTaskId(task.id);
    setMode(MODES.EDIT);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
  };

  const handleTaskCreate = async (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    const task = await TasksRepository.create(attributes);

    setColumnCards(task.state);
    handleClose();
  };

  const handleTaskUpdate = async (task) => {
    const attributes = TaskForm.attributesToSubmit(task);

    await TasksRepository.update(task.id, attributes);
    setColumnCards(task.state);
    handleClose();
  };

  const handleTaskDestroy = async (task) => {
    await TasksRepository.destroy(task.id);
    setColumnCards(task.state);
    handleClose();
  };

  return (
    <>
      <Board
        renderCard={(card) => <Task task={card} onClick={handleEditPopupOpen} />}
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={updateColumnCards} />}
        onCardDragEnd={handleCardDragEnd}
        disableColumnDrag
      >
        {board}
      </Board>
      <Fab className={styles.addButton} color="primary" aria-label="add" onClick={handleAddPopupOpen}>
        <AddIcon />
      </Fab>
      {mode === MODES.ADD && <AddPopup onCardCreate={handleTaskCreate} onClose={handleClose} />}
      {mode === MODES.EDIT && (
        <EditPopup
          loadCard={TasksRepository.show}
          onCardDestroy={handleTaskDestroy}
          onCardUpdate={handleTaskUpdate}
          onClose={handleClose}
          cardId={openedTaskId}
        />
      )}
    </>
  );
}

export default TaskBoard;
