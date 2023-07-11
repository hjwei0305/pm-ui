import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ExtTable, YearPicker, Space} from 'suid';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;
@withRouter
@connect(({ personalBaseInfoReport, loading }) => ({ personalBaseInfoReport, loading }))
class PersonalBaseInfoReport extends Component {
  constructor(props){
    super(props)
    this.state = {
      year: null,
      dateYearFilter: null,
    };
  }

  componentDidMount = () => {
    this.setState({
      year: new Date().getFullYear(),
      dateYearFilter: new Date().getFullYear(),
    });
  }

  onYearDateChange = (data) => {
    if(data){
      this.setState({
        year: data,
        dateYearFilter: data
      })
    }else{
      this.setState({
        year: null,
        dateYearFilter: null,
      })
    }
  };

  getTableFilters = () => {
    const { dateYearFilter } = this.state;
    const filters = [];
    if (dateYearFilter) {
      filters.push({
        fieldName: 'year',
        operator: 'EQ',
        fieldType: 'String',
        value: dateYearFilter,
      });
    }
    return filters;
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

  getExtableProps = () => {
    const columns = [
      {
        title: '工号',
        dataIndex: 'employeeCode',
        width: 100,
        required: true,
      },
      {
        title: '姓名',
        dataIndex: 'employeeName',
        width: 100,
        required: true,
      },
      {
        title: '进行中项目',
        dataIndex: 'processingNum',
        width: 120,
        required: true,
      },
      {
        title: '未开始项目',
        dataIndex: 'notStartedNum',
        width: 120,
        required: true,
      },
      {
        title: '暂停项目',
        dataIndex: 'pauseNum',
        width: 120,
        required: true,
      },
      {
        title: '完成项目数',
        dataIndex: 'finishNum',
        width: 120,
        required: true,
      },
      {
        title: '总项目数',
        dataIndex: 'projectTotalNum',
        width: 120,
        required: true,
      },
    ];
    const toolBarProps = {
      // layout: { leftSpan: 23, rightSpan: 1 },
      left: (
        <Space>
          项目年份：
              <YearPicker
                style={{width:"150px"}}
                onChange={this.onYearDateChange}
                allowClear
                value={this.state.year}
                format="YYYY" />
          {/* <Button onClick={this.handlerSearch}>搜索</Button> */}
        </Space>
      ),
    };
    const filters = this.getTableFilters();
    return {
      columns,
      bordered: false,
      pagination:false,
      searchProperties: ['employeeName'],
      searchPlaceHolder: '请输入姓名查询',
      toolBar: toolBarProps,
      cascadeParams: {
        filters,
      },
      store:{
        type: 'POST',
        url:`${PROJECT_PATH}/report/haveNoProjectList`,
        loaded: () => {
          this.tableRef.manualSelectedRows();
        },
      },
      rowKey: 'employeeCode',
    };
  };

  render() {
    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
      </>
    );
  }
}

export default PersonalBaseInfoReport;
