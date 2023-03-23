import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Input , DatePicker, Row, Col, Button,Tag,message  } from 'antd';
import { ExtTable, ExtIcon, ComboList, Space,utils } from 'suid';
import { constants,exportXlsx } from '@/utils';
import EditModal from './EditModal';

import styles from './index.less'
import logo1 from '../../../static/proj-one.png'
import logo2 from '../../../static/proj-two.png'
import logo3 from '../../../static/proj-three.png'
import logo4 from '../../../static/proj-four.png'
import logo5 from '../../../static/proj-five.png'

const { PROJECT_PATH } = constants;
const { request } = utils;
@withRouter
@connect(({ pmBaseInfo, loading }) => ({ pmBaseInfo, loading }))
class PmBaseInfo extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    dispatch({
      type: 'pmBaseInfo/getProjectInfo',
      payload:{
      }
    }).then(res => {
      const { data } = res
      if(res.success){
        this.setState({
          notStartedNum: data.notStartedNum,
          processingNum: data.processingNum,
          sumNum: data.sumNum,
          advanceFinishNum: data.advanceFinishNum,
          preOverTimeNum:data.preOverTimeNum,
          advanceDay:data.advanceDay,
          overTimeDay:data.overTimeDay,
          overTimeNum: data.overTimeNum,
        })
      }
    })

    dispatch({
      type: 'pmBaseInfo/getChildrenNodes',
      payload:{}
    }).then(res => {
      const { data } = res;
      for(let item of data){
        if(item.nodeLevel === 3 || item.name === '系统运维管理部'){
          this.state.orgnameList.push({code:item.code,name:item.name,extorgname:item.extorgname})
        }
      }
    })

  }
static  projectMasterFilter=null;
static orgnameFilter=null;
  state = {
    orgnameList: [],
    notStartedNum: 0,
    processingNum: 0,
    sumNum: 0,
    advanceFinishNum: 0,
    preOverTimeNum:0,
    advanceDay:0,
    overTimeDay:0,
    overTimeNum: 0,
    delId: null,
    fliterCondition: null,
    nameFilter: null,
   // orgnameFilter: null,
    currentPeriodFilter: null,
   // projectMasterFilter: null,
    dateFilter:null,
    status:[{
      code: 0,
      name: '未结案',
    },
    {
      code: 1,
      name: '项目结案',
    }]
  };
  //组织变更
    //orgChange=item=>{
   // this.orgnameFilter=item;
    // const tableFilters = this.getTableFilters();
    // const { dispatch } = this.props;
    // debugger;
    // dispatch({
    //   type: 'pmBaseInfo/getProjectInfo',
    //   payload:{
    //     filters: tableFilters
    //   }
    // }).then(res => {
    //   const { data } = res
    //   if(res.success){
    //     this.setState({
    //       notStartedNum: data.notStartedNum,
    //       processingNum: data.processingNum,
    //       sumNum: data.sumNum,
    //       advanceFinishNum: data.advanceFinishNum,
    //       preOverTimeNum:data.preOverTimeNum,
    //       advanceDay:data.advanceDay,
    //       overTimeDay:data.overTimeDay,
    //       overTimeNum: data.overTimeNum,
    //     })
    //   }
    // })
 // };
  //主导人变更
  //leaderChange=item=>{
   // this.setState({ projectMasterFilter: item })  ;
  // this.projectMasterFilter=item;
    // const tableFilters = this.getTableFilters();
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'pmBaseInfo/getProjectInfo',
    //   payload:{
    //     filters: tableFilters
    //   }
    // }).then(res => {
    //   const { data } = res
    //   if(res.success){
    //     debugger;
    //     this.setState({
    //       notStartedNum: data.notStartedNum,
    //       processingNum: data.processingNum,
    //       sumNum: data.sumNum,
    //       advanceFinishNum: data.advanceFinishNum,
    //       preOverTimeNum:data.preOverTimeNum,
    //       advanceDay:data.advanceDay,
    //       overTimeDay:data.overTimeDay,
    //       overTimeNum: data.overTimeNum,
    //     })
    //   }
    // })
 // };
  onDateChange = data => {
    if(data){
      const date = data.format('YYYY-MM-DD');
      this.setState({
        dateFilter: date,
      });
    }else{
      this.setState({
        dateFilter: null,
    });
   }
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

  getTableFilters = () => {
    const { nameFilter, currentPeriodFilter, dateFilter } = this.state;
   // const{projectMasterFilter}=this.projectMasterFilter;
    const filters = [];
    if (nameFilter !== null) {
      filters.push({
        fieldName: 'sysName',
        operator: 'LK',
        fieldType: 'string',
        value: nameFilter,
      });
    }
    if (currentPeriodFilter) {
      if(currentPeriodFilter === '未结案'){
        filters.push({
          fieldName: 'currentPeriod',
          operator: 'NE',
          fieldType: 'string',
          value: '项目结案',
        });
      }else{
        filters.push({
          fieldName: 'currentPeriod',
          operator: 'LK',
          fieldType: 'string',
          value: currentPeriodFilter,
        });
      }
    }
    if (this.orgnameFilter) {
      filters.push({
        fieldName: 'orgname',
        operator: 'LK',
        fieldType: 'string',
        value: this.orgnameFilter,
      });
    }
    if (this.projectMasterFilter) {
      filters.push({
        fieldName: 'leader',
        operator: 'LK',
        fieldType: 'string',
        value: this.projectMasterFilter,
      });
    }
    if (dateFilter) {
      filters.push({
        fieldName: 'startDate',
        operator: 'GE',
        fieldType: 'date',
        value: dateFilter,
      });
    }
    return filters;
  };

  openModal = (row,disable) =>{
    this.dispatchAction({
      type: 'pmBaseInfo/updateState',
      payload: {
        modalVisible: true,
        editData: row,
        disable: disable,
      },
    });
  }

  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'pmBaseInfo/updateState',
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
              type: 'pmBaseInfo/del',
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

  handleSync = data => {
    this.dispatchAction({
      type: 'pmBaseInfo/syncProjectInfo',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'pmBaseInfo/updateState',
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
      type: 'pmBaseInfo/updateState',
      payload: {
        modalVisible: false,
        newProjCode: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['pmBaseInfo/del'] && delId === row.id) {
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
            <div style={{color:"#0066FF",cursor:"pointer"}} onClick={() => this.openModal(record,true)}>查看详情</div>
            {/* <div onClick={this.test}>test</div> */}
            {/* <Link
              // target = "_blank"
              to={{
              pathname:`/pm/PmBaseInfoEdit`,
              state:{
                orgnameList: this.state.orgnameList,
                disable: true,
                name: record.name,
                id: record.id,
                code: record.code,
                projectTypes: record.projectTypes,
                currentPeriod: record.currentPeriod,
                projectMaster: record.projectMaster,
                attendanceMemberrCount: record.attendanceMemberrCount,
                submissionDate: record.submissionDate,
                planningApproval: record.planningApproval,
                currentDescription: record.currentDescription,
                requirementDescription: record.requirementDescription,
                improveBenefits: record.improveBenefits,
                promotionDegree: record.promotionDegree,
                hardwareRequirement: record.hardwareRequirement,
                leader: record.leader == null || record.leader === '' ? [] : record.leader.split(',')  ,
                designer: record.designer == null || record.designer === '' ? [] : record.designer.split(','),
                developer: record.developer == null || record.developer === '' ? [] : record.developer.split(','),
                implementer: record.implementer == null || record.implementer === '' ? [] : record.implementer.split(','),
                proOpt: record.proOpt == null || record.proOpt === '' ? [] : record.proOpt.split(','),
                requireDocId: record.requireDocId,
                acceptStandardDocId: record.acceptStandardDocId,
                startReportDocId: record.startReportDocId,
                userRequireDocId: record.userRequireDocId,
                designerDocId: record.designerDocId,
                cropDocId: record.cropDocId,
                testExampleDocId: record.testExampleDocId,
                testReportDocId: record.testReportDocId,
                sopDocId: record.sopDocId,
                questionListDocId: record.questionListDocId,
                checkListDocId: record.checkListDocId,
                caseCloseReportDocId: record.caseCloseReportDocId,
                satisfactionSurveyDocId: record.satisfactionSurveyDocId,
                pageCheckDocId: record.pageCheckDocId,
                acceptOrderDocId: record.acceptOrderDocId,
                accpetReprotDocId: record.accpetReprotDocId,
                startDate: record.startDate,
                planFinishDate: record.planFinishDate,
                finalFinishDate: record.finalFinishDate,
                sysName: record.sysName,
                orgname: record.orgname,
                orgcode: record.orgcode,
                extorgname: record.extorgname,
              }
            }}>
              查看详情
            </Link> */}
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
        title: '系统名称',
        dataIndex: 'sysName',
        width: 200,
        required: true,
      },
      {
        title: '提案名称',
        dataIndex: 'name',
        width: 200,
        required: true,
      },
      {
        title: '当前阶段',
        dataIndex: 'currentPeriod',
        width: 100,
        required: true,
      },
      {
        title: '主导人',
        dataIndex: 'leader',
        width: 100,
        required: true,
      },
      // {
      //   title: '当前进度%',
      //   dataIndex: 'masterScheduleRate',
      //   width: 100,
      //   required: true,
      // },
      {
        title: '开始日期',
        dataIndex: 'startDate',
        width: 100,
        required: true,
      },
      {
        title: '计划结案日期',
        dataIndex: 'planFinishDate',
        width: 100,
        required: true,
      },
      {
        title: '实际结案日期',
        dataIndex: 'finalFinishDate',
        width: 100,
        required: true,
      },
      {
        title: '项目天数',
        dataIndex: 'projectDays',
        width: 100,
        required: true,
      },
      {
        title: '是否逾期',
        dataIndex: 'isOverdue',
        width: 100,
        required: true,
        render:
            tag => {
              let color = tag===true ? 'blue' : 'red';
              let value=tag===true ? '是' : '否';
              return (
                <span>
                <Tag color={color}>
                  {value}
                </Tag>
                </span>
              );
            }
      },
      {
        title: '逾期天数',
        dataIndex: 'overedDays',
        width: 100,
        required: true,
      },
      {
        title: '是否提前',
        dataIndex: 'isAdvance',
        width: 100,
        required: true,
        render:
            tag => {
              let color = tag===true ? 'blue' : 'red';
              let value=tag===true ? '是' : '否';
              return (
                <span>
                <Tag color={color}>
                  {value}
                </Tag>
                </span>
              );
            }
      },
      {
        title: '提前天数',
        dataIndex: 'advanceDays',
        width: 100,
        required: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 100,
        required: true,
      },
      {
        title: '项目类型',
        dataIndex: 'projectTypes',
        width: 100,
        required: true,
      },
      {
        title: '项目编码',
        dataIndex: 'code',
        width: 150,
        required: true,
      },
      {
        title: '科室名称',
        dataIndex: 'orgname',
        width: 200,
        required: true,
      },
    ];
    const toolBarProps = {
      layout: { leftSpan: 22, rightSpan: 2 },
      left: (
        <Space>
          系统名称：{' '}
          <Input style={{width:"150px"}} onChange={(event) => this.setState({ nameFilter: event.target.value })} allowClear></Input>
          当前阶段：{' '}
          <ComboList
            style={{ width: '150px' }}
            showSearch={false}
            pagination={false}
            dataSource={this.state.status}
            allowClear
            name="name"
            field={['name']}
            afterClear={() => this.setState({ currentPeriodFilter: null })}
            afterSelect={item => this.setState({ currentPeriodFilter: item.name })}
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
          科室名称：{' '}
          <ComboList
            style={{ width: '150px' }}
            showSearch={false}
            pagination={false}
            dataSource={this.state.orgnameList}
            allowClear
            name="name"
            field={['name']}
            afterClear={item => this.orgnameFilter=null}
            afterSelect={item => this.orgnameFilter=item.name}
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
          主导人：{' '}
          <Input style={{width:"150px"}} onChange={item=>this.projectMasterFilter=item.target.value} allowClear></Input>
          开始日期：<DatePicker onChange={item => this.onDateChange(item)} format="YYYY-MM-DD" />
          <Button onClick={this.handlerSearch}>搜索</Button>
          <Button
            key="add"
            type="primary"
            onClick={() => {
              this.openModal({id:'',name:''},false);
            }}
            ignore="true"
          >新建</Button>
            {/* <Link to={{
              pathname:`/pm/PmBaseInfoEdit`,
              state:{
                orgnameList: this.state.orgnameList,
                disable: false,
                name: '',
                id: '',
                code: '',
                projectTypes: '',
                currentPeriod: '',
                projectMaster: '',
                attendanceMemberrCount: '',
                submissionDate: '',
                planningApproval: '',
                currentDescription: '',
                requirementDescription: '',
                improveBenefits: '',
                promotionDegree: '',
                hardwareRequirement: '',
                leader: [] ,
                assist: [],
                designer: [],
                developer: [],
                implementer: [],
                proOpt: [],
                requireDocId: '',
                acceptStandardDocId: '',
                startReportDocId: '',
                userRequireDocId: '',
                designerDocId: '',
                cropDocId: '',
                testExampleDocId: '',
                testReportDocId: '',
                sopDocId: '',
                questionListDocId: '',
                checkListDocId: '',
                caseCloseReportDocId: '',
                satisfactionSurveyDocId: '',
                pageCheckDocId: '',
                acceptOrderDocId: '',
                accpetReprotDocId: '',
                startDate: null,
                planFinishDate: null,
                finalFinishDate: null,
                sysName: '',
                orgname: '',
                orgcode: '',
                extorgname: '',
              }
            }}>
              新建
            </Link> */}

          <Button onClick={this.handlerExport}>导出</Button>
        </Space>
      ),
    };
    const filters = this.getTableFilters();
    return {
      showSearch:false,
      columns,
      bordered: true,
      toolBar: toolBarProps,
      cascadeParams: {
        filters,
      },
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/pmBaseinfo/findByPage`,
      },

    };

  };
  handlerSearch = () => {
    const tableFilters = this.getTableFilters();
    const { dispatch } = this.props;
    dispatch({
      type: 'pmBaseInfo/getProjectInfo',
      payload:{
        filters: tableFilters
      }
    }).then(res => {
      const { data } = res
      if(res.success){
        this.setState({
          notStartedNum: data.notStartedNum,
          processingNum: data.processingNum,
          sumNum: data.sumNum,
          advanceFinishNum: data.advanceFinishNum,
          preOverTimeNum:data.preOverTimeNum,
          advanceDay:data.advanceDay,
          overTimeDay:data.overTimeDay,
          overTimeNum: data.overTimeNum,
        })
      }
    })

  }
  handlerExport = () => {
    const tableFilters = this.getTableFilters();
    request.post(`${PROJECT_PATH}/pmBaseinfo/export`, { filters: tableFilters }).then(res => {
      const { success, data } = res;
      if (success && data.length > 0) {
        exportXlsx(
          '项目列表',
          [
            '项目编码',
            '项目名称',
            '系统名称',
            '组织名称',
            '当前阶段',
            '主计划达成率',
            '开始日期',
            '计划结案日期',
            '实际结案日期',
            '项目天数',
            '是否逾期',
            '逾期天数',
            '项目类型',
            '主导人',
            '项目成员',
            '项目进度'
          ],
          data,
        );
      } else {
        message.error('没找到数据');
      }
    });
  };
  getEditModalProps = () => {
    const { loading, pmBaseInfo } = this.props;
    const { modalVisible, editData, disable } = pmBaseInfo;

    return {
      disable,
      editData,
      onSync: this.handleSync,
      visible: modalVisible,
      onClose: this.handleClose,
      sync: loading.effects['pmBaseInfo/syncProjectInfo'],
    };
  };

  render() {
    const { pmBaseInfo } = this.props;
    const { modalVisible } = pmBaseInfo;
    return (
      <>
        <div className={styles['container']}>
          <Row style={{height:"180px"}} className="row-content">
            <div style={{margin:"9px 12px",background:"white",height:"152px",borderRadius:"4px"}}>
              <div>
              <Col className="col-content">
                  <div className="item item-color3">
                    <div className="item-img">
                      <img src={logo3} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">{this.state.sumNum}</div>
                        <div className="item-text2">项目总数</div>
                      </div>
                    </div>
                  </div>
                  </Col>
                <Col className="col-content">
                  <div className="item item-color1">
                    <div className="item-img">
                      <img src={logo1} width={80} height={80}></img>
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
                      <img src={logo2} width={80} height={80}></img>
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
                        <div className="item-text1">{this.state.advanceFinishNum}</div>
                        <div className="item-text2">已完成</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color1">
                    <div className="item-img">
                      <img src={logo1} width={80} height={80}></img>
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
                      <img src={logo5} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">{this.state.overTimeNum}</div>
                        <div className="item-text2">已逾期</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color5">
                    <div className="item-img">
                      <img src={logo5} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">{this.state.advanceDay}</div>
                        <div className="item-text2">提前天数</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color5">
                    <div className="item-img">
                      <img src={logo5} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">{this.state.overTimeDay}</div>
                        <div className="item-text2">延后天数</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </div>
            </div>
          </Row>
          <Row style={{height:"calc(100% - 192px)",padding:"0 12px"}}>
              <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
          </Row>
          {/* {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null} */}
        </div>
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default PmBaseInfo;
