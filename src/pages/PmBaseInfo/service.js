/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:48:33
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;
const { request } = utils;

// const MockServerPath =
//   '/mock/5e02d29836608e42d52b1d81/template-service';
// const contextPath = '/simple-master';

const contextPath = '/pmBaseinfo';
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

/** 获取各阶段项目数量 */
export async function getProjectInfo(data) {
  const url = `${PROJECT_PATH}${contextPath}/getProjectInfo`;
  return request.post(url, data);
}

/** 组织节点 */
export async function getChildrenNodes() {
  const url = `${PROJECT_PATH}${pmOrganizePath}/getChildrenNodes?nodeId=1963AF41-194E-11ED-81B0-005056C00001&includeSelf=false`;
  return request({
    url,
    method: 'GET',
  });
}
