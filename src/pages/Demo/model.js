/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, getOrgList } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'demo',

  state: {
    editData: null,
    modalVisible: false,
    orgnameFilter: null,
    orgList: [],
  },
  effects: {
    *save({ payload }, { call }) {
      const result = yield call(save, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *del({ payload }, { call }) {
      const result = yield call(del, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *getOrgList({ payload }, { call, put }) {
      const result = yield call(getOrgList, payload);
      const { success, message: msg, data } = result || {};
      if (success) {
        message.success(msg);
        // yield put({
        //   type: 'updateState',
        //   payload: {
        //     orgList: data,
        //   },
        // });
      }
      return result;
    }
  },
});
