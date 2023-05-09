import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Popconfirm } from 'antd';
import { ExtTable, ExtIcon, Space, utils } from 'suid';
import { constants,exportXlsx } from '@/utils';
import EditModal from './EditModal';
import AttEditModal from './AttEditModal'

const { PROJECT_PATH } = constants;
const { request } = utils;

@withRouter
@connect(({ pmBaseInfoEdit, loading }) => ({ pmBaseInfoEdit, loading }))
class PmBaseinfoWeek extends Component {
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
          type: 'pmBaseInfoEdit/updateState',
          payload: {
            weekModalVisible: true,
            weekData: row,
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
              type: 'pmBaseInfoEdit/delWeekPlan',
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

  // 保存双周计划
  handleSave = data => {
    this.dispatchAction({
      type: 'pmBaseInfoEdit/saveWeekPlan',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'pmBaseInfoEdit/updateState',
          payload: {
            weekModalVisible: false,
          },
        });
        this.refresh();
      }
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['pmBaseInfoEdit/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getExtableProps = () => {
    const { id } = this.props
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
          <Space>
            <ExtIcon
              key="edit"
              className="edit"
              onClick={() => this.handleEvent('edit', record)}
              type="edit"
              status="success"
              tooltip={{ title: '编辑' }}
              antd
            />
            {/* <Popconfirm
              key="del"
              placement="topLeft"
              title="确定要删除吗？"
              onConfirm={() => this.handleEvent('del', record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm> */}
          </Space>
        ),
      },
      {
        title: '周数',
        dataIndex: 'week',
        width: 120,
        required: true,
      },
      {
        title: '本周计划',
        dataIndex: 'weekPlan',
        width: 220,
        required: true,
      },
      {
        title: '下周计划',
        dataIndex: 'nextWeekPlan',
        width: 220,
        required: true,
      },
      {
        title: '工作风险',
        dataIndex: 'workRisk',
        width: 220,
        required: true,
      },
      {
        title: '产出',
        // dataIndex: 'workRisk',
        width: 220,
        required: true,
        render: (_, record) => (
          <Button type="primary" onClick={() => this.checkUpload(record.id)}>查看附件</Button>
        )
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
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
        </Space>
      ),
    };
    const filters = [{
      fieldName: 'baseinfoId',
      operator: 'EQ',
      fieldType: 'string',
      value: id,
    }];
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      cascadeParams: {
        filters,
      },
      store: {
        type: 'POST',
        url:
          `${PROJECT_PATH}/pmBaseinfoWeek/findByPage`,
      },
    };
  };

  // 打开编辑弹窗
  getEditModalProps = () => {
    const { loading, pmBaseInfoEdit, id, dispatch } = this.props;
    const { weekModalVisible, weekData } = pmBaseInfoEdit;

    return {
      dispatch,
      onSave: this.handleSave,
      id,
      weekData,
      visible: weekModalVisible,
      onClose: this.handleClose,
      saving: loading.effects['pmBaseInfoEdit/saveWeekPlan'],
    };
  };

  // 关闭编辑弹窗
  handleClose = () => {
    this.dispatchAction({
      type: 'pmBaseInfoEdit/updateState',
      payload: {
        weekModalVisible: false,
        weekData: null,
      },
    });
  };

  // 打开附件弹窗
  checkUpload = (id) => {
    this.dispatchAction({
      type: 'pmBaseInfoEdit/updateState',
      payload: {
        weekAttId: id,
        weekAttModalVisible: true,
      },
    });
  };

  // 关闭附件弹窗
  handleAttEditModalClose = () => {
    this.dispatchAction({
      type: 'pmBaseInfoEdit/updateState',
      payload: {
        weekAttModalVisible: false,
        weekAttId: null,
      },
    });
  };
  
  // 附件查看弹窗
  getAttEditModalProps = () => {
    const { loading, pmBaseInfoEdit } = this.props;
    const { weekAttModalVisible, weekAttId } = pmBaseInfoEdit;

    return {
      weekAttId,
      visible: weekAttModalVisible,
      onClose: this.handleAttEditModalClose,
      saving: loading.effects['pmBaseInfoEdit/saveWeekPlan'],
    };
  };

  render() {
    const { pmBaseInfoEdit } = this.props;
    const { weekModalVisible, weekAttModalVisible } = pmBaseInfoEdit;

    return (
      <>
        <ExtTable style={{height:"600px"}} onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {weekModalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
        {weekAttModalVisible ? <AttEditModal {...this.getAttEditModalProps()} /> : null}
      </>
    );
  }
}

export default PmBaseinfoWeek;
