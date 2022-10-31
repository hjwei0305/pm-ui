import { message } from 'antd';
import { utils } from 'suid';
import {deleteEipTodo} from "@/pages/EipTodo/service";

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'eipTodo',

  state: {
    editData: null,
    modalVisible: false,
  },
  effects: {
    *deleteEipTodo({ payload }, { call }) {
      const result = yield call(deleteEipTodo, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
  }
});
