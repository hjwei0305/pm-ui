import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Popconfirm } from 'antd';
import { ExtTable, ExtIcon, Space, SplitLayout, ComboList } from 'suid';
import EditModal from './EditModal';

//导入PROJECT_PATH
import { constants } from '@/utils';
const { PROJECT_PATH } = constants;

@withRouter
@connect(({ demo, loading }) => ({ demo, loading }))
class Demo extends Component {
  state = {
    delId: null,
  };

  // 钩子箭头函数
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'demo/getOrgList',
    })
    // console.log(this.props.demo)
    .then(res => {
      debugger
      const { success, data } = res;
      if (success) {
        this.setState({
          orgList: data,
        });
      }
    });
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
          type: 'demo/updateState',
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
              type: 'demo/del',
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
      type: 'demo/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'demo/updateState',
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
      type: 'demo/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['demo/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  handleSearch = () => {
    // 更新表格
    this.tableRef.remoteDataRefresh();
  };

  getTableFilter = () => {
    const { orgnameFilter } = this.state;
    const filters = [];
    if (orgnameFilter) {
      filters.push({
        fieldName: 'orgname',
        value: orgnameFilter,
        fieldType: 'string',
        operator: 'LK',
      });
    }
    return filters;
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
        title: '部门/科室名称',
        dataIndex: 'name',
        width: 220,
        required: true,
      },
      {
        title: '科室负责人',
        dataIndex: 'manager',
        width: 220,
        required: true,
      },
      {
        title: '结案数量',
        dataIndex: 'finishNum',
        width: 220,
        required: true,
      },
      {
        title: '未结案数量',
        dataIndex: 'notFinishNum',
        width: 220,
        required: true,
      },
      {
        title: '项目总数',
        dataIndex: 'totalNum',
        width: 220,
        required: true,
      },
      {
        title: '暂停数量',
        dataIndex: 'pauseNum',
        width: 220,
        required: true,
      },


    ];
    const toolBarProps = {
      left: (
        <Space>
          科室名称：
          <ComboList
            style={{ width: 200 }}
            placeholder="请选择"
            rowKey="id"
            allowClear
            afterClear={() => this.setState({ orgnameFilter: null })}
            afterSelect={selected => this.setState({ orgnameFilter: selected.name })}
            dataSource={this.state.orgList}
            reader={{
              name: 'name',
              description: 'code',
              field: ['name','code'],
            }}
          />
          <Button type='primary' onClick={this.handleSearch}>查询</Button>
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
    const filters = this.getTableFilter();
    return {
      // 表格点击刷新表格二
      onRow: (record) => {
        return {
          onClick: () => {
            this.secondTableRef.remoteDataRefresh();
          },
        };
      },
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      // table入参
      cascadeParams: {
        filters,
      },
      // table请求
      store: {
        type: 'POST',
        url:`${PROJECT_PATH}/pmBaseinfo/getYearProjectReport`,
      },
    };
  };

  // 生成第二个表格Props
  getSecondExtableProps = () => {
    // 列只有负责人
    const columns = [
      {
        title: '负责人',
        dataIndex: 'manager',
        width: 220,
        required: true,
      },
    ]
    // 工具栏有新建、查询、刷新
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
          <Button type='primary' onClick={this.handleSearch}>查询</Button>
          <Button onClick={this.refresh}>刷新</Button>
        </Space>
      ),
    };
    // 表格过滤条件
    const filters = this.getTableFilter();
    return {
      // 表格点击刷新表格一
      onRow: (record) => {
        return {
          onClick: () => {
            this.tableRef.remoteDataRefresh();
          },
        };
      },
      columns,
      bordered: false,
      // toolBar: toolBarProps,
      remotePaging: true,
      // table入参
      cascadeParams: {
        filters,
      },
      // table请求
      store: {
        type: 'POST',
        url:`${PROJECT_PATH}/pmBaseinfo/getYearProjectReport`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, demo } = this.props;
    const { modalVisible, editData } = demo;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['demo/save'],
    };
  };

  // 渲染删除按钮
  renderDelBtn = record => {
    const { loading } = this.props;
    return (
      <ExtIcon
        key="del"
        className="del"
        type="delete"
        status="danger"
        tooltip={{ title: '删除' }}
        loading={loading.effects['demo/del']}
        record={record}
        onClick={() => this.handleEvent('del', record)}
        antd
      />
    );
  }



  render() {
    const { demo } = this.props;
    const { modalVisible } = demo;

    return (
      <>
      <SplitLayout>
        <div>
          <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        </div>
        <div>
          <ExtTable onTableRef={inst => (this.secondTableRef = inst)} {...this.getSecondExtableProps()} />
        </div>
      </SplitLayout>
      {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}

        {/* <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null} */}
      </>
    );
  }
}

export default Demo;
