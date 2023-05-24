/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:48:33
 */
import { utils } from 'suid';
import { constants } from "@/utils";

const { request } = utils;


const { PROJECT_PATH } = constants;


// const MockServerPath =
//   '/mock/5e02d29836608e42d52b1d81/template-service';
const contextPath = '/simple-master';
const pmOrganizePath = '/pmOrganize';

/** 保存 */
export async function save(data) {
  const url = `${PROJECT_PATH}${contextPath}/save`;

  return request.post(url, data);
}

/** 删除 */
export async function del(params) {
  const url = `${PROJECT_PATH}${contextPath}/delete/${params.id}`;
  return request.delete(url);
}

/** 获取组织机构列表 */
export async function getOrgList(params) {
  const url = `${PROJECT_PATH}${pmOrganizePath}/getChildrenNodesNotFrozen?nodeId=EC2FCEF7-A04F-11ED-A883-005056C00001&includeSelf=false`;
  return request.get(url, params);
}
