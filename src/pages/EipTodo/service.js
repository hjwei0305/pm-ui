import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { PROJECT_PATH } = constants;

/** 保存 */
export async function deleteEipTodo(data) {
  const url = `${PROJECT_PATH}/todoList/deleteEipTodo`;

  return request.post(url, data);
}
