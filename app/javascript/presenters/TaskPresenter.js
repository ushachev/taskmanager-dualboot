import PropTypes from 'prop-types';

import PropTypesPresenter from 'utils/PropTypesPresenter';

import UserPresenter from './UserPresenter';

export const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

export default new PropTypesPresenter({
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  state: PropTypes.string,
  expiredAt: PropTypes.string,
  transitions: PropTypes.arrayOf(
    PropTypes.shape({
      event: PropTypes.string,
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  ),
  imageUrl: PropTypes.string,
  author: UserPresenter.shape(),
  assignee: UserPresenter.shape(),
});
