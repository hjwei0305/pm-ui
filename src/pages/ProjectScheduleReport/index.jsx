import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Input, Button, DatePicker } from 'antd';
import { ExtTable, Space, ComboList } from 'suid';
import {constants} from "@/utils";

const {PROJECT_PATH} = constants;

@withRouter
@connect(({ projectScheduleReport, loading }) => ({ projectScheduleReport, loading }))
class ProjectScheduleReport extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    dispatch({
      type: 'projectScheduleReport/getOrgnameList',
      payload:{}
    }).then(res => {
      const { data } = res;
      for(let item of data){
        if(item.nodeLevel === 3 || item.name === '系统运维管理部'){
          this.state.orgnameList.push({code:item.code,name:item.name,extorgname:item.extorgname})
        }
      }
    })

    // const filters = this.getTableFilters();
    // dispatch({
    //   type: 'projectScheduleReport/getDataList',
    //   payload:{
    //     filters
    //   }
    // }).then(res => {
    //   const { rows } = res.data;
    //   this.setState({
    //     dataList : rows
    //   })
    // })
  }
  

  state = {
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
          type: 'projectScheduleReport/updateState',
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
              type: 'projectScheduleReport/del',
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

  getTableFilters = () => {
    // const {orgnameFilter , memberFilter} = this.state
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
        fieldName: 'startDate',
        operator: 'GE',
        fieldType: 'date',
        value: this.dateFilter,
      });
    }
    return filters;
  };

  getExtableProps = () => {
      const columns = [
      {
        title: '项目类型',
        dataIndex: 'projectTypes',
        width: 120,
        required: false,
      },
      {
        title: '项目名称',
        dataIndex: 'name',
        width: 250,
        required: false,
      },
      {
        title: '启动日期',
        dataIndex: 'startDate',
        width: 120,
        required: false,
      },
      {
        title: '计划完成时间',
        dataIndex: 'planFinishDate',
        width: 120,
        required: false,
      },
      {
        title: '项目周期（天）',
        dataIndex: 'projectDays',
        width: 120,
        required: false,
      },
      {
        title: '推进进度',
        children: [
          {
            title: '项目启动',
            dataIndex: 'proStart',
            width: 100,
            required: false,
          },
          {
            title: '需求制作',
            dataIndex: 'requirement',
            width: 100,
            required: false,
          },
          {
            title: '程序开发',
            dataIndex: 'development',
            width: 100,
            required: false,
          },
          {
            title: '测试验证',
            dataIndex: 'test',
            width: 100,
            required: false,
          },
          {
            title: '应用推广',
            dataIndex: 'promote',
            width: 100,
            required: false,
          },
          {
            title: '项目验收',
            dataIndex: 'finish',
            width: 100,
            required: false,
          },
        ]
      },
      {
        title: '完成率',
        dataIndex: 'completionRate',
        width: 120,
        required: false,
        render:(_, record) => (
          record.completionRate + "%"
        )
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
          汇报人:{' '}
          <Input 
            style={{width:"150px"}} 
            onChange={item => this.memberFilter = item.target.value}
            allowClear
          ></Input>
          开始日期：<DatePicker onChange={item => this.onDateChange(item)} format="YYYY-MM-DD" />
          <Button type="primary" onClick={this.refresh}>查询</Button>
        </Space>
      ),
    };
    const filters = this.getTableFilters();
    return {
      tableHeaderHeight: 92,
      columns,
      bordered: true,
      pagination:false,
      showSearch:false,
      toolBar: toolBarProps,
      cascadeParams: {
        filters,
      },
      store:{
        type: 'POST',
        url:`${PROJECT_PATH}/pmBaseinfo/getProScheduleReport`,

      },
    };
  };

  onDateChange = (data) => {
    debugger
    if(data){
      this.dateFilter = data.format('YYYY-MM-DD');
    }else{
      this.dateFilter = null
    }
  };

  render() {
    const { projectScheduleReport } = this.props;
    const { modalVisible } = projectScheduleReport;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {/* {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null} */}
      </>
    );
  }
}

export default ProjectScheduleReport;
