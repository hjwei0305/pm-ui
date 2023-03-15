/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, getProjectInfo, getChildrenNodes } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'pmBaseInfo',

  state: {
    editData: null,
    modalVisible: false,
    newProjCode: null,
    disable: false,
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
    *getProjectInfo({ payload }, { call }) {
      const result = yield call(getProjectInfo, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        // message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },
    // orgList
    *getChildrenNodes({ payload }, { call }) {
      const result = yield call(getChildrenNodes, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
      //  message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },
  },
});
