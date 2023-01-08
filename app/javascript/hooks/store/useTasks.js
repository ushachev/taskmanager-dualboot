import { useState, useEffect } from 'react';
import { propOr } from 'ramda';

import TasksRepository from 'repositories/TasksRepository.js';
import TaskForm from 'forms/TaskForm';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

const useTasks = () => {
  const [board, setBoard] = useState({
    columns: STATES.map((column) => ({
      id: column.key,
      title: column.value,
      cards: [],
      meta: {},
    })),
  });
  const [boardCards, setBoardCards] = useState({});

  const getTasksByState = (state, page = 1, perPage = 10) =>
    TasksRepository.index({
      q: { stateEq: state, s: 'id DESC' },
      page,
      perPage,
    });

  const setBoardCardsForState = (state, { items: cards, meta }) => {
    setBoardCards((prevCards) => ({ ...prevCards, [state]: { cards, meta } }));
  };

  useEffect(() => {
    STATES.forEach(async ({ key: state }) => {
      const cardsData = await getTasksByState(state);
      setBoardCardsForState(state, cardsData);
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

  const appendCards = async (state, page) => {
    const { items: cards, meta } = await getTasksByState(state, page);

    setBoardCards((prevCards) => ({
      ...prevCards,
      [state]: { cards: prevCards[state].cards.concat(cards), meta },
    }));
  };

  const moveCard = async (task, { toColumnId }) => {
    const transition = task.transitions.find(({ to }) => toColumnId === to);

    if (transition) {
      await TasksRepository.update(task.id, { stateEvent: transition.event });

      const destinationCardsData = await getTasksByState(toColumnId);
      const sourceCardsData = await getTasksByState(task.state);

      setBoardCardsForState(toColumnId, destinationCardsData);
      setBoardCardsForState(task.state, sourceCardsData);
    }
  };

  const createTask = async (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    const task = await TasksRepository.create(attributes);
    const cardsData = await getTasksByState(task.state);

    setBoardCardsForState(task.state, cardsData);
  };

  const updateTask = async (task) => {
    const attributes = TaskForm.attributesToSubmit(task);

    await TasksRepository.update(task.id, attributes);

    const cardsData = await getTasksByState(task.state);

    setBoardCardsForState(task.state, cardsData);
  };

  const destroyTask = async (task) => {
    await TasksRepository.destroy(task.id);

    const cardsData = await getTasksByState(task.state);

    setBoardCardsForState(task.state, cardsData);
  };

  return {
    board,
    appendCards,
    getCard: TasksRepository.show,
    moveCard,
    createTask,
    updateTask,
    destroyTask,
  };
};

export default useTasks;
