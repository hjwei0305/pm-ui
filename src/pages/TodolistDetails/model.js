/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, findOne, findEmp, getUserInfo, saveUserId,bindFile,getTaskId, getOrgnameList, projFindByPage2, projFindByPage2Summary } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'todolistDetails',

  state: {
    editData: null,
    modalVisible: false,
    id: null,
    billModalVisible: null,
  },
  effects: {
    *updateUsable({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });
      return payload;
    },
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
    *findOne({ payload }, { call }) {
      const result = yield call(findOne, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        // message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
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

    *getUserInfo({ payload }, { call }) {
      const result = yield call(getUserInfo, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
       // message.success(msg);
      } else {
       message.error(msg);
      }
      return result;
    },
    *saveUserId({ payload }, { call }) {
      const result = yield call(saveUserId, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
       // message.success(msg);
      } else {
       message.error(msg);
      }
      return result;
    },
    *bindFile({ payload }, { call }) {
      const result = yield call(bindFile, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
       // message.success(msg);
      } else {
       message.error(msg);
      }
      return result;
    },
    *getTaskId({ payload }, { call }) {
      const result = yield call(getTaskId, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
       // message.success(msg);
      } else {
       message.error(msg);
      }
      return result;
    },
    *getOrgnameList({ payload }, { call }) {
      const result = yield call(getOrgnameList, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
       // message.success(msg);
      } else {
       message.error(msg);
      }
      return result;
    },
    *projFindByPage2({ payload }, { call }) {
      const result = yield call(projFindByPage2, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
       // message.success(msg);
      } else {
       message.error(msg);
      }
      return result;
    },
    *projFindByPage2Summary({ payload }, { call }) {
      const result = yield call(projFindByPage2Summary, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
       // message.success(msg);
      } else {
       message.error(msg);
      }
      return result;
    },
  },
});
