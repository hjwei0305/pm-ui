/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { downFile } from '@/utils';
import { del, save, saveToDo, delToDo, findEmp,getProOpt, syncProjectInfo
  , projPlanDel,projPlanFindByPage,projPlanSave,projPlanSaveBatch
  ,findByIdForSchedule,saveUpload,saveUploadList,uploadMasterPlan, downLoadTemplate, getChildrenNodes,
  findBaseInfoById } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'pmBaseInfoEdit',

  state: {
    editData: null,
    // modalVisible: false,
    modalVisibleToDo: false,
    modalVisibleSche: false,
    fileType: null,
    fileList: null,
    attId: null,
    ScheduleArys: [],
  },
  effects: {
    *findBaseInfoById({ payload }, { call }) {
      const result = yield call(findBaseInfoById, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
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
    *saveUpload({ payload }, { call }) {
      const result = yield call(saveUpload, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *saveUploadList({ payload }, { call }) {
      const result = yield call(saveUploadList, payload);
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
    *getProOpt({ payload }, { call }) {
      const result = yield call(getProOpt, payload);
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

    // projectPlan
    /**
     * Excel上传计划
     * @param payload
     * @param call
     * @returns {Generator<*, *, *>}
     */
    *uploadMasterPlan({ payload }, { call }) {
      const result = yield call(uploadMasterPlan, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
      //  message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },
    *projPlanSave({ payload }, { call }) {
      const result = yield call(projPlanSave, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *projPlanSaveBatch({ payload }, { call }) {
      const result = yield call(projPlanSaveBatch, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *projPlanDel({ payload }, { call }) {
      const result = yield call(projPlanDel, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *projPlanFindByPage({ payload }, { call }) {
      const result = yield call(projPlanFindByPage, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        //message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },

    // ProjectSchedule
    *findByIdForSchedule({ payload }, { call }) {
      const result = yield call(findByIdForSchedule, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
      //  message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },
    *downLoadTemplate({ payload }, { call }) {
      console.log(payload.type)
      const ds = yield call(downLoadTemplate, payload);
      if (ds.success) {
        downFile(ds.data, payload.type + '模板');
      }
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
