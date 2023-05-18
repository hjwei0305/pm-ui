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
// const contextPath = '/simple-master';
const pmOrganizePath = '/pmOrganize';
const weekReportPath = '/pmBaseinfoWeek';
const { PROJECT_PATH } = constants;


/** 保存 */
export async function save(data) {
  const url = `${PROJECT_PATH}${weekReportPath}/save`;

  return request.post(url, data);
}

/** 删除 */
export async function del(params) {
  const url = `${PROJECT_PATH}${weekReportPath}/delete/${params.id}`;
  return request.delete(url);
}

/** 组织节点 */
export async function getOrgnameList() {
  const url = `${PROJECT_PATH}${pmOrganizePath}/getChildrenNodesNotFrozen?nodeId=EC2FCEF7-A04F-11ED-A883-005056C00001&includeSelf=false`;
  return request({
    url,
    method: 'GET',
  });
}

export async function getWeekReport(data) {
  const url = `${PROJECT_PATH}${weekReportPath}/getWeekReport`;
  return request.post(url, data);
}

export async function confirmFinishPlan(data) {
  const url = `${PROJECT_PATH}${weekReportPath}/confirmFinishPlan`;
  return request.post(url, data);
}
