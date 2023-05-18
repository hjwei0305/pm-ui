/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, getOrgnameList, getWeekReport, confirmFinishPlan } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'pmBaseInfoWeekReport',

  state: {
    editData: null,
    modalVisible: false,
    weekAttId: null,
    weekAttModalVisible: false,
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

    *getOrgnameList({ payload }, { call }) {
      const result = yield call(getOrgnameList, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
      //  message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },

    *getWeekReport({ payload }, { call }) {
      const result = yield call(getWeekReport, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
      //  message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },

    *confirmFinishPlan({ payload }, { call }) {
      const result = yield call(confirmFinishPlan, payload);
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
