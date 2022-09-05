import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Col, Popconfirm, Row, Tabs, Form, Input, Icon, Tag, Select } from 'antd';
import { ExtIcon, ExtTable, ComboList, ProLayout, Attachment } from 'suid';
import ToDoEditModal from './ToDoEditModal';
import { Link } from "react-router-dom";
import styles from './index.less'
import { constants } from '@/utils';
import ProjectPlan from './ProjectPlan'
import ProjectSchedule from './ProjectSchedule'
// import get from 'lodash'

const { Option } = Select;
const { PROJECT_PATH, SERVER_PATH } = constants;
const { TextArea } = Input
const { TabPane } = Tabs;
const { SiderBar, Content } = ProLayout;

@Form.create()
@withRouter
@connect(({ pmBaseInfoEdit, loading }) => ({ pmBaseInfoEdit, loading }))
class PmBaseInfoEdit extends Component {
  constructor(props) {
    super(props);
    if(this.props.location.state && this.props.location.state.code != ''){
      this.state = {
        projTypeList: [
          {
            name: 'KPI项目',
            code: 0,
          },
          {
            name: '年度重点项目',
            code: 1,
          },{
            name: '其他项目',
            code: 2,
          },
        ],
        ScheduleArys: [],
        employee: [],
        proOptList: [],
        disable: this.props.location.state.disable,
        dataList:
          {
            code: this.props.location.state.code,
            name: this.props.location.state.name,
            id: this.props.location.state.id,
            projectTypes: this.props.location.state.projectTypes,
            currentPeriod: this.props.location.state.currentPeriod,
            projectMaster: this.props.location.state.projectMaster,
            attendanceMemberrCount: this.props.location.state.attendanceMemberrCount,
            submissionDate: this.props.location.state.submissionDate,
            planningApproval: this.props.location.state.planningApproval,
            currentDescription: this.props.location.state.currentDescription,
            requirementDescription: this.props.location.state.requirementDescription,
            improveBenefits: this.props.location.state.improveBenefits,
            promotionDegree: this.props.location.state.promotionDegree,
            hardwareRequirement: this.props.location.state.hardwareRequirement,
            leader: this.props.location.state.leader,
            designer: this.props.location.state.designer,
            developer: this.props.location.state.developer,
            implementer: this.props.location.state.implementer,
            proOpt: this.props.location.state.proOpt,
            requireDocId: this.props.location.state.requireDocId,
            acceptStandardDocId: this.props.location.state.acceptStandardDocId,
            startReportDocId: this.props.location.state.startReportDocId,
            userRequireDocId: this.props.location.state.userRequireDocId,
            designerDocId: this.props.location.state.designerDocId,
            cropDocId: this.props.location.state.cropDocId,
            testExampleDocId: this.props.location.state.testExampleDocId,
            testReportDocId: this.props.location.state.testReportDocId,
            sopDocId: this.props.location.state.sopDocId,
            questionListDocId: this.props.location.state.questionListDocId,
            checkListDocId: this.props.location.state.checkListDocId,
            caseCloseReportDocId: this.props.location.state.caseCloseReportDocId,
            satisfactionSurveyDocId: this.props.location.state.satisfactionSurveyDocId,
            pageCheckDocId: this.props.location.state.pageCheckDocId,
            acceptOrderDocId: this.props.location.state.acceptOrderDocId,
            accpetReprotDocId: this.props.location.state.accpetReprotDocId,
          }
      }
    }
    const { dispatch } = props;
    dispatch({
      type: 'pmBaseInfoEdit/getProOpt',
      payload:{}
    }).then(res => {
      const { data } = res;
      for (let i = 0; i < data.length; i++) {
        this.state.proOptList.push(<Option key={data[i].dataValue}>{data[i].dataName}</Option>);
      }
    })


    dispatch({
      type: 'pmBaseInfoEdit/findEmp',
      payload: {
        filters: [

        ],
      },
    }).then(res => {
      const { data } = res;
      for (let i = 0; i < data.length; i++) {
        this.state.employee.push(<Option key={data[i].employeeName}>{data[i].employeeName}</Option>);
      }
    });
  }

  static attachmentRef = null;

  state = {
    ScheduleArys: [],
    delId: null,
    isFinishedFilter: null,
    ondutyNameFilter: null,
    employee: [],
    proOptList: [],
    projTypeList: [
      {
        name: 'KPI项目',
        code: 6,
      },
      {
        name: '年度重点项目',
        code: 1,
      },{
        name: '其他项目',
        code: 2,
      },
    ],
    isFinishedData: [
      {
        name: '已结案',
        code: 1,
      },
      {
        name: '未结案',
        code: 0,
      },
    ],
    // 项目信息
    // projData: [
    //   {id}
    // ],
    disable: false,
    dataList:
      {
        id: null,
        code: null,
        projectTypes: null,
        name: null,
        currentPeriod: null,
        projectMaster: null,
        attendanceMemberrCount: null,
        submissionDate: null,
        planningApproval: null,
        currentDescription: null,
        requirementDescription: null,
        improveBenefits: null,
        promotionDegree: null,
        hardwareRequirement: null,
        leader: [],
        designer: [],
        developer: [],
        implementer: [],
        proOpt: [],
        requireDocId: null,
        acceptStandardDocId: null,
        startReportDocId: null,
        userRequireDocId: null,
        designerDocId: null,
        cropDocId: null,
        testExampleDocId: null,
        testReportDocId: null,
        sopDocId: null,
        questionListDocId: null,
        checkListDocId: null,
        caseCloseReportDocId: null,
        satisfactionSurveyDocId: null,
        pageCheckDocId: null,
        acceptOrderDocId: null,
        accpetReprotDocId: null,
      }
  };

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;
    return dispatch({
      type,
      payload
    });
  }

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  }

  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'pmBaseInfoEdit/updateState',
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
              type: 'pmBaseInfoEdit/del',
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
    var dataReplace = Object.assign({},data)
    if(typeof(dataReplace.projectTypes) == "string"){
      for(let item of this.state.projTypeList){
        if(item.name == dataReplace.projectTypes){
          dataReplace.projectTypes = item.code
        }
      }
    }
    if(dataReplace.leader.length > 0 || dataReplace.developer.length > 0 || dataReplace.implementer.length > 0 || dataReplace.designer.length > 0){
      let count = 0;
      var str = [dataReplace.leader,dataReplace.developer,dataReplace.implementer,dataReplace.designer]
      for(let memb of str){
        if(memb.length > 0){
          count = count + memb.length;
        }
      }
      data.attendanceMemberrCount = count
      dataReplace.attendanceMemberrCount = count
    }
    dataReplace.leader = dataReplace.leader.join(",")
    dataReplace.developer = dataReplace.developer.join(",")
    dataReplace.implementer = dataReplace.implementer.join(",")
    dataReplace.designer = dataReplace.designer.join(",")
    dataReplace.proOpt = dataReplace.proOpt.join(",")
   
    if(dataReplace.code != '' && dataReplace.code != null){
      this.dispatchAction({
        type: 'pmBaseInfoEdit/save',
        payload: dataReplace,
      })
    }
  };

  // handleClose = () => {
  //   this.dispatchAction({
  //     type: 'pmBaseInfoEdit/updateState',
  //     payload: {
  //       modalVisible: false,
  //       editData: null,
  //     },
  //   });
  // };

  // getEditModalProps = () => {
  //   const { loading, pmBaseInfoEdit } = this.props;
  //   const { modalVisible, editData } = pmBaseInfoEdit;

  //   return {
  //     onSave: this.handleSave,
  //     editData,
  //     visible: modalVisible,
  //     onClose: this.handleClose,
  //     saving: loading.effects['pmBaseInfoEdit/save'],
  //   };
  // };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['pmBaseInfoEdit/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  // getExtableProps = () => {
  //   const columns = [
  //     {
  //       title: '操作',
  //       key: 'operation',
  //       width: 100,
  //       align: 'center',
  //       dataIndex: 'id',
  //       className: 'action',
  //       required: true,
  //       render: (_, record) => (
  //         <Fragment>
  //           <ExtIcon
  //             key="edit"
  //             className="edit"
  //             onClick={() => this.handleEvent('edit', record)}
  //             type="edit"
  //             status="success"
  //             tooltip={{ title: '编辑' }}
  //             antd
  //           />
  //           <Popconfirm
  //             key="del"
  //             placement="topLeft"
  //             title="确定要删除吗？"
  //             onConfirm={() => this.handleEvent('del', record)}
  //           >
  //             {this.renderDelBtn(record)}
  //           </Popconfirm>
  //         </Fragment>
  //       ),
  //     },
  //     {
  //       title: '代码',
  //       dataIndex: 'code',
  //       width: 120,
  //       required: true,
  //     },
  //     {
  //       title: '名称',
  //       dataIndex: 'name',
  //       width: 220,
  //       required: true,
  //     },
  //   ];
  //   const toolBarProps = {
  //     left: (
  //       <Fragment>
  //         <Button
  //           key="add"
  //           type="primary"
  //           onClick={() => {
  //             this.handleEvent('add', null);
  //           }}
  //           ignore="true"
  //         >
  //           新建
  //         </Button>
  //         <Button onClick={this.refresh}>刷新</Button>
  //       </Fragment>
  //     ),
  //   };
  //   return {
  //     columns,
  //     bordered: false,
  //     toolBar: toolBarProps,
  //     remotePaging: true,
  //     store: {
  //       type: 'POST',
  //       url:
  //         '/mock/5e02d29836608e42d52b1d81/template-service/simple-master/findByPage',
  //     },
  //   };
  // };

  handleToDoSave = data => {
    this.dispatchAction({
      type: 'pmBaseInfoEdit/saveToDo',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'pmBaseInfoEdit/updateState',
          payload: {
            modalVisibleToDo: false,
          },
        });
        this.refresh();
      }
    });
  };

  handleToDoClose = () => {
    this.dispatchAction({
      type: 'pmBaseInfoEdit/updateState',
      payload: {
        modalVisibleToDo: false,
        editToDoData: null,
      },
    });
  };

  getToDoEditModalProps = () => {
    const { loading, pmBaseInfoEdit } = this.props;
    const { modalVisibleToDo, editToDoData } = pmBaseInfoEdit;
    const { code, name } = this.props.location.state;

    return {
      onSave: this.handleToDoSave,
      editToDoData,
      code, name,
      visible: modalVisibleToDo,
      onClose: this.handleToDoClose,
      saving: loading.effects['pmBaseInfoEdit/saveToDo'],
    };
  };

  getToDoTableFilters = () => {
    const { isFinishedFilter, ondutyNameFilter } = this.state;
    const { code } = this.state.dataList;
    const filters = [];
    if (code != null && code != '') {
      filters.push({
        fieldName: 'projectCode',
        operator: 'EQ',
        fieldType: 'string',
        value: code,
      });
    }else {
      return
    }
    if (isFinishedFilter != null && isFinishedFilter != '') {
      filters.push({
        fieldName: 'isFinished',
        operator: 'EQ',
        fieldType: 'boolean',
        value: isFinishedFilter,
      });
    }
    if (ondutyNameFilter != null && ondutyNameFilter != '') {
      filters.push({
        fieldName: 'ondutyName',
        operator: 'LK',
        fieldType: 'string',
        value: ondutyNameFilter,
      });
    }
    return filters;
  };

  getTodoListExtableProps = () => {
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
              onClick={() => this.handleToDoEvent('edit', record)}
              type="edit"
              status="success"
              tooltip={{ title: '编辑' }}
              antd
            />
            <Popconfirm
              key="del"
              placement="topLeft"
              title="确定要删除吗？"
              onConfirm={() => this.handleToDoEvent('del', record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          </Fragment>
        ),
      },
      {
        title: '项目编码',
        dataIndex: 'projectCode',
        width: 120,
        required: true,
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 220,
        required: true,
      },
      {
        title: '代办事项',
        dataIndex: 'todoList',
        width: 100,
        required: false,
      },
      {
        title: '责任人工号',
        dataIndex: 'ondutyCode',
        width: 100,
        required: false,
      },
      {
        title: '责任人姓名',
        dataIndex: 'ondutyName',
        width: 100,
        required: false,
      },
      {
        title: '提出人工号',
        dataIndex: 'submitCode',
        width: 100,
        required: false,
      },
      {
        title: '提出人姓名',
        dataIndex: 'submitName',
        width: 100,
        required: false,
      },
      {
        title: '提出时间',
        dataIndex: 'submitDate',
        width: 100,
        required: false,
      },
      {
        title: '结案时间',
        dataIndex: 'endDate',
        width: 100,
        required: false,
      },
      {
        title: '是否完成',
        dataIndex: 'isCompleted',
        width: 100,
        required: false,
        render: (_, row) => {

          if (row.isCompleted) {
            return <Tag color="green">是</Tag>;
          }
          return <Tag color="red">否</Tag>;
        },
      },
      {
        title: '是否结案',
        dataIndex: 'isFinished',
        width: 100,
        required: false,
        render: (_, row) => {
          if (row.isFinished) {
            return <Tag color="green">是</Tag>;
          }
          return <Tag color="red">否</Tag>;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 100,
        required: false,
      },
    ];
    const toolBarProps = {
      layout:{ leftSpan: 16, rightSpan: 8 },
      left: (
        <Fragment>
          是否结案：{' '}
          <ComboList
            style={{ width: '150px', marginRight: '12px' }}
            showSearch={false}
            pagination={false}
            // dataSource={this.state.status}
            dataSource={this.state.isFinishedData}
            allowClear
            name="name"
            field={['name']}
            afterClear={() => this.setState({ isFinishedFilter: null })}
            afterSelect={item => this.setState({ isFinishedFilter: item.code })}
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
          责任人：{' '}
          <Input style={{ width: "150px", marginRight: "5px" }} onChange={(event) => this.setState({ ondutyNameFilter: event.target.value })} allowClear></Input>
          <Button
            key="add"
            type="primary"
            onClick={() => {
              this.handleToDoEvent('add', null);
            }}
            ignore="true"
          >
            新建
          </Button>
          {/* <Button onClick={this.refresh}>刷新</Button> */}
        </Fragment>
      ),
    };
    const filters = this.getToDoTableFilters();
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
          `${PROJECT_PATH}/todoList/findByPage`,
      },
    };
  };

  handleToDoEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'pmBaseInfoEdit/updateState',
          payload: {
            modalVisibleToDo: true,
            editToDoData: row,
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
              type: 'pmBaseInfoEdit/delToDo',
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

  syncProjectInfo = (e) =>{
    this.dispatchAction({
      type: 'pmBaseInfoEdit/syncProjectInfo',
      payload: {
        code: e.target.value,
      },
    }).then(res => {
      if (res.success) {
        const { data } = res
        this.setState(
          {
            dataList: {
              id: data.id,
              code: data.code,
              projectTypes: data.projectTypes,
              name: data.name,
              currentPeriod: data.currentPeriod,
              projectMaster: data.projectMaster,
              attendanceMemberrCount: data.attendanceMemberrCount,
              submissionDate: data.submissionDate,
              planningApproval: data.planningApproval,
              currentDescription: data.currentDescription,
              requirementDescription: data.requirementDescription,
              improveBenefits: data.improveBenefits,
              promotionDegree: data.promotionDegree,
              hardwareRequirement: data.hardwareRequirement,
            }
          },
          () => this.refresh(),
        );
      }
    });
  }

  change = (event) =>{
    this.state.dataList.code = event.target.value
  }

  callback = (key) => {
    if(key == 2){
      if(this.state.dataList.id != undefined){
        const { dispatch } = this.props;
        dispatch({
          type: 'pmBaseInfoEdit/findByIdForSchedule',
          payload: {
            id: this.state.dataList.id
          }
        }).then(res =>{
          if(res.success){
            this.setState({
              ScheduleArys: JSON.parse(res.data.gfxJson)
            })
          }
        })
      }
    }
  }

  
  
  handlerGetFile = () => {
    const status = this.attachmentRef.getAttachmentStatus();
    console.log(status);
  };

  render() {
    const { pmBaseInfoEdit } = this.props;
    const { modalVisibleToDo } = pmBaseInfoEdit;



    // const attachmentProps = {
    //   serviceHost: `${SERVER_PATH}/edm-service`,
    //   multiple: true,
    //   customBatchDownloadFileName: true,
    //   onAttachmentRef: ref => (this.attachmentRef = ref),
    //   allowUpload: !readOnly || action === 'finalEdit',
    //   allowDelete: !readOnly,
    //   entityId: get(editData, 'id'),
    // };

    return (
      <>
      <ProLayout style={{background: "#F4F8FC",padding:"8px 12px"}}>
          <SiderBar allowCollapse width={330} gutter={[0,8]}>
            <Row>
              <Col span={24} style={{ height: "100%" }}>
                <div className={styles['goBack']}>
                  <Icon type="left" />
                  <Link to={`/pm/PmBaseInfo`}>
                    返回
                  </Link>
                </div>
                <div className={styles['basicInfo']}>
                  test
                </div>
                <div className={styles['procedure']}>
                  <div className="procedureTitle">流程配置</div>
                  <div><Select maxTagCount={6} defaultValue={this.state.dataList.proOpt} mode="tags" style={{ width: '100%' }} placeholder="选择项目流程" onChange={(value,_) => this.state.dataList.proOpt = value}>{this.state.proOptList}</Select></div>
                </div>
                <div className={styles['member']}>
                  <div className="memberTitle">项目组成员</div>
                  {/* <div className="memberCtr" >管理成员</div> */}
                  <div>
                    <div>主导人：<Select defaultValue={this.state.dataList.leader} mode="tags" style={{ width: '100%' }} placeholder="选择主导人" onChange={(value,_) => this.state.dataList.leader = value}>{this.state.employee}</Select></div>
                    <div>UI设计：<Select defaultValue={this.state.dataList.designer} mode="tags" style={{ width: '100%' }} placeholder="选择UI设计" onChange={(value,_) => this.state.dataList.designer = value}>{this.state.employee}</Select></div>
                    <div>开发人员：<Select defaultValue={this.state.dataList.developer} mode="tags" style={{ width: '100%' }} placeholder="选择开发人员" onChange={(value,_) => this.state.dataList.developer = value}>{this.state.employee}</Select></div>
                    <div>实施：<Select defaultValue={this.state.dataList.implementer} mode="tags" style={{ width: '100%' }} placeholder="选择实施人员" onChange={(value,_) => this.state.dataList.implementer = value}>{this.state.employee}</Select></div>
                  </div>
                </div>
              </Col>
            </Row>
          </SiderBar>
          <Content>
            <Col style={{ height: "100%" }}>
              <div style={{ marginLeft: "12px", background: "white", height: "100%" }}>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                  <TabPane tab="基础信息" key="1">
                    <Form className={styles['basic']}>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Button
                          type="primary"
                          style={{ marginRight: '16px' }}
                          ghost
                          onClick={() => this.handleSave(this.state.dataList)}
                          >保存</Button>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={8}>
                          <span >档案编码：</span>
                          <Input onChange={this.change} placeholder='请输入提案编号' defaultValue={this.state.dataList.code} disabled={this.state.disable} onBlur={(event) => this.syncProjectInfo(event)}></Input>
                        </Col>
                        <Col span={8}>
                          <span >项目类型：</span>
                          <ComboList
                            defaultValue={this.state.dataList.projectTypes}
                            dataSource={this.state.projTypeList}
                            showSearch={false}
                            pagination={false}
                            name="name"
                            field={['name']}
                            afterClear={() => this.state.dataList.projectTypes = null }
                            afterSelect={item => this.state.dataList.projectTypes = item.code }
                            reader={{
                              name: 'name',
                              field: ['name'],
                            }}
                            style={{width:200}}
                          ></ComboList>
                          {/* <Input defaultValue={this.state.dataList.projectTypes}></Input> */}
                        </Col>
                        <Col span={8}>
                          <span >项目名称：</span>
                          <Input value={this.state.dataList.name} disabled></Input>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={8}>
                          <span >项目阶段：</span>
                          <Input value={this.state.dataList.currentPeriod} disabled></Input>
                        </Col>
                        {/* <Col span={8}>
                          <span >项目类型：</span>
                          <Input value={this.state.projectTypes} disabled></Input>
                        </Col> */}
                        <Col span={8}>
                          <span>主导人：</span>
                          <Input value={this.state.dataList.leader} disabled></Input>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={8}>
                          <span>参与人数：</span>
                          <Input value={this.state.dataList.attendanceMemberrCount} disabled></Input>
                        </Col>
                        <Col span={8}>
                          <span >提案日期：</span>
                          <Input value={this.state.dataList.submissionDate} disabled></Input>
                        </Col>
                        <Col span={8}>
                          <span >规划审批：</span>
                          <Input value={this.state.dataList.planningApproval} disabled></Input>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={24}>
                          <span>现状描述：</span>
                          <TextArea className="rowStyle" value={this.state.dataList.currentDescription} disabled></TextArea>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={24}>
                          <span>需求描述：</span>
                          <TextArea className="rowStyle" value={this.state.dataList.requirementDescription} disabled></TextArea>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={24}>
                          <span>改善效益：</span>
                          <TextArea className="rowStyle" value={this.state.dataList.improveBenefits} disabled></TextArea>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={24}>
                          <span>推广度：</span>
                          <TextArea className="rowStyle" value={this.state.dataList.promotionDegree} disabled></TextArea>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={24}>
                          <span>硬件要求：</span>
                          <TextArea className="rowStyle" value={this.state.dataList.hardwareRequirement} disabled></TextArea>
                        </Col>
                      </Row>
                    </Form>
                  </TabPane>
                  <TabPane tab="进度跟进" key="2">
                    <ProjectSchedule id={this.state.dataList.id} ScheduleArys={this.state.ScheduleArys} editData={this.state.dataList}></ProjectSchedule>
                  </TabPane>
                  <TabPane tab="附件信息" key="3">
                    test
                  </TabPane>
                  <TabPane tab="计划表" key="4">
                    <ProjectPlan style={{height: "620px"}} id={this.state.dataList.id}></ProjectPlan>
                  </TabPane>
                  <TabPane tab="待办事项" key="5">
                    <ExtTable style={{ height: "620px" }} onTableRef={inst => (this.tableRef = inst)} {...this.getTodoListExtableProps()} />
                    {modalVisibleToDo ? <ToDoEditModal {...this.getToDoEditModalProps()} /> : null}
                  </TabPane>
                  <TabPane tab="操作日志" key="6">
                    Content of Tab Pane 3
                  </TabPane>
                </Tabs>
              </div>
            </Col>
          </Content>

        {/* </div> */}
        </ProLayout>


        {/* <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} /> */}
        {/* {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null} */}
      </>
    );
  }

}

export default PmBaseInfoEdit;
