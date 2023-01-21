import PropTypes from 'prop-types';

import PropTypesPresenter from 'utils/PropTypesPresenter';

import UserPresenter from './UserPresenter';

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
  author: UserPresenter.shape(),
  assignee: UserPresenter.shape(),
});
