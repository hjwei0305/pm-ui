/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, getOrgnameList, getDataList, createPersonalMonthPlan, findEmp, monthPlanSaveBatch, findBypersonalMonthReportId } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'personalMonthReport',

  state: {
    editData: null,
    modalVisible: false,
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

    // orgnameList
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

    *getDataList({ payload }, { call }) {
      const result = yield call(getDataList, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
      //  message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },

    *createPersonalMonthPlan({ payload }, { call }) {
      const result = yield call(createPersonalMonthPlan, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
      //  message.success(msg);
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

    *monthPlanSaveBatch({ payload }, { call }) {
      const result = yield call(monthPlanSaveBatch, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },

    *findBypersonalMonthReportId({ payload }, { call }) {
      const result = yield call(findBypersonalMonthReportId, payload);
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
