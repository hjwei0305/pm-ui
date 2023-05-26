import React, { Component } from 'react';
import { withRouter } from 'umi';
import { ExtTable, Space } from 'suid';
import { Button, DatePicker } from 'antd';
import { connect } from 'dva';

const { MonthPicker } = DatePicker;

@withRouter
@connect(({ pmVisitStatistics, loading }) => ({ pmVisitStatistics, loading }))
class PmVisitStatistics extends Component {
  state = {
    dateYearFilter: null,
  };

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;
    return dispatch({
      type,
      payload,
    });
  };

  getTableFilters = () => {
    const { dateYearFilter } = this.state;
    const filters = [];
    if (dateYearFilter) {
      filters.push({
        fieldName: 'month',
        operator: 'LK',
        fieldType: 'string',
        value: dateYearFilter,
      })
    }
    return filters;
  };

  // 钩子函数
  componentDidMount = () => {
    this.handleSearch();
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleSearch = () => {
    const { dispatch } = this.props;
    const filters = this.getTableFilters();
    dispatch({
      type: 'pmVisitStatistics/findVisitStatistics',
      payload: {
        filters
      }
    }).then(res => {
      const { success, data } = res;
      if (success) {
        let id = 0;
        for(let item of data){
          item.id = id
          id++
          if(item.children){
            for(let children of item.children){
              children.id = id
              id++
            }
          }
        }
        this.dispatchAction({
          type: 'pmVisitStatistics/updateState',
          payload: {
            dataList: data
          }
        })
      }
    })
  }

  // 月份条件更改
  Monthchange = (_,data) => {
    if(data){
      this.setState({
        // year: data,
        dateYearFilter: data
      })
    }else{
      this.setState({
        // year: null,
        dateYearFilter: null,
      })
    }
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '科室名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '成员',
        dataIndex: 'employeeName',
        width: 200,
      },
      {
        title: '使用次数',
        dataIndex: 'count',
        width: 180,
      },
    ];
    const toolBarProps = {
      layout: { leftSpan: 22, rightSpan: 2 },
      left: (
        <Space>
          月份：
          <MonthPicker
            // style={{width:"150px"}}
            placeholder='请选择月份'
            onChange={(_,dateString) => this.Monthchange(_,dateString)}
            allowClear
            // value={this.state.month}
            format="YYYY-MM"
          />
          <Button type="primary" onClick={this.handleSearch}>查询</Button>
          <Button onClick={this.refresh}>刷新</Button>
        </Space>
      ),
    };
    return {
      columns,
      showSearch: false,
      toolBar: toolBarProps,
      remotePaging: true,
      searchProperties: ['code', 'name'],
      searchPlaceHolder: '请输入关键字进行查询',
      onTableRef: inst => (this.tableRef = inst),
      dataSource: this.props.pmVisitStatistics.dataList,
      // rowKey: 'orgid',
      // store: {
      //   type: 'POST',
      //   url:
      //     '/mock/5e02d29836608e42d52b1d81/template-service/simple-master/findByPage',
      // },
    };
  };

  render() {
    return <ExtTable {...this.getExtableProps()} />;
  }
}

export default PmVisitStatistics;
