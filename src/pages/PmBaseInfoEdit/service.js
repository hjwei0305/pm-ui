/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:48:33
 */
import { utils } from 'suid';
import {constants} from "@/utils";
const { request } = utils;

// const MockServerPath =
//   '/mock/5e02d29836608e42d52b1d81/template-service';

const {PROJECT_PATH} = constants;
const contextBaseInfoPath = '/pmBaseinfo';
const contextPath = '/pmBaseInfoEdit';
const contextToDoPath = '/todoList';
const ProjPlanPath = '/projectPlan';


export async function findEmp(data) {
  const url = `${PROJECT_PATH}/pmEmployee/findEmp`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 保存 */
export async function save(data) {
  const url = `${PROJECT_PATH}${contextBaseInfoPath}/saveBaseInfo`;
  return request.post(url, data);
}

/** 删除 */
export async function del(params) {
  const url = `${PROJECT_PATH}${contextPath}/delete/${params.id}`;
  return request.delete(url);
}

/** ToDoList保存 */
export async function saveToDo(data) {
  const url = `${PROJECT_PATH}${contextToDoPath}/save`;
  return request.post(url, data);
}

/** ToDoList更新 */
export async function updateStateToDo(data) {
  const url = `${PROJECT_PATH}${contextToDoPath}/save`;
  console.log(data)
  return request.post(url, data);
}

/** ToDoList删除 */
export async function delToDo(params) {
  const url = `${PROJECT_PATH}${contextToDoPath}/delete/${params.id}`;
  return request.delete(url);
}

/** 根据编码查找项目 */
export async function syncProjectInfo(params) {
  const url = `${PROJECT_PATH}${contextBaseInfoPath}/syncProjectInfo?code=${params.code}`;
  return request.post(url);
}

/** projectPlan */
/** 保存 */
export async function projPlanSave(data) {
  const url =  `${PROJECT_PATH}${ProjPlanPath}/save`;
  return request.post(url, data);
}

/** 批量保存 */
export async function projPlanSaveBatch(data) {
  const url =  `${PROJECT_PATH}${ProjPlanPath}/saveBatch`;
  return request.post(url, data);
}

/** 删除 */
export async function projPlanDel(params) {
  const url = `${PROJECT_PATH}${ProjPlanPath}/delete/${params.id}`;
  return request.delete(url);
}

/** 查询 */
export async function projPlanFindByPage(data) {
  const url = `${PROJECT_PATH}${ProjPlanPath}/findByPage`;
  return request.post(url,data);
}
