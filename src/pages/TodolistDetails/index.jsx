import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button,Select, Tag, Input } from 'antd';
import { ExtTable, ExtIcon, Space,ComboList, utils } from 'suid';
import { message, Row, Col } from 'antd';
import ExtAction from '@/components/ExtAction';
import EditModal from './EditModal';
import { constants, exportXlsx } from "@/utils";
import BillEditModal from './BillEditModal';

import styles from './index.less'
import logo1 from '../../../static/proj-one.png'
import logo2 from '../../../static/proj-two.png'
import logo3 from '../../../static/proj-three.png'
import logo4 from '../../../static/proj-four.png'
import logo5 from '../../../static/proj-five.png'
import logo6 from '../../../static/proj-six.png'
import logo7 from '../../../static/proj-seven.png'
import logo8 from '../../../static/proj-eight.png'

const { request } = utils;
const { Option } = Select;
const {PROJECT_PATH,SERVER_PATH} = constants
@withRouter
@connect(({ todolistDetails, loading }) => ({ todolistDetails, loading }))
class TodolistDetails extends Component {
  // eslint-disable-next-line react/sort-comp
  state = {
    delId: null,
    closingStatusFilter: null,
    orgnameFilter: null,
    documentStatusFilter:null,
    ondutyNameFilter:null,
    flowStatusFilter:null,
    employee: [],
    orgnameList: [],
    closingStatusList: [ // 结案状态
      {
        id: 1,
        name: '合格',
      },
      {
        id: 2,
        name: '不合格',
      },
    ],
    documentStatusList: [ // 结案状态
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
    flowStatusList: [ // 单据状态
    {
      id: 1,
      name: '起草',
      value: 'INIT',
    },
    {
      id: 2,
      name: '流程中',
      value: 'INPROCESS',
    },
    {
      id: 3,
      name: '已完成',
      value: 'COMPLETED'
    },
  ],
  };

  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.handlerSearch();
    // 科室名称
    dispatch({
      type: 'todolistDetails/getOrgnameList',
      payload:{}
    }).then(res => {
      const { data } = res;
      const orgObj = []
      for(let item of data){
        if(item.name !== '中心办' && (item.nodeLevel === 3 || item.nodeLevel === 2)){
          orgObj.push({
              code:item.code,
              name:item.name,
              extorgname:item.extorgname
          })
        }
      }
      this.setState({
        orgnameList : orgObj
      })
    })
    // dispatch({
    //   type: 'todolistDetails/getOrgname',
    // }).then(res => {
    //   if(res.success){
    //     this.setState({
    //       orgnameList : res.data
    //     })
    //   }
    // })
    // 人员名单
    dispatch({
      type: 'todolistDetails/findEmp',
      payload: {
        filters: [

        ],
      },
    }).then(res => {
      const { data } = res;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < data.length; i++) {
        this.state.employee.push(
        <Option
          key={data[i].employeeName}
          orgname={data[i].orgname.substr(data[i].orgname.lastIndexOf('-') + 1)}
        >
          {data[i].employeeName}
        </Option>);
      }
    });
  }

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

  /**
   * 获取过滤条件返回后端
   * @returns
   */
  getTableFilters = () => {
      const {  documentStatusFilter, closingStatusFilter, orgnameFilter, ondutyNameFilter, flowStatusFilter } = this.state;
      const filters = [];

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
    if (orgnameFilter) {
      filters.push({
        fieldName: 'orgname',
        operator: 'EQ',
        fieldType: 'string',
        value: orgnameFilter,
      });
    }
    if (ondutyNameFilter) {
      filters.push({
        fieldName: 'ondutyName',
        operator: 'LK',
        fieldType: 'string',
        value: ondutyNameFilter,
      });
    }
    if (flowStatusFilter) {
      filters.push({
        fieldName: 'flowStatus',
        operator: 'IN',
        fieldType: 'string',
        value: flowStatusFilter,
      });
    }
      return filters;
    };

  handleSave = (data) => {
    this.dispatchAction({
      type: 'todolistDetails/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        let saveData = res.data
        this.dispatchAction({
          type: 'todolistDetails/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.dispatchAction({
          type: 'todolistDetails/getUserInfo',
          payload: {
            code: saveData.ondutyCode,
          }
        }).then(result => {
          if(result.success){
            saveData.confirmedby1 = result.data.id
            this.dispatchAction({
              type: 'todolistDetails/saveUserId',
              payload: saveData,
            }).then(result1 => {
              if(data.id === undefined){
                this.handleEvent('edit',result1.data)
              }
            })
          }
        })
      }
    })
    this.refresh();
  };

  handleSubmit = (data,key) => {
    this.dispatchAction({
      type: 'todolistDetails/save',
      payload: data,
    }).then(res => {
      if (res) {
        let saveData = res.data
        this.dispatchAction({
          type: 'todolistDetails/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.dispatchAction({
          type: 'todolistDetails/getUserInfo',
          payload: {
            code: saveData.ondutyCode,
          }
        }).then(result => {
          if(result){
            saveData.confirmedby1 = result.data.id
            this.dispatchAction({
              type: 'todolistDetails/saveUserId',
              payload: saveData,
            }).then(result1 => {
              if(data.id === null){
                this.handleEvent('edit',result1.data)
              }
            })
          }
        })
      }
    })
    // this.refresh();
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

  handleBillClose = () => {
    this.dispatchAction({
      type: 'todolistDetails/updateState',
      payload: {
        billModalVisible: false,
        id: null,
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

  filterMenusData = item => {
    // const useThis = this;
    const menusData = [
      // {
      //   title: '修改',
      //   key: 'edit',
      //   canClick: item.flowStatus === 'INIT' || item.flowStatus === null,
      // },
      {
        title: '修改/查看',
        key: 'view',
        icon: 'file-search',
        canClick: item.flowStatus === 'INIT' || item.flowStatus == null,
      },
      {
        title: '审核历史',
        key: 'flowHistory',
        canClick: item.flowStatus !== 'INIT' && item.flowStatus != null,
        props: {
          businessId: item.id,
          store: {
            baseUrl: SERVER_PATH,
          },
        },
      },
      {
        title: '查看表单',
        key: 'checkBill',
        canClick:  item.flowStatus !== 'INIT' && item.flowStatus != null,
      },
      // {
      //   title: '删除',
      //   key: 'del',
      //   // canClick: item.creatorId === getCurrentUser().userId && false,
      //   canClick: true
      // },


      // {
      //   title: '提交审批',
      //   key: 'flow',
      //   canClick: item.creatorId === getCurrentUser().userId && item.flowStatus === 'INIT',
      //   props: {
      //     businessKey: item.id,
      //     startComplete: () => useThis.reloadData(),
      //     businessModelCode: 'com.donlim.ess.entity.EssGoodsDelivery',
      //     store: {
      //       baseUrl: SERVER_PATH,
      //     },
      //   },
      // },
    ];
    return menusData.filter(a => a.canClick);
  };

  toBill = recordItem => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'todolistDetails/getTaskId',
    //   payload: {
    //     id: recordItem.id,
    //   },
    // })
    // .then(res => {
    //   if(res.success){
        this.props.history.push({
          pathname: '/pm/ApproveEdit',
          query: {
            id: recordItem.id,
          },
        });
    //   }
    // });
  };

  handlerAction = (key, recordItem) => {
    switch (key) {
      // case 'edit':
      //   console.log('edit')
      //   this.handleEvent('edit',recordItem)
      //   // this.pageJump(recordItem);
      //   break;
      case 'view':
        this.handleEvent('edit',recordItem)
        // this.pageJumpNext(recordItem);
        break;
      case 'checkBill':
        this.openModal(recordItem)
          break;
      case 'del':
        break;
      default:
        break;
    }
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
        render: (id, record) => (
          <Space>
            <ExtAction
              key={id}
              onAction={this.handlerAction}
              menusData={this.filterMenusData(record)}
              recordItem={record}
            />
          </Space>
          // <Space>
          //   <ExtIcon
          //     hidden={!(record.flowStatus === null)}
          //     key="edit"
          //     className="edit"
          //     onClick={() => this.handleEvent('edit', record)}
          //     type="edit"
          //     status="success"
          //     tooltip={{ title: '编辑' }}
          //     antd
          //   />
          //   <Popconfirm
          //     key="del"
          //     placement="topLeft"
          //     title="确定要删除吗？"
          //     onConfirm={() => this.handleEvent('del', record)}
          //   >
          //     {this.renderDelBtn(record)}
          //   </Popconfirm>
          // </Space>
        ),
      },
      {
        title: '待办事项',
        dataIndex: 'todoList',
        width: 550,
        required: true,
      },
      {
        title: '最新进度说明',
        dataIndex: 'newestProgress',
        width: 550,
        required: true,
      },
      {
        title: '责任人',
        dataIndex: 'ondutyName',
        width: 100,
        required: true,
      },
      {
        title: '科室',
        dataIndex: 'orgname',
        width: 100,
        required: true,
      },
      {
        title: '要求完成日期',
        dataIndex: 'completionDate',
        required: true,
      },
      {
        title: '结案状态',
        dataIndex: 'closingStatus',
        width: 100,
        required: true,
      },
      {
        title: '最新确认时间',
        dataIndex: 'confir1Time',
        width: 100,
        required: true,
      },
      {
        title: '建议状态',
        dataIndex: 'proposalStatus',
        width: 100,
        required: true,
      },
      {
        title: '完成比率',
        dataIndex: 'completion',
        width: 100,
        required: true,
      },
      {
        title: '验证人',
        dataIndex: 'confirmedby2',
        width: 100,
        required: true,
      },
      {
        title: '验证时间',
        dataIndex: 'confirmationTime',
        required: true,
      },
      {
        title: '逾期天数',
        dataIndex: 'overedDays',
        width: 100,
        required: true,
      },
      {
        title: '单据状态',
        dataIndex: 'flowStatus',
        width: 100,
        required: true,
        render: (_, row) => {
          if (row.flowStatus === "INIT" || row.flowStatus === null) {
            return <Tag color="blue">起草</Tag>;
          }else if(row.flowStatus === "INPROCESS"){
            return <Tag color="red">流程中</Tag>;
          }else if(row.flowStatus === "COMPLETED"){
            return <Tag color="green">已完成</Tag>;
          }

        },
      },
      // {
      //   title: '来源',
      //   dataIndex: 'source',
      //   width: 220,
      //   required: true,
      // },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 200,
        required: true,
      },
      {
        title: '提出人',
        dataIndex: 'advisor',
        width: 100,
        required: true,
      },
      {
        title: '提出日期',
        dataIndex: 'submitDate',
        required: true,
      },
      {
        title: '起草人',
        dataIndex: 'submitName',
        width: 100,
        required: true,
      },
      {
        title: '协助人',
        dataIndex: 'assistName',
        width: 100,
        required: true,
      },
      {
        title: '协助人科室',
        dataIndex: 'assistOrgname',
        width: 100,
        required: true,
      },
    ];
    const toolBarProps = {
      layout: { leftSpan: 22, rightSpan: 2 },
      left: (
        <Space>
          责任人:{' '}
          <Input style={{width:"150px"}} onChange={(event) => this.setState({ ondutyNameFilter: event.target.value })} allowClear></Input>
          单据状态:{' '}
          <ComboList
            style={{ width: '150px', marginRight: '12px' }}
            showSearch={false}
            pagination={false}
            allowClear
            dataSource={this.state.flowStatusList}
            name="name"
            field={['name']}
            afterClear={() => this.setState({ flowStatusFilter: null })}
            afterSelect={item =>
              this.setState({ flowStatusFilter: item.value })
            }
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
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
              this.setState({ closingStatusFilter: item.name })
            }
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
          科室名称:{' '}
          <ComboList
            style={{ width: '150px', marginRight: '12px' }}
            // showSearch={false}
            pagination={false}
            allowClear
            dataSource={this.state.orgnameList}
            name="name"
            field={['name']}
            afterClear={() => this.setState({ orgnameFilter: null })}
            afterSelect={item =>
              this.setState({ orgnameFilter: item.name })
            }
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
          {/* 单据状态:{' '}
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
          /> */}
          <Button onClick={() => {this.handlerSearch()}}>查询</Button>
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
          <Button onClick={this.handlerExport}>导出</Button>
          {/* <Button onClick={() => this.tableRef.extTool.exportData()}>导出</Button> */}
        </Space>
      ),
    };
    const filters = this.getTableFilters();
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      exportData: true,
      showSearch:false,
      searchProperties: ['ondutyName'],
      searchPlaceHolder: '请根据责任人查询',
      onTableRef: inst => (this.tableRef = inst),
      cascadeParams: {
        filters,
      },
      dataSource: this.state.dataList,
      // store: {
      //   type: 'POST',
      //   url:
      //   `${PROJECT_PATH}/todoList/projFindByPage2`,
      // },
    };
  };

  handlerExport = () => {
    const tableFilters = this.getTableFilters();
    request.post(`${PROJECT_PATH}/todoList/export`, { filters: tableFilters }).then(res => {
      const { success, data } = res;
      if (success && data.length > 0) {
        exportXlsx(
          '待办清单明细',
          [
            '待办事项',
            '责任人',
            '科室',
            '要求完成日期',
            '结案状态',
            '最新确认时间',
            '最新进度说明',
            '建议状态',
            '完成比率',
            '验证人',
            '验证时间',
            '逾期天数',
            '单据状态',
            '备注',
            '提出人',
            '提出日期',
            '起草人',
            '协助人',
            '协助人科室',
          ],
          data,
        );
      } else {
        message.error('没找到数据');
      }
    });
  };

  upload = () => {
    this.dispatchAction({
      type: 'todolistDetails/updateState',
      payload: {

        modalVisibleSche: true
      },
    });
  };

  getEditModalProps = () => {
    const { loading, todolistDetails } = this.props;
    const { modalVisible, editData } = todolistDetails;
    const { employee } = this.state

    return {
      onSave: this.handleSave,
      onSubmit: this.handleSubmit,
      dispatch: this.props.dispatch,
      editData,
      employee,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['todolistDetails/save'],
    };
  };

  /** 查看表单 */
  openModal = (row) =>{
    this.dispatchAction({
      type: 'todolistDetails/updateState',
      payload: {
        billModalVisible: true,
        id: row.id,
        editData: row,
      },
    });
  }

  getBillEditModalProps = () => {
    const { loading, todolistDetails } = this.props;
    const { billModalVisible, id, editData } = todolistDetails;

    return {
      id,
      editData,
      visible: billModalVisible,
      onClose: this.handleBillClose,
      sync: loading.effects['todolistDetails/updateState'],
    };
  };

  // 查询报表数据
  handlerSearch = () => {
    const tableFilters = this.getTableFilters();
    const { dispatch } = this.props;
    dispatch({
      type: 'todolistDetails/projFindByPage2',
      payload:{
        filters: tableFilters
      }
    }).then(res => {
      const { data } = res
      if(res.success){
        this.setState({
          dataList: data
        })
        this.handlerSummarySearch()
      }
    })
    this.refresh()
  }

  // 查询统计数据
  handlerSummarySearch = () => {
    const tableFilters = this.getTableFilters();
    const { dispatch } = this.props;
    dispatch({
      type: 'todolistDetails/projFindByPage2Summary',
      payload:{
        filters: tableFilters
      }
    }).then(res => {
      const { data } = res
      if(res.success){
        debugger
        this.setState({
          processingNum: data.processingNum,
          sumNum: data.sumNum,
          notStartedNum: data.notStartedNum,
          finishNum: data.finishNum,
          overTimeNum: data.overTimeNum,
          preOverTimeNum: data.preOverTimeNum,
          overTimeDay: data.overTimeDay,
          advanceDay: data.advanceDay,
        })
      }
    })
  }

  render() {
    const { todolistDetails } = this.props;
    const { modalVisible, billModalVisible } = todolistDetails;

    return (
      <>
        <div className={styles['container']}>
          <Row style={{height:"170px"}} className="row-content">
              <div style={{margin:"9px 12px",background:"white",height:"152px",borderRadius:"4px"}}>
                <div>
                <Col className="col-content">
                    <div className="item item-color3">
                      <div className="item-img">
                        <img src={logo1} width={80} height={80}></img>
                        <div style={{padding:"0 20px"}}>
                          <div className="item-text1">{this.state.sumNum}</div>
                          <div className="item-text2">待办总数</div>
                        </div>
                      </div>
                    </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color1">
                    <div className="item-img">
                      <img src={logo2} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">{this.state.notStartedNum}</div>
                        <div className="item-text2">未开始</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color2">
                    <div className="item-img">
                      <img src={logo3} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">{this.state.processingNum}</div>
                        <div className="item-text2">进行中</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color4">
                    <div className="item-img">
                      <img src={logo4} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">{this.state.finishNum}</div>
                        <div className="item-text2">已结案</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color1">
                    <div className="item-img">
                      <img src={logo5} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">{this.state.preOverTimeNum}</div>
                        <div className="item-text2">预逾期</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color5">
                    <div className="item-img">
                      <img src={logo6} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">{this.state.overTimeNum}</div>
                        <div className="item-text2">已逾期</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color3">
                    <div className="item-img">
                      <img src={logo7} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">{this.state.advanceDay}</div>
                        <div className="item-text2">提前天数</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color4">
                    <div className="item-img">
                      <img src={logo8} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">{this.state.overTimeDay}</div>
                        <div className="item-text2">逾期天数</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </div>
            </div>
          </Row>
          <Row style={{height:"calc(100% - 182px)",padding:"0 12px"}}>
            <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
          </Row>
        </div>

        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
        {billModalVisible ? <BillEditModal {...this.getBillEditModalProps()} /> : null}
      </>
    );
  }
}

export default TodolistDetails;
