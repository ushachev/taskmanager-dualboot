import routes from 'routes';
import FetchHelper from 'utils/fetchHelper';

export default {
  async index(params) {
    const path = routes.apiV1UsersPath();
    const { data } = await FetchHelper.get(path, params);

    return data;
  },

  async show(id) {
    const path = routes.apiV1UserPath(id);
    const {
      data: { user },
    } = await FetchHelper.get(path);

    return user;
  },
};
