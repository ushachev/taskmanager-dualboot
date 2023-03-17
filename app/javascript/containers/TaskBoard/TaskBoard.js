import React, { useState } from 'react';
import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Task from 'components/Task';
import ColumnHeader from 'components/ColumnHeader';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';

import useTasks from 'hooks/store/useTasks';

import useStyles from './useStyles.js';

const MODES = {
  ADD: 'add',
  NONE: 'none',
  EDIT: 'edit',
};

function TaskBoard() {
  const { board, appendCards, getCard, moveCard, createTask, updateTask, destroyTask } = useTasks();
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);
  const styles = useStyles();

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
  };

  const handleOpenEditPopup = (task) => {
    setOpenedTaskId(task.id);
    setMode(MODES.EDIT);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
    setOpenedTaskId(null);
  };

  const handleCardDragEnd = (task, _source, destination) => {
    try {
      moveCard(task, destination);
    } catch (error) {
      alert(`Move failed! ${error.message}`);
    }
  };

  const handleTaskCreate = (params) => {
    createTask(params);
    handleClose();
  };

  const handleTaskUpdate = (task) => {
    updateTask(task);
    handleClose();
  };

  const handleTaskDestroy = (task) => {
    destroyTask(task);
    handleClose();
  };

  return (
    <>
      <Board
        renderCard={(card) => <Task task={card} onClick={handleOpenEditPopup} />}
        renderColumnHeader={(column) => <ColumnHeader column={column} onViewMore={appendCards} />}
        onCardDragEnd={handleCardDragEnd}
        disableColumnDrag
      >
        {board}
      </Board>

      <Fab className={styles.addButton} color="primary" aria-label="add" onClick={handleOpenAddPopup}>
        <AddIcon />
      </Fab>

      {mode === MODES.ADD && <AddPopup onCardCreate={handleTaskCreate} onClose={handleClose} />}
      {mode === MODES.EDIT && (
        <EditPopup
          getCard={getCard}
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
