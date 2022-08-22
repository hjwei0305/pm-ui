/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, saveToDo, delToDo, findEmp, syncProjectInfo } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'pmBaseInfoEdit',

  state: {
    editData: null,
    // modalVisible: false,
    modalVisibleToDo: false,
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
    *saveToDo({ payload }, { call }) {
      const result = yield call(saveToDo, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *delToDo({ payload }, { call }) {
      const result = yield call(delToDo, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    // *findEmp({ payload }, { call , put }) {
    //   const result = yield call(findEmp, payload);
    //   const { data, success, message: msg } = result || {};
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       empData: [].concat(data),
    //     },
    //   });

    //   return payload;
    // },
    *findEmp({ payload }, { call }) {
      const result = yield call(findEmp, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        // message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },

    *syncProjectInfo({ payload }, { call }) {
      const result = yield call(syncProjectInfo, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },
  },
});
