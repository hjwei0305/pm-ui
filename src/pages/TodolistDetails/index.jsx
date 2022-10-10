import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Popconfirm } from 'antd';
import { ExtTable, ExtIcon, Space,ComboList } from 'suid';
import EditModal from './EditModal';
import {constants} from "@/utils";

const {PROJECT_PATH} = constants
@withRouter
@connect(({ todolistDetails, loading }) => ({ todolistDetails, loading }))
class TodolistDetails extends Component {
  state = {
    delId: null,
    closingStatusFilter: null,
    documentStatusFilter:null,
    closingStatusList: [
      {
        id: 1,
        name: '合格',
      },
      {
        id: 2,
        name: '不合格',
      },
    ],
    documentStatusList: [
      {
        id: 1,
        name: '起草',
      },
      {
        id: 2,
        name: '确认中',
      },
      {
        id: 3,
        name: '已结案',
      },
    ],
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
          type: 'todolistDetails/updateState',
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
              type: 'todolistDetails/del',
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
    // 导出
  // export = () => {
  //     const tableFilters = this.getTableFilters();
  //     exportHandle(
  //       '/todoList/exportDept',
  //       {
  //         filters: tableFilters,
  //       },
  //       '待办列表清单',
  //     );
  // };

  getTableFilters = () => {
      const {  documentStatusFilter, closingStatusFilter } = this.state;
      const filters = [];
      console.log(this.state)

      // if (codeFilter) {
      //   filters.push({
      //     fieldName: 'submitName',
      //     operator: 'EQ',
      //     fieldType: 'string',
      //     value: codeFilter,
      //   });
      // }
    if (documentStatusFilter) {
      filters.push({
        fieldName: 'documentStatus',
        operator: 'EQ',
        fieldType: 'string',
        value: documentStatusFilter,
      });
    }
    if (closingStatusFilter) {
      filters.push({
        fieldName: 'closingStatus',
        operator: 'EQ',
        fieldType: 'string',
        value: closingStatusFilter,
      });
    }
      return filters;
    };

  handleSave = data => {
    this.dispatchAction({
      type: 'todolistDetails/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'todolistDetails/updateState',
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
      type: 'todolistDetails/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['todolistDetails/del'] && delId === row.id) {
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
            <Popconfirm
              key="del"
              placement="topLeft"
              title="确定要删除吗？"
              onConfirm={() => this.handleEvent('del', record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          </Space>
        ),
      },
      {
        title: '提出日期',
        dataIndex: 'submitDate',
        width: 120,
        required: true,
      },
      {
        title: '起草人',
        dataIndex: 'submitName',
        width: 220,
        required: true,
      },
      {
        title: '待办事项',
        dataIndex: 'todoList',
        width: 220,
        required: true,
      },
      {
        title: '责任人',
        dataIndex: 'ondutyName',
        width: 220,
        required: true,
      },
      {
        title: '要求完成日期',
        dataIndex: 'completionDate',
        width: 220,
        required: true,
      },
      {
        title: '确认人(确认阶段)',
        dataIndex: 'confirmedby1',
        width: 220,
        required: true,
      },
      {
        title: '建议状态',
        dataIndex: 'proposalStatus',
        width: 220,
        required: true,
      },
      {
        title: '完成情况',
        dataIndex: 'completion',
        width: 220,
        required: true,
      },
      {
        title: '确认人(验证阶段)',
        dataIndex: 'confirmedby2',
        width: 220,
        required: true,
      },
      {
        title: '确认时间',
        dataIndex: 'confirmationTime',
        width: 220,
        required: true,
      },
      {
        title: '结案状态',
        dataIndex: 'closingStatus',
        width: 220,
        required: true,
      },
      {
        title: '单据状态',
        dataIndex: 'documentStatus',
        width: 220,
        required: true,
      },
      {
        title: '来源',
        dataIndex: 'source',
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
      layout: { leftSpan: 16, rightSpan: 8 },
      left: (
        <Space>
          结案状态:{' '}
          <ComboList
            style={{ width: '150px', marginRight: '12px' }}
            showSearch={false}
            pagination={false}
            allowClear
            dataSource={this.state.closingStatusList}
            name="name"
            field={['name']}
            afterClear={() => this.setState({ closingStatusFilter: null })}
            afterSelect={item =>
              // console.log(item)
              this.setState({ closingStatusFilter: item.name })
            }
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
          单据状态:{' '}
          <ComboList
            style={{ width: '150px', marginRight: '12px' }}
            showSearch={false}
            pagination={false}
            allowClear
            dataSource={this.state.documentStatusList}
            name="name"
            field={['name']}
            afterClear={() => this.setState({ documentStatusFilter: null })}
            afterSelect={item => this.setState({ documentStatusFilter: item.name })}
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
          <Button
            key="add"
            type="primary"
            onClick={() => {
              this.handleEvent('add', null);
            }}
            ignore="true"
          >
            新增
          </Button>
          {/* <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: '12px' }}
            onClick={this.export}
          >
            导出
          </Button> */}
        </Space>
      ),
    };
    const filters = this.getTableFilters();
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      searchProperties: ['ondutyName'],
      searchPlaceHolder: '请根据责任人查询',
      cascadeParams: {
        filters,
      },
      store: {
        type: 'POST',
        url:
        `${PROJECT_PATH}/todoList/projFindByPage2`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, todolistDetails } = this.props;
    const { modalVisible, editData } = todolistDetails;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['todolistDetails/save'],
    };
  };

  render() {
    const { todolistDetails } = this.props;
    const { modalVisible } = todolistDetails;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default TodolistDetails;
