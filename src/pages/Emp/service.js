/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
* @Last Modified by:   zp
* @Last Modified time: 2020-02-28 14:37:45
*/
import { utils } from 'suid';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;
const { request } = utils;

// const MockServerPath = '/mock/5e02d29836608e42d52b1d81/template-service';
// const contextPath = '/tree-table-master';

const contextPath = '/pmOrganize';
const Path = '/pmEmployee';

/** 保存 */
export async function save(data) {
  const url = `${PROJECT_PATH}${contextPath}/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 删除 */
export async function del(params) {
  const url = `${PROJECT_PATH}${contextPath}/delete/${params.id}`;
  return request({
    url,
    method: "DELETE",
  });
}

/** 获取树 */
export async function getTree() {
  const url = `${PROJECT_PATH}${contextPath}/findOrgTree`;
  return request({
    url,
    method: 'GET',
  });
}

/** 获取员工 */
export async function updateEmp(data) {
  const url = `${PROJECT_PATH}${Path}/findEmp`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

// /**
//  * 获取所有树结构数据
//  */
// export async function listAllTree(params={}){
//   const url = `${MockServerPath}${contextPath}/findTree`;
//   return request.get(url, params);
// }

// /**
//  * 根据树节点id获取表格数据
//  */
// export async function findByTreeNodeId(params={}){
//   const url = `${MockServerPath}${contextPath}/findDataByNodeId?id=${params.id}`;
//   return request.get(url);
// }



