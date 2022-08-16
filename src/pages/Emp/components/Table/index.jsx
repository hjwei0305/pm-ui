import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Popconfirm, message } from 'antd';
import { get } from 'lodash';
import { ExtTable, ExtIcon, Space, ProLayout } from 'suid';
import FormModal from './FormModal';

const { Header, Content } = ProLayout;

@connect(({ emp, loading }) => ({ emp, loading }))
class Table extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    const { dispatch, emp } = this.props;
    const { currNode } = emp;

    if (currNode) {
      dispatch({
        type: 'emp/queryListById',
        payload: {
          id: currNode.id,
        },
      });
    }
  };

  add = () => {
    const { dispatch, emp } = this.props;
    if (emp.currNode) {
      dispatch({
        type: 'emp/updateState',
        payload: {
          modalVisible: true,
          rowData: null,
        },
      });
    } else {
      message.warn('请选择左侧树形节点');
    }
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emp/updateState',
      payload: {
        rowData,
        modalVisible: true,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emp/save',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'emp/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'emp/del',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            this.setState({
              delRowId: null,
            });
            this.reloadData();
          }
        });
      },
    );
  };

  handleCloseModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emp/updateState',
      payload: {
        modalVisible: false,
        rowData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['emp/del'] && delRowId === row.id) {
      return <ExtIcon status="error" className="del-loading" type="loading" antd />;
    }
    return <ExtIcon status="error" type="delete" antd />;
  };

  getExtableProps = () => {
    const { loading, emp } = this.props;
    const { list } = emp;

    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 90,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (text, record) => (
          <Space>
            <ExtIcon
              key="edit"
              className="edit"
              onClick={() => this.edit(record)}
              type="edit"
              ignore="true"
              status="success"
              antd
            />
            <Popconfirm
              key="del"
              placement="topLeft"
              title="确定要删除吗, 删除后不可恢复？"
              onConfirm={() => this.del(record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          </Space>
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
        width: 120,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
          <Button key="add" type="primary" onClick={this.add} ignore="true">
            新建
          </Button>
          <Button onClick={this.reloadData}>刷新</Button>
        </Space>
      ),
    };
    return {
      bordered: false,
      columns,
      loading: loading.effects['emp/queryList'],
      toolBar: toolBarProps,
      dataSource: list,
    };
  };

  getFormModalProps = () => {
    const { loading, emp } = this.props;
    const { modalVisible, rowData, currNode } = emp;

    return {
      onSave: this.save,
      editData: rowData,
      visible: modalVisible,
      parentData: currNode,
      onClose: this.handleCloseModal,
      saving: loading.effects['emp/save'],
    };
  };

  render() {
    const { emp } = this.props;
    const { modalVisible, currNode } = emp;

    return (
      <ProLayout>
        <Header title="表格数据" subTitle={get(currNode, 'name')} />
        <Content>
          <ExtTable {...this.getExtableProps()} />
          {modalVisible && <FormModal {...this.getFormModalProps()} />}
        </Content>
      </ProLayout>
    );
  }
}

export default Table;
