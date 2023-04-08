import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Popconfirm, Tag, Select, message } from 'antd';
import { ExtTable, ExtIcon, Space } from 'suid';
import EditModal from './EditModal';
import {constants} from "@/utils";

const { Option } = Select;

const {PROJECT_PATH} = constants;

@withRouter
@connect(({ projectOption, loading }) => ({ projectOption, loading }))
class ProjectOption extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    dispatch({
      type: 'projectOption/getProOpt',
      payload:{}
    }).then(res => {
      const { data } = res;
      this.setState({
        dictValues: data
      })
      for (let i = 0; i < data.length; i++) {
        this.state.proOptList.push(<Option key={data[i].dataValue}>{data[i].dataName}</Option>);
      }
    })
  }

  state = {
    delId: null,
    proOptList:[],
    dictValues: []
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
          type: 'projectOption/updateState',
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
              type: 'projectOption/del',
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
    debugger
    if(data.proOpt === ''){
      message.error('流程配置不能为空')
      return
    }
    this.dispatchAction({
      type: 'projectOption/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'projectOption/updateState',
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
      type: 'projectOption/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['projectOption/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getExtableProps = () => {
    const { dictValues } = this.state
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
        title: '配置名称',
        dataIndex: 'proName',
        width: 120,
        required: true,
      },
      {
        title: '流程配置',
        dataIndex: 'proOpt',
        width: 500,
        required: true,
        render: (_, row) => {
          var proOptArr = row.proOpt.split(',')
          var result = ''
          proOptArr.map((arr) =>{
            for(let item of dictValues){
              if(item.dataValue == arr){
                result = result + item.dataName + "，"
              }
              
            }
          })


          return result
          
          // return row.proOpt
          // if (row.proOpt != '') {
          //   var result = ''
          //   row.proOpt.split(',').map((map) => 
          //     result = result + map + ","
          //   )
          //   return result
          // }
        },
      },
      {
        title: '启用',
        dataIndex: 'usable',
        width: 220,
        required: true,
        render: (_, row) => {
          if (row.usable) {
            return <Tag color="green">是</Tag>;
          }
          return <Tag color="red">否</Tag>;
        },
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
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/pmProjectOption/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { dispatch, loading, projectOption } = this.props;
    const { modalVisible, editData } = projectOption;
    const { proOptList } = this.state

    var a = editData

    return {
      onSave: this.handleSave,
      editData,
      dispatch,
      proOptList,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['projectOption/save'],
    };
  };

  render() {
    const { projectOption } = this.props;
    const { modalVisible } = projectOption;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default ProjectOption;
