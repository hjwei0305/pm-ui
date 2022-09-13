import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Popconfirm, Input, Descriptions } from 'antd';
import { ExtTable, ExtIcon, Space } from 'suid';
import Filter from '@/components/Filter';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;

@withRouter
@connect(({ pmBaseInfoEdit, loading }) => ({ pmBaseInfoEdit, loading }))
class PmLog extends Component {
  state = {
    delId: null,
    fliterCondition: null,
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
          type: 'pmLog/updateState',
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
              type: 'pmLog/del',
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
      type: 'pmLog/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'pmLog/updateState',
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
      type: 'pmLog/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

    /**
   *
   * @returns 项目待办过滤
   */
     getTableFilters = () =>{
      const filters = [];
      filters.push({
        fieldName: 'projectId',
        operator: 'EQ',
        fieldType: 'string',
        value: this.props.id,
      });
      
      return filters;
    }

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['pmLog/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getExtableProps = () => {
    const { filterConditon } = this.state;
    const columns = [
      // {
      //   title: '操作',
      //   key: 'operation',
      //   width: 100,
      //   align: 'center',
      //   dataIndex: 'id',
      //   className: 'action',
      //   required: true,
      //   render: (_, record) => (
      //     <Space>
      //       <ExtIcon
      //         key="edit"
      //         className="edit"
      //         onClick={() => this.handleEvent('edit', record)}
      //         type="edit"
      //         status="success"
      //         tooltip={{ title: '编辑' }}
      //         antd
      //       />
      //       <Popconfirm
      //         key="del"
      //         placement="topLeft"
      //         title="确定要删除吗？"
      //         onConfirm={() => this.handleEvent('del', record)}
      //       >
      //         {this.renderDelBtn(record)}
      //       </Popconfirm>
      //     </Space>
      //   ),
      // },
      // {
      //   title: '代码',
      //   dataIndex: 'code',
      //   width: 120,
      //   required: true,
      // },
      {
        title: '操作人',
        dataIndex: 'employeeName',
        width: 220,
        required: true,
      },
      {
        title: '操作的内容',
        dataIndex: 'content',
        width: 220,
        required: true,
      },
      {
        title: '操作时间',
        dataIndex: 'createdDate',
        width: 220,
        required: true,
      },
    ];
    const toolBarProps = {
      // left: (
      //   <Space>
      //     <Button
      //       key="add"
      //       type="primary"
      //       onClick={() => {
      //         this.handleEvent('add', null);
      //       }}
      //       ignore="true"
      //     >
      //       新建
      //     </Button>
      //     <Button onClick={this.refresh}>刷新</Button>
      //   </Space>
      // ),
      extra: (
        <Filter
          width="30%"
          filterOverlay={filterConditon ? (
            <div style={{ width: 300 }}>
              <Descriptions colon>
                <Descriptions.Item label="代码">
                  {filterConditon.code}
                </Descriptions.Item>
                <Descriptions.Item label="名称">
                  {filterConditon.name}
                </Descriptions.Item>
              </Descriptions>
            </div>
          ) : null}
          showClear={!!filterConditon}
          onFilter={value => {
            this.setState({
              filterConditon: value,
            })
          }}
          onReset={() => {
            this.setState({
              filterConditon: null
            })
          }}
        >
          {(FormItem, form) => {
            const { getFieldDecorator } = form;
            return (
              <>
                <FormItem label="代码">
                  {getFieldDecorator('code')(<Input />)}
                </FormItem>
                <FormItem label="名称">
                  {getFieldDecorator('name')(<Input />)}
                </FormItem>
              </>
            );
          }}
        </Filter>
      ),
    };
    const filters = this.getTableFilters();
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      cascadeParams: filterConditon,
      remotePaging: true,
      cascadeParams: {
        filters,
      },
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/pmLog/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, pmLog } = this.props;
    const { modalVisible, editData } = pmLog;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['pmLog/save'],
    };
  };

  render() {
    // const { pmLog } = this.props;
    // const { modalVisible } = pmLog;

    return (
      <>
        <ExtTable style={{height:"600px"}} onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {/* {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null} */}
      </>
    );
  }
}

export default PmLog;
