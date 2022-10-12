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
//   'http://rddgit.changhong.com:7300/mock/5e02d29836608e42d52b1d81/template-service';
// const contextPath = '/simple-master';
const {PROJECT_PATH, SERVER_PATH} = constants;
const serverPath = '{PROJECT_PATH}';
const contextPath = '/todoList';
/** 保存 */
export async function save(data) {
  const url = `${PROJECT_PATH}/todoList/save`;
  return request.post(url, data);
}
// /** 查询 */
// export async function findPage(data) {
//   const url = `${PROJECT_PATH}/todoList/findByPage`;
// }
/** 删除 */
export async function del(params) {
  const url = `${serverPath}${contextPath}/delete/${params.id}`;
  return request.delete(url);
}

export async function findOne(data) {
  const url = `${PROJECT_PATH}${contextPath}/findOne?id=${data.id}`;
  return request({
    url,
    method: 'GET',
  });
  // return request.get(url);
}

export async function findEmp(data) {
    const url = `${PROJECT_PATH}/pmEmployee/findEmp`;
    return request({
      url,
      method: 'POST',
      data,
    });
  }

  /** 查询指定人员信息 */
export async function getUserInfo(param) {
  const url = `${SERVER_PATH}/sei-basic/employee/findByCode?code=${param.code}`;
  return request.get(url);
}

export async function saveUserId(data) {
   const url = `${PROJECT_PATH}${contextPath}/saveUserId`;
   return request({
    url,
    method: 'POST',
    data,
   });
  }
