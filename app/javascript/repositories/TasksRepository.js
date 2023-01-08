import routes from 'routes';
import FetchHelper from 'utils/fetchHelper';

export default {
  async index(params) {
    const path = routes.apiV1TasksPath();
    const { data } = await FetchHelper.get(path, params);

    return data;
  },

  async show(id) {
    const path = routes.apiV1TaskPath(id);
    const {
      data: { task },
    } = await FetchHelper.get(path);

    return task;
  },

  async update(id, task = {}) {
    const path = routes.apiV1TaskPath(id);
    const {
      data: { task: updatedTask },
    } = await FetchHelper.patch(path, { task });

    return updatedTask;
  },

  async create(task = {}) {
    const path = routes.apiV1TasksPath();
    const {
      data: { task: createdTask },
    } = await FetchHelper.post(path, { task });

    return createdTask;
  },

  async destroy(id) {
    const path = routes.apiV1TaskPath(id);

    await FetchHelper.delete(path);

    return null;
  },
};
