import React, { useState } from 'react';
import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';

import Task from '../Task';

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
    cards: [
      {
        id: 1,
        name: `task name in '${column.value}' column`,
        description: `task description in '${column.value}' column`,
      },
    ],
    meta: {},
  })),
};

function TaskBoard() {
  const [board] = useState(initialBoard);

  return (
    <Board
      renderCard={(card) => <Task task={card} />}
      disableColumnDrag
    >
      {board}
    </Board>
  );
}

export default TaskBoard;
