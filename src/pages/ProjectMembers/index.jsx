import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Popconfirm } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import EditModal from './EditModal';
import {constants} from "@/utils";

const {PROJECT_PATH} = constants

@withRouter
@connect(({ projectMembers, loading }) => ({ projectMembers, loading }))
class ProjectMembers extends Component {
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
          type: 'projectMembers/updateState',
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
              type: 'projectMembers/del',
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
      type: 'projectMembers/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'projectMembers/updateState',
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
      type: 'projectMembers/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['projectMembers/del'] && delId === row.id) {
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
        title: '工号',
        dataIndex: 'code',
        width: 120,
        required: true,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width: 220,
        required: true,
      },
      {
        title: '项目编码',
        dataIndex: 'projectCode',
        width: 100,
        required: false,
      },
      {
        title: '所在小组',
        dataIndex: 'organizeId',
        width: 100,
        required: false,
      },
      {
        title: '项目组身份',
        dataIndex: 'projectRole',
        width: 100,
        required: false,
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
          `${PROJECT_PATH}/projectMembers/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, projectMembers } = this.props;
    const { modalVisible, editData } = projectMembers;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['projectMembers/save'],
    };
  };

  render() {
    const { projectMembers } = this.props;
    const { modalVisible } = projectMembers;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default ProjectMembers;
