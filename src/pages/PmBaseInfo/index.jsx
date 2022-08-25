import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Input , DatePicker, Row, Col, Button,Tag  } from 'antd';
import { ExtTable, ExtIcon, ComboList, Space } from 'suid';
import { constants } from '@/utils';
import { Link } from "react-router-dom";
import styles from './index.less'
import logo1 from '../../../static/proj-one.png'
import logo2 from '../../../static/proj-two.png'
import logo3 from '../../../static/proj-three.png'
import logo4 from '../../../static/proj-four.png'
import logo5 from '../../../static/proj-five.png'

const { PROJECT_PATH } = constants;

@withRouter
@connect(({ pmBaseInfo, loading }) => ({ pmBaseInfo, loading }))
class PmBaseInfo extends Component {
  state = {
    delId: null,
    fliterCondition: null,
    nameFilter: null,
    currentPeriodFilter: null,
    projectMasterFilter: null,
    dateFilter:null,
    status:[{
      id: 1,
      code: 0,
      name: '起草',
    },
    {
      id: 2,
      code: 1,
      name: '待审核',
    }]
  };

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
    const { nameFilter, currentPeriodFilter, projectMasterFilter, dateFilter } = this.state;
    const filters = [];
    if (nameFilter !== null) {
      filters.push({
        fieldName: 'name',
        operator: 'LK',
        fieldType: 'string',
        value: nameFilter,
      });
    }
    if (currentPeriodFilter) {
      filters.push({
        fieldName: 'currentPeriod',
        operator: 'LK',
        fieldType: 'string',
        value: currentPeriodFilter,
      });
    }
    if (projectMasterFilter) {
      filters.push({
        fieldName: 'projectMaster',
        operator: 'LK',
        fieldType: 'string',
        value: projectMasterFilter,
      });
    }
    if (dateFilter) {
      filters.push({
        fieldName: 'date',
        operator: 'EQ',
        fieldType: 'date',
        value: dateFilter,
      });
    }
    return filters;
  };

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
            <Link to={{
              pathname:`/pm/PmBaseInfoEdit`,
              state:{
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
                leader: record.leader,
                designer: record.designer,
                developer: record.developer,
                implementer: record.implementer,
              }
            }}>
              查看详情
            </Link>
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
        title: '项目名称',
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
        dataIndex: 'projectMaster',
        width: 100,
        required: true,
      },
      {
        title: '当前进度%',
        dataIndex: 'masterScheduleRate',
        width: 100,
        required: true,
      },
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
      },
      {
        title: '逾期天数',
        dataIndex: 'overedDays',
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
        title: '需求评审',
        dataIndex: 'requireReview',
        width: 100,
        render:
            tag => {
              let color = tag===true ? 'blue' : 'red';
              let value=tag===true ? '通过' : '不通过';
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
        title: 'UI评审',
        dataIndex: 'uiReview',
        width: 100,
        render:
        tag => {
          let color = tag===true ? 'blue' : 'red';
          let value=tag===true ? '通过' : '不通过';
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
        title: '前端评审',
        dataIndex: 'webReview',
        width: 100,
        render:
        tag => {
          let color = tag===true ? 'blue' : 'red';
          let value=tag===true ? '通过' : '不通过';
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
        title: '后端评审',
        dataIndex: 'codeReview',
        width: 100,
        render:
        tag => {
          let color = tag===true ? 'blue' : 'red';
          let value=tag===true ? '通过' : '不通过';
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
        title: '测试结果',
        dataIndex: 'test',
        width: 100,
        render:
        tag => {
          let color = tag===true ? 'blue' : 'red';
          let value=tag===true ? '通过' : '不通过';
          return (
            <span>
            <Tag color={color}>
              {value}
            </Tag>
            </span>
          );
        }
      },{
        title: '项目验收',
        dataIndex: 'test',
        width: 100,
        render:
        tag => {
          let color = tag===0 ? 'blue' : 'red';
          let value=tag===0 ? '通过' : '不通过';
          return (
            <span>
            <Tag color={color}>
              {value}
            </Tag>
            </span>
          );
        }
      },
    ];
    const toolBarProps = {
      layout: { leftSpan: 22, rightSpan: 2 },
      left: (
        <Space>
          项目名称：{' '}
          <Input style={{width:"150px"}} onChange={(event) => this.setState({ nameFilter: event.target.value })} allowClear></Input>
          当前状态：{' '}
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
          主导人：{' '}
          <Input style={{width:"150px"}} onChange={(event) => this.setState({ projectMasterFilter: event.target.value })} allowClear></Input>
          开始日期：<DatePicker onChange={item => this.onDateChange(item)} format="YYYY-MM-DD" />
          <Button
            key="add"
            type="primary"
            onClick={() => {
              this.handleEvent('add', null);
            }}
            ignore="true"
          >
            <Link to={{
              pathname:`/pm/PmBaseInfoEdit`,
              state:{
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
              }
            }}>
              新建
            </Link>
          </Button>
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

  getEditModalProps = () => {
    const { loading, pmBaseInfo } = this.props;
    const { modalVisible } = pmBaseInfo;

    return {
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
                  <div className="item item-color1">
                    <div className="item-img">
                      <img src={logo1} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">10</div>
                        <div className="item-text2">未开始项目</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color2">
                    <div className="item-img">
                      <img src={logo2} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">10</div>
                        <div className="item-text2">进行中项目</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color3">
                    <div className="item-img">
                      <img src={logo3} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">10</div>
                        <div className="item-text2">本年度已上线项目</div>
                      </div>
                    </div>
                  </div>
                  </Col>
                <Col className="col-content">
                  <div className="item item-color4">
                    <div className="item-img">
                      <img src={logo4} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">10</div>
                        <div className="item-text2">本年度提前完成项目</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color5">
                    <div className="item-img">
                      <img src={logo5} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">10</div>
                        <div className="item-text2">本年度逾期项目（含未完成）</div>
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
      </>
    );
  }
}

export default PmBaseInfo;
