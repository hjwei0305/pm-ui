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
const contextPath = '/pmProjectOption';
const pmOrganizePath = '/pmOrganize';
const {PROJECT_PATH, SERVER_PATH} = constants;

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

/** 组织节点 */
export async function getOrgnameList() {
  const url = `${PROJECT_PATH}${pmOrganizePath}/getChildrenNodes?nodeId=EC2FCEF7-A04F-11ED-A883-005056C00001&includeSelf=false`;
  return request({
    url,
    method: 'GET',
  });
}

export async function getProInfo(data) {
  const url = `${PROJECT_PATH}/pmBaseinfo/findByPage`;

  return request.post(url, data);
}
