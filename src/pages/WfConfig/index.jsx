import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Popconfirm } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import EditModal from './EditModal';
import {constants} from "@/utils";

const {PROJECT_PATH} = constants
@withRouter
@connect(({ wfConfig, loading }) => ({ wfConfig, loading }))
class WfConfig extends Component {
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
          type: 'wfConfig/updateState',
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
              type: 'wfConfig/del',
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
      type: 'wfConfig/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'wfConfig/updateState',
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
      type: 'wfConfig/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['wfConfig/del'] && delId === row.id) {
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
        title: '代码',
        dataIndex: 'code',
        width: 120,
        required: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 220,
        required: true,
      },
      {
        title: '流程顺序',
        dataIndex: 'wfNo',
        width: 100,
        required: false,
      },
      {
        title: '流程名称流程名称',
        dataIndex: 'wfName',
        width: 100,
        required: false,
      },
      {
        title: '节点顺序',
        dataIndex: 'nodeNo',
        width: 100,
        required: false,
      },
      {
        title: '节点名称',
        dataIndex: 'nodeName',
        width: 100,
        required: false,
      },
      {
        title: '有无附件',
        dataIndex: 'nodeAttachement',
        width: 100,
        required: false,
      },
      {
        title: '附件名称',
        dataIndex: 'nodeAttachementName',
        width: 100,
        required: false,
      },
      {
        title: '节点启用',
        dataIndex: 'isFrozen',
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
          `${PROJECT_PATH}/wfConfig/findByPage`, 
      },
    };
  };

  getEditModalProps = () => {
    const { loading, wfConfig } = this.props;
    const { modalVisible, editData } = wfConfig;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['wfConfig/save'],
    };
  };

  render() {
    const { wfConfig } = this.props;
    const { modalVisible } = wfConfig;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default WfConfig;
