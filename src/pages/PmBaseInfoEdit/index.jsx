import React, { Component, Fragment } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Col, Popconfirm, Row, Tabs, Form, Input, Icon, Tag, Select } from 'antd';
import { ExtIcon, ExtTable, ComboList } from 'suid';
//import EditModal from './EditModal';
import ToDoEditModal from './ToDoEditModal';
import { Link } from "react-router-dom";
import styles from './index.less'
import { constants } from '@/utils';
import ProjectPlan from '../ProjectPlan'

const { Option } = Select;
const { PROJECT_PATH } = constants;
const { TextArea } = Input
const { TabPane } = Tabs;


@withRouter
@connect(({ pmBaseInfoEdit, loading }) => ({ pmBaseInfoEdit, loading }))
class PmBaseInfoEdit extends Component {

  constructor(props) {
    super(props);
    const { dispatch } = props;
    dispatch({
      type: 'pmBaseInfoEdit/findEmp',
      payload: {
        filters: [

        ],
      },
    }).then(res => {
      debugger;
      const { data } = res;
      console.log(data);
      for (let i = 0; i < data.rows.length; i++) {
        this.state.employee.push(<Option key={data.rows[i].employeeName}>{data.rows[i].employeeName}</Option>);
      }
    });
  }



  state = {
    delId: null,
    isFinishedFilter: null,
    ondutyNameFilter: null,
    employee: [],
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
    this.dispatchAction({
      type: 'pmBaseInfoEdit/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'pmBaseInfoEdit/updateState',
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
      type: 'pmBaseInfoEdit/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  getEditModalProps = () => {
    const { loading, pmBaseInfoEdit } = this.props;
    const { modalVisible, editData } = pmBaseInfoEdit;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['pmBaseInfoEdit/save'],
    };
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
          '/mock/5e02d29836608e42d52b1d81/template-service/simple-master/findByPage',
      },
    };
  };

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
    const { code } = this.props.location.state;
    const filters = [];
    if (code !== null) {
      filters.push({
        fieldName: 'projectCode',
        operator: 'EQ',
        fieldType: 'string',
        value: code,
      });
    }
    if (isFinishedFilter !== null) {
      filters.push({
        fieldName: 'isFinished',
        operator: 'EQ',
        fieldType: 'boolean',
        value: isFinishedFilter,
      });
    }
    if (ondutyNameFilter !== null) {
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
    console.log(e.target.value)
    this.dispatchAction({
      type: 'pmBaseInfoEdit/syncProjectInfo',
      payload: {
        code: e.target.value,
      },
    }).then(res =>{
      if(res.success){
        console.log(res)
      }
    });
  }

  render() {
    const { pmBaseInfoEdit } = this.props;
    const { modalVisibleToDo } = pmBaseInfoEdit;

    const callback = (key) => {
      console.log(key);
    }

    if(this.props.location.state){
       var { disable, id ,code, projectTypes, name, currentPeriod, projectMaster,
        attendanceMemberrCount, submissionDate, planningApproval,
        currentDescription, requirementDescription, improveBenefits,
        promotionDegree, hardwareRequirement } = this.props.location.state;
        console.log(this.props.location.state)
    }

    return (
      <>
        <div style={{ background: "#F4F8FC", padding: "8px 12px" }}>
          <Row>
            <Col span={4} style={{ height: "100%" }}>
              <div className={styles['goBack']}>
                <Icon type="left" />
                <Link to={`/pm/PmBaseInfo`}>
                  返回
                </Link>
              </div>
              <div className={styles['basicInfo']}>
                test
              </div>
              <div className={styles['member']}>
                <div className="memberTitle">项目组成员</div>
                {/* <div className="memberCtr" >管理成员</div> */}
                <div>
                  <div>主导人：<Select mode="tags" style={{ width: '100%' }} placeholder="选择主导人">{this.state.employee}</Select></div>
                  <div>UI设计：<Select mode="tags" style={{ width: '100%' }} placeholder="选择UI设计">{this.state.employee}</Select></div>
                  <div>开发人员：<Select mode="tags" style={{ width: '100%' }} placeholder="选择主导人">{this.state.employee}</Select></div>
                  <div>实施：<Select mode="tags" style={{ width: '100%' }} placeholder="选择主导人">{this.state.employee}</Select></div>
                </div>
              </div>

            </Col>
            <Col span={20} style={{ height: "100%" }}>
              <div style={{ marginLeft: "12px", background: "white", height: "100%" }}>
                <Tabs defaultActiveKey="1" onChange={callback}>
                  <TabPane tab="基础信息" key="1">
                    <Form className={styles['basic']}>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Button 
                          type="primary" 
                          style={{ marginRight: '16px' }} 
                          ghost
                          onClick={this.handleSave}
                          >保存</Button>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={8}>
                          <span >档案编码：</span>
                          <Input defaultValue={code} disabled={disable} onBlur={(event) => this.syncProjectInfo(event)}></Input>
                        </Col>
                        <Col span={8}>
                          <span >项目类型：</span>
                          <Input defaultValue={projectTypes} disabled></Input>
                        </Col>
                        <Col span={8}>
                          <span >项目名称：</span>
                          <Input defaultValue={name} disabled></Input>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={8}>
                          <span >项目阶段：</span>
                          <Input defaultValue={currentPeriod} disabled></Input>
                        </Col>
                        <Col span={8}>
                          <span >项目类型：</span>
                          <Input defaultValue={projectTypes} disabled></Input>
                        </Col>
                        <Col span={8}>
                          <span>主导人：</span>
                          <Input defaultValue={projectMaster} disabled></Input>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={8}>
                          <span>参与人数：</span>
                          <Input defaultValue={attendanceMemberrCount} disabled></Input>
                        </Col>
                        <Col span={8}>
                          <span >提案日期：</span>
                          <Input defaultValue={submissionDate} disabled></Input>
                        </Col>
                        <Col span={8}>
                          <span >规划审批：</span>
                          <Input defaultValue={planningApproval} disabled></Input>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={24}>
                          <span>现状描述：</span>
                          <TextArea className="rowStyle" defaultValue={currentDescription} disabled></TextArea>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={24}>
                          <span>需求描述：</span>
                          <TextArea className="rowStyle" defaultValue={requirementDescription} disabled></TextArea>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={24}>
                          <span>改善效益：</span>
                          <TextArea className="rowStyle" defaultValue={improveBenefits} disabled></TextArea>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={24}>
                          <span>推广度：</span>
                          <TextArea className="rowStyle" defaultValue={promotionDegree} disabled></TextArea>
                        </Col>
                      </Row>
                      <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
                        <Col span={24}>
                          <span>硬件要求：</span>
                          <TextArea className="rowStyle" defaultValue={hardwareRequirement} disabled></TextArea>
                        </Col>
                      </Row>
                    </Form>
                  </TabPane>
                  <TabPane tab="进度跟进" key="2">
                    Content of Tab Pane 2
                  </TabPane>
                  <TabPane tab="附件信息" key="3">
                    Content of Tab Pane 3
                  </TabPane>
                  <TabPane tab="计划表" key="4">
                    <ProjectPlan id={id}></ProjectPlan>
                  </TabPane>
                  <TabPane tab="待办事项" key="5">
                    <ExtTable style={{ height: "620px" }} onTableRef={inst => (this.tableRef = inst)} {...this.getTodoListExtableProps()} />
                    {modalVisibleToDo ? <ToDoEditModal {...this.getToDoEditModalProps()} /> : null}
                  </TabPane>
                  <TabPane tab="流程配置" key="6">
                    Content of Tab Pane 3
                  </TabPane>
                  <TabPane tab="操作日志" key="7">
                    Content of Tab Pane 3
                  </TabPane>
                </Tabs>
              </div>
            </Col>
          </Row>
        </div>



        {/* <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} /> */}
        {/* {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null} */}
      </>
    );
  }
}

export default PmBaseInfoEdit;
