import React, { useState } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

import useStyles from './useStyles';

function ColumnHeader({ column, onViewMore }) {
  const [isLoading, setLoading] = useState(false);
  const styles = useStyles();

  const {
    id,
    title,
    cards,
    meta: { totalCount, currentPage, totalPages },
  } = column;

  const count = cards.length;
  const isLastPage = currentPage === (totalPages || 1);

  const handleViewMore = async () => {
    setLoading(true);
    await onViewMore(id, currentPage + 1);
    setLoading(false);
  };

  return (
    <div className={styles.root}>
      <div>
        <b>{title}</b> ({count}/{totalCount || '…'})
      </div>
      {!isLastPage && (
        <div>
          <IconButton aria-label="View more" disabled={isLoading} onClick={() => handleViewMore()}>
            <SystemUpdateAltIcon fontSize="small" />
          </IconButton>
        </div>
      )}
    </div>
  );
}

ColumnHeader.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    meta: PropTypes.shape({
      totalCount: PropTypes.number,
      currentPage: PropTypes.number,
      totalPages: PropTypes.number,
    }).isRequired,
  }).isRequired,
  onViewMore: PropTypes.func.isRequired,
};

export default ColumnHeader;
