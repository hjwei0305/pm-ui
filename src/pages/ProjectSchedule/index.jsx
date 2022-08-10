import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Popconfirm } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import EditModal from './EditModal';
import {constants} from "@/utils";

const {PROJECT_PATH} = constants
@withRouter
@connect(({ projectSchedule, loading }) => ({ projectSchedule, loading }))
class ProjectSchedule extends Component {
  state = {
    delId: null,
  };

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'projectSchedule/updateState',
          payload: {
            modalVisible: true,
            editData: row,
          },
        });
        break;
      case 'del':
        this.setState(
          {
            delId: row.id,
          },
          () => {
            this.dispatchAction({
              type: 'projectSchedule/del',
              payload: {
                id: row.id,
              },
            }).then(res => {
              if (res.success) {
                this.setState(
                  {
                    delId: null,
                  },
                  () => this.refresh(),
                );
              }
            });
          },
        );
        break;
      default:
        break;
    }
  };

  handleSave = data => {
    this.dispatchAction({
      type: 'projectSchedule/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'projectSchedule/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.refresh();
      }
    });
  };

  handleClose = () => {
    this.dispatchAction({
      type: 'projectSchedule/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['projectSchedule/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => (
          <Fragment>
            <ExtIcon
              key="edit"
              className="edit"
              onClick={() => this.handleEvent('edit', record)}
              type="edit"
              status="success"
              tooltip={{ title: '编辑' }}
              antd
            />
            <Popconfirm
              key="del"
              placement="topLeft"
              title="确定要删除吗？"
              onConfirm={() => this.handleEvent('del', record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          </Fragment>
        ),
      },
      {
        title: '项目编码',
        dataIndex: 'projectCode',
        width: 120,
        required: true,
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 220,
        required: true,
      },
      {
        title: '计划类型',
        dataIndex: 'schedureType',
        width: 220,
        required: true,
      },
      {
        title: '计划开始日期',
        dataIndex: 'planStartDate',
        width: 100,
        required: false,
      },
      {
        title: '计划结束日期',
        dataIndex: 'planEndDate',
        width: 100,
        required: false,
      },
      {
        title: '实际开始日期',
        dataIndex: 'actualStartDate',
        width: 100,
        required: false,
      },
      {
        title: '实际结束日期',
        dataIndex: 'actualEndDate',
        width: 100,
        required: false,
      },
      {
        title: '天数',
        dataIndex: 'schedureDays',
        width: 220,
        required: true,
      },
      {
        title: '序号',
        dataIndex: 'schedureNo',
        width: 220,
        required: true,
      },
      {
        title: '状态',
        dataIndex: 'schedureStatus',
        width: 220,
        required: true,
      },
      {
        title: '任务类型',
        dataIndex: 'workType',
        width: 220,
        required: true,
      },
      {
        title: '任务列表',
        dataIndex: 'workTodoList',
        width: 220,
        required: true,
      },
      {
        title: '负责人',
        dataIndex: 'workOnduty',
        width: 220,
        required: true,
      },
      {
        title: '协助人',
        dataIndex: 'workAssist',
        width: 220,
        required: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 220,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button
            key="add"
            type="primary"
            onClick={() => {
              this.handleEvent('add', null);
            }}
            ignore="true"
          >
            新建
          </Button>
          <Button onClick={this.refresh}>刷新</Button>
        </Fragment>
      ),
    };
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      store: {
        type: 'POST',
        url:
        `${PROJECT_PATH}/projectSchedule/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, projectSchedule } = this.props;
    const { modalVisible, editData } = projectSchedule;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['projectSchedule/save'],
    };
  };

  render() {
    const { projectSchedule } = this.props;
    const { modalVisible } = projectSchedule;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default ProjectSchedule;
