import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Input, Button, DatePicker } from 'antd';
import { ExtTable, Space, ComboList } from 'suid';
import {constants} from "@/utils";
import EditModal from './EditModal';

const {PROJECT_PATH} = constants;
const { MonthPicker } = DatePicker;

@withRouter
@connect(({ personalMonthReport, loading }) => ({ personalMonthReport, loading }))
class PersonalMonthReport extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    dispatch({
      type: 'personalMonthReport/getOrgnameList',
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
  }
  

  state = {
    dataList: [],
    orgnameFilter: null,
    employeeNameFilter: null,
    monthDate: null,
    orgnameList: [],
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
          type: 'personalMonthReport/updateState',
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
              type: 'personalMonthReport/del',
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
    const filters = [];
    if (this.orgnameFilter) {
      filters.push({
        fieldName: 'groupName',
        operator: 'LK',
        fieldType: 'string',
        value:this.orgnameFilter,
      });
    }
    if (this.employeeNameFilter) {
      filters.push({
        fieldName: 'employeeName',
        operator: 'LK',
        fieldType: 'string',
        value: this.employeeNameFilter,
      });
    }
    if(this.monthDate){
      filters.push({
        fieldName: 'ym',
        operator: 'LK',
        fieldType: 'string',
        value: this.monthDate,
      });
    }
    return filters;
  };

  /** 触发查询 */
  findByPage = () => {
    const { dispatch } = this.props
    const filters = this.getTableFilters();
    dispatch({
      type: 'personalMonthReport/getDataList',
      payload:{
        filters
      }
    }).then(res => {
      const { rows } = res.data;
      this.setState({
        dataList : rows
      })
    })
  }

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
            <div 
              style={{color:"#0066FF",cursor:"pointer"}} 
              onClick={() => this.openModal(record)}
            >查看详情</div>
          </Space>
        ),
      },
      {
        title: '年月',
        dataIndex: 'ym',
        width: 120,
        required: true,
      },
      // {
      //   title: '科室名称',
      //   dataIndex: 'groupName',
      //   width: 250,
      //   required: true,
      // },
      {
        title: '汇报人',
        dataIndex: 'employeeName',
        width: 120,
        required: true,
      },
      // {
      //   title: '计划开始日期',
      //   dataIndex: 'planStartDate',
      //   width: 120,
      //   required: true,
      // },
      // {
      //   title: '计划结束日期',
      //   dataIndex: 'planEndDate',
      //   width: 120,
      //   required: true,
      // },
      {
        title: '计划总项',
        dataIndex: 'totalNum',
        width: 120,
        required: true,
      },
      {
        title: '完成项',
        dataIndex: 'finishNum',
        width: 120,
        required: true,
      },
      {
        title: '逾期项',
        dataIndex: 'overtimeNum',
        width: 120,
        required: true,
      },
      {
        title: '工作达成率',
        dataIndex: 'compeletionRate',
        width: 120,
        required: true,
        render:(_, record) => (
          record.compeletionRate + "%"
        )
      },
      // {
      //   title: '计划工作小时(H)',
      //   dataIndex: 'planHours',
      //   width: 150,
      //   required: true,
      // },
      // {
      //   title: '计划占比',
      //   dataIndex: 'planHoursRate',
      //   width: 120,
      //   required: true,
      //   render:(_, record) => (
      //     record.planHoursRate + "%"
      //   )
      // },
      // {
      //   title: '实际工作小时(H)',
      //   dataIndex: 'workHours',
      //   width: 150,
      //   required: true,
      // },
      // {
      //   title: '实际占比',
      //   dataIndex: 'workHouresRate',
      //   width: 120,
      //   required: true,
      //   render:(_, record) => (
      //     record.workHouresRate + "%"
      //   )
      // },
      {
        title: '更新日期',
        dataIndex: 'lastEditedDate',
        width: 150,
        required: true,
      }
    ];
    const toolBarProps = {
      left: (
        <Space>
          汇报科室:{' '}
          <ComboList
            style={{ width: 150 }}
            pagination={false}
            dataSource={this.state.orgnameList}
            rowKey="code"
            allowClear
            afterClear={() => this.orgnameFilter = null}
            afterSelect={item => this.orgnameFilter = item.name}
            reader={{
              name: 'name',
            }}
          />
          汇报人:{' '}
          <Input 
            style={{width:"150px"}} 
            onChange={item => this.employeeNameFilter = item.target.value}
            allowClear
          ></Input>
          年月：
          <MonthPicker 
            onChange={(_,dateString) => this.Monthchange(_,dateString)} 
            placeholder='请选择'
          />
          {/* <YearPicker 
            onChange={this.onDateChange} 
            allowClear 
            value={this.state.year} 
            format="YYYY" /> */}
          <Button type="primary" onClick={this.findByPage}>查询</Button>
          <Button
            key="add"
            type="primary"
            onClick={() => {
              this.openModal();
            }}
            ignore="true"
          >新建</Button>
        </Space>
      ),
    };
    const filters = this.getTableFilters();
    return {
      columns,
      bordered: true,
      pagination: true,
      remotePaging: true,
      showSearch: false,
      toolBar: toolBarProps,
      cascadeParams: {
        filters,
      },
      store:{
        type: 'POST',
        url:`${PROJECT_PATH}/pmPersonalMonthReport/findByPage`,
      },
    };
  };

  Monthchange = (date,dateString) => {
    this.monthDate = dateString
  }

  /** 新建/查看计划 */
  openModal = (row) =>{
    this.dispatchAction({
      type: 'personalMonthReport/updateState',
      payload: {
        modalVisible: true,
        editData: row,
      },
    });
  }

  getEditModalProps = () => {
    const { loading, personalMonthReport, dispatch } = this.props;
    const { orgnameList } = this.state
    const { modalVisible,editData } = personalMonthReport;

    return {
      editData,
      dispatch,
      orgnameList,
      visible: modalVisible,
      onClose: this.handleModalClose,
      sync: loading.effects['personalMonthReport/syncProjectInfo'],
    };
  };

  handleModalClose = () => {
    this.dispatchAction({
      type: 'personalMonthReport/updateState',
      payload: {
        modalVisible: false,
        editData: null
      },
    });
    this.refresh()
  };

  render() {
    const { personalMonthReport } = this.props;
    const { modalVisible } = personalMonthReport;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default PersonalMonthReport;
