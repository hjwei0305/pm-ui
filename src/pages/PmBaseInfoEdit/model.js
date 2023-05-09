/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { downFile } from '@/utils';
import { del, save, saveToDo, delToDo, findEmp,getProOpt, getNewProOpt, syncProjectInfo
  , projPlanDel,projPlanFindByPage,projPlanSave,projPlanSaveBatch
  ,findByIdForSchedule,saveUpload,saveUploadList,uploadMasterPlan, downLoadTemplate, getChildrenNodes,
  findBaseInfoById, findWeekPlanById, saveWeekPlan, delWeekPlan, saveWeekPlanAttachList } from './service';

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
    weekModalVisible: false, // 双周计划编辑弹框
    weekAttModalVisible: false, // 双周计划列表查看附件
    weekData: null,
    weekAttId: null, // 双周计划查看附件id

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

    // 获取项目流程字典
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

    // 获取项目流程配置
    *getNewProOpt({ payload }, { call }) {
      const result = yield call(getNewProOpt, payload);
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

    /** pmBaseinfoWeek：根据项目id查询双周计划  */
    *findWeekPlanById({ payload }, { call }) {
      const result = yield call(findWeekPlanById, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
      //  message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },

    /** pmBaseinfoWeek：保存新双周计划  */
    *saveWeekPlan({ payload }, { call }) {
      const result = yield call(saveWeekPlan, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
      //  message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },

    /** pmBaseinfoWeek：删除新双周计划  */
    *delWeekPlan({ payload }, { call }) {
      const result = yield call(delWeekPlan, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
      //  message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },

    /** pmBaseinfoWeek：实体id绑定附件  */
    *saveWeekPlanAttachList({ payload }, { call }) {
      const result = yield call(saveWeekPlanAttachList, payload);
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
