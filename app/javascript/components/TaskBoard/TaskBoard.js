import React, { useState, useEffect } from 'react';
import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import { propOr } from 'ramda';

import Task from '../Task';
import ColumnHeader from '../ColumnHeader';
import TasksRepository from '../../repositories/TasksRepository.js';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

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

  const loadTasks = (state, page = 1, perPage = 10) =>
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    });

  useEffect(() => {
    STATES.forEach(async ({ key }) => {
      const { data } = await loadTasks(key);
      const { items: cards, meta } = data;

      setBoardCards((prevCards) => ({ ...prevCards, [key]: { cards, meta } }));
    });
  }, []);

  useEffect(() => {
    const columns = STATES.map(({ key, value }) => ({
      id: key,
      title: value,
      cards: propOr([], 'cards', boardCards[key]),
      meta: propOr({}, 'meta', boardCards[key]),
    }));

    setBoard({ columns });
  }, [boardCards]);

  const updateColumnCards = async (state, page) => {
    const { data } = await loadTasks(state, page);
    const { items: cards, meta } = data;

    setBoardCards((prevCards) => ({
      ...prevCards,
      [state]: { cards: prevCards[state].cards.concat(cards), meta },
    }));
  };

  return (
    <Board
      renderCard={(card) => <Task task={card} />}
      renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={updateColumnCards} />}
      disableColumnDrag
    >
      {board}
    </Board>
  );
}

export default TaskBoard;
