import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AsyncSelect from 'react-select/async';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';

import UsersRepository from 'repositories/UsersRepository';
import UserPresenter from 'presenters/UserPresenter';

import useStyles from './useStyles';

const MAX_PER_PAGE_SIZE = 100;

function UserSelect({ error, label, isClearable, isDisabled, isRequired, onChange, value, helperText }) {
  const [isFocused, setFocus] = useState(false);
  const styles = useStyles();

  const handleLoadOptions = (inputValue) => {
    const loadUsers = async (page = 1) => {
      const { items, meta } = await UsersRepository.index({
        q: { firstNameOrLastNameCont: inputValue },
        page,
        perPage: MAX_PER_PAGE_SIZE,
      });

      if (meta.currentPage === meta.totalPages) return items;

      const users = await loadUsers(page + 1);

      return items.concat(users);
    };

    return loadUsers();
  };

  return (
    <FormControl margin="dense" disabled={isDisabled} focused={isFocused} error={error} required={isRequired}>
      <InputLabel shrink>{label}</InputLabel>
      <div className={styles.select}>
        <AsyncSelect
          maxMenuHeight={200}
          cacheOptions
          loadOptions={handleLoadOptions}
          defaultOptions
          getOptionLabel={(user) => UserPresenter.fullName(user)}
          getOptionValue={(user) => UserPresenter.id(user)}
          isDisabled={isDisabled}
          isClearable={isClearable}
          defaultValue={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </div>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

UserSelect.propTypes = {
  error: PropTypes.bool,
  label: PropTypes.string.isRequired,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func,
  value: UserPresenter.shape(),
  helperText: PropTypes.string,
};

UserSelect.defaultProps = {
  error: false,
  isClearable: true,
  isDisabled: false,
  isRequired: false,
  onChange: null,
  value: null,
  helperText: '',
};

export default UserSelect;
