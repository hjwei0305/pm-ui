/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:48:33
 */
import { utils } from 'suid';
import {constants} from "@/utils";
const { request } = utils;

// const MockServerPath ='/mock/5e02d29836608e42d52b1d81/template-service';
//const contextPath = '/simple-master';
const {PROJECT_PATH} = constants;
// const serverPath = '{PROJECT_PATH}';
const contextPath = '/projectPlan';

/** 保存 */
export async function save(data) {
  const url =  `${PROJECT_PATH}${contextPath}/save`;
  return request.post(url, data);
}

/** 批量保存 */
export async function saveBatch(data) {
  const url =  `${PROJECT_PATH}${contextPath}/saveBatch`;
  return request.post(url, data);
}

/** 查询 */
export async function findByPage(data) {
  const url = `${PROJECT_PATH}${contextPath}/findByPage`;
  return request.post(url,data);
}

/** 删除 */
export async function del(params) {
  const url = `${PROJECT_PATH}${contextPath}/delete/${params.id}`;
  return request.delete(url);
}
