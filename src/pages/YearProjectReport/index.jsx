import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Tag, message } from 'antd';
import { ExtTable, Space, ComboList, YearPicker, SplitLayout, utils } from 'suid';
import { constants, exportXlsx } from "@/utils";

const {PROJECT_PATH} = constants;
const { request } = utils;

@withRouter
@connect(({ yearProjectReport, loading }) => ({ yearProjectReport, loading }))
class YearProjectReport extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    dispatch({
      type: 'yearProjectReport/getOrgnameList',
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

  state = {
    year: null,
    dataList: [],
    times: 0,
    orgnameFilter: null,
    memberFilter: null,
    dateFilter: null,
    orgnameList: [],
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
    this.setState({
      times : this.state.times + 1
    })
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'yearProjectReport/updateState',
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
              type: 'yearProjectReport/del',
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

  selectRow = ( record ) => {
    const { dispatch } = this.props;
    const filters = [
      {
        fieldName: 'orgname',
        operator: 'LK',
        fieldType: 'string',
        value: record.name,
      },
    ]
    if(this.dateFilter){
      filters.push({
        fieldName: 'year',
        operator: 'EQ',
        fieldType: 'string',
        value: this.dateFilter
      })
    }
    dispatch({
      type: 'yearProjectReport/getProInfo',
      payload:{
        filters
      }
    }).then(res => {
      const { rows } = res.data;
      this.setState({
        dataList: rows
      })
    })
  }

  getTableFilters = () => {
    const filters = [];
    if (this.orgnameFilter) {
      filters.push({
        fieldName: 'orgname',
        operator: 'LK',
        fieldType: 'string',
        value:this.orgnameFilter,
      });
    }
    if (this.memberFilter) {
      filters.push({
        fieldName: 'member',
        operator: 'LK',
        fieldType: 'string',
        value: this.memberFilter,
      });
    }
    if (this.dateFilter) {
      filters.push({
        fieldName: 'year',
        operator: 'EQ',
        fieldType: 'String',
        value: this.dateFilter,
      });
    }
    return filters;
  };

  getExtableProps = () => {
      const columns = [
      {
        title: '部门/科室名称',
        dataIndex: 'name',
        width: 120,
        required: true,
      },
      {
        title: '科室负责人',
        dataIndex: 'manager',
        width: 250,
        required: true,
      },
      {
        title: '结案数量',
        dataIndex: 'finishNum',
        width: 120,
        required: true,
      },
      {
        title: '未结案数量',
        dataIndex: 'notFinishNum',
        width: 120,
        required: true,
      },
      {
        title: '暂停数量',
        dataIndex: 'pauseNum',
        width: 120,
        required: true,
      },
      {
        title: '项目总数',
        dataIndex: 'totalNum',
        width: 120,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
          汇报科室:{' '}
          <ComboList
            style={{ width: '150px' }}
            showSearch={false}
            pagination={false}
            dataSource={this.state.orgnameList}
            allowClear
            name="name"
            field={['name']}
            afterClear={() => this.orgnameFilter = null}
            afterSelect={item => this.orgnameFilter = item.name}
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
          {/* 汇报人:{' '}
          <Input
            style={{width:"150px"}}
            onChange={item => this.memberFilter = item.target.value}
            allowClear
          ></Input> */}
          项目年份：
          <YearPicker
            onChange={this.onDateChange}
            allowClear
            value={this.state.year}
            format="YYYY" />
          <Button type="primary" onClick={this.refresh}>查询</Button>
          <Button onClick={this.handlerExport}>导出</Button>
        </Space>
      ),
    };
    const filters = this.getTableFilters();
    return {
      // 表格点击
      onRow: record => {
        return {
          onClick: () => {
            this.selectRow(record);
          },
        };
      },
      tableHeaderHeight: 92,
      columns,
      bordered: true,
      pagination:true,
      showSearch:false,
      toolBar: toolBarProps,
      cascadeParams: {
        filters,
      },
      store:{
        type: 'POST',
        url:`${PROJECT_PATH}/pmBaseinfo/getYearProjectReport`,
      },
    };
  };

  handlerExport = () => {
    const tableFilters = this.getTableFilters();
    request.post(`${PROJECT_PATH}/pmBaseinfo/exportYearProjReport`, { filters: tableFilters }).then(res => {
      const { success, data } = res;
      if (success && data.length > 0) {
        exportXlsx(
          '科室年度项目',
          [
            '部门/科室名称',
            '科室负责人',
            '结案数量',
            '结案数量',
            '暂停数量',
            '项目总数',
          ],
          data,
        );
      } else {
        message.error('没找到数据');
      }
    });
  };

  onDateChange = (data) => {
    if(data){
      this.dateFilter = data;
      this.setState({
        year: data
      })
    }else{
      this.dateFilter = null
      this.setState({
        year: null
      })
    }
  };

  getSecondExtableProps = () => {
    const columns = [
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
        title: '主导人',
        dataIndex: 'leader',
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
        width: 120,
        required: true,
      },
      {
        title: '人天',
        dataIndex: 'personDay',
        width: 50,
        required: false,
      },
      {
        title: '本周计划',
        dataIndex: 'weekPlan',
        width: 400,
        required: true,
      },
      {
        title: '下周计划',
        dataIndex: 'nextWeekPlan',
        width: 400,
        required: true,
      },
      {
        title: '项目风险',
        dataIndex: 'workRisk',
        width: 100,
        required: true,
      },
      {
        title: '周计划更新时间',
        dataIndex: 'weekPlanUpdate',
        width: 120,
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
      {
        title: '当前阶段',
        dataIndex: 'currentPeriod',
        width: 100,
        required: true,
      },
      {
        title: '实际结案日期',
        dataIndex: 'finalFinishDate',
        width: 120,
        required: true,
      },
      {
        title: '项目天数',
        dataIndex: 'projectDays',
        width: 100,
        required: true,
      },
      {
        title: '是否暂停',
        dataIndex: 'isPause',
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
    ];
    return {
      refreshButton: 'empty',
      showSearch:false,
      columns,
      bordered: true,
      pagination: true,
      dataSource: this.state.dataList,
    };

  };

  render() {
    const { yearProjectReport } = this.props;
    const { modalVisible } = yearProjectReport;

    return (
      <>
      <SplitLayout direction="vertical">
        <div>
          <ExtTable
            onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()}
          />
        </div>
        <div>
          <ExtTable onTableRef={inst => (this.secondTableRef = inst)} {...this.getSecondExtableProps()} />
        </div>

      </SplitLayout>

        {/* {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null} */}
      </>
    );
  }
}

export default YearProjectReport;
