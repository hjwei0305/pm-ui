import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Tag, message, Input } from 'antd';
import { ExtTable, Space, ComboList, utils, YearPicker } from 'suid';
import AttEditModal from './AttEditModal'

const { authAction } = utils;

@withRouter
@connect(({ pmBaseInfoWeekReport, loading }) => ({ pmBaseInfoWeekReport, loading }))
class PmBaseInfoWeekReport extends Component {
  state = {
    projectMasterFilter: null,
    nameFilter: null,
    currentPeriodFilter: null,
    orgnameFilter: null,
    projTypeFilter: null,
    dateFilter: null,
    year: null,
    dataList: [],
    orgnameList: [],
    status:[{
      code: 0,
      name: '未结案',
    },
    {
      code: 1,
      name: '项目结案',
    }],
    OrNotStatus:[
      {
        code: false,
        name: '否',
      },
      {
        code: true,
        name: '是',
      },
    ],
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
    columns:[
      // {
      //   title: '项目编号',
      //   dataIndex: 'code',
      //   width: 120,
      //   required: true,
      // },
      {
        title: '提案名称',
        dataIndex: 'name',
        width: 220,
        required: true,
      },
      {
        title: '系统名称',
        dataIndex: 'sysName',
        width: 220,
        required: true,
      },
      {
        title: '项目类型',
        dataIndex: 'projectTypes',
        width: 120,
        required: true,
      },
      {
        title: '科室',
        dataIndex: 'orgname',
        width: 100,
        required: true,
      },
      {
        title: '主导人',
        dataIndex: 'leader',
        width: 100,
        required: true,
      },
      {
        title: '当前阶段',
        dataIndex: 'currentPeriod',
        width: 100,
        required: true,
      },
      {
        title: '项目暂停',
        dataIndex: 'isPause',
        width: 100,
        required: true,
        render: (_, record) => {
          if(record.isPause){
            return <Tag color='green'>是</Tag>
          }else{
            return <Tag color='red'>否</Tag>
          }
        }
      },
      {
        title: '最新本周计划',
        dataIndex: 'weekPlan',
        width: 220,
        required: true,
      },
      {
        title: '本周产出',
        // dataIndex: 'weekPlan',
        width: 120,
        required: true,
        render: (_, record) => (
          <Button type="primary" onClick={() => this.checkUpload(record.weekId)}>查看附件</Button>
        )
      },
      {
        title: '计划完成',
        dataIndex: 'finishPlan',
        width: 200,
        required: true,
        render: (_, record, index) => {
          const editable = this.isEditing(record);
          const { editingKey } = this.state;
          return editable ? (
            <Space>
              <ComboList
                style={{ width: '80px', marginRight: '12px' }}
                showSearch={false}
                pagination={false}
                dataSource={this.state.OrNotStatus}
                afterSelect={e => { this.handleCellChange(e, record.weekId)}}
                value={ this.state.changeParam }
                name="name"
                field={['name']}
                reader={{
                  name: 'name',
                  field: ['name'],
                }}
              />
              <span>
                <a onClick={() => this.saveResult(record, index)} style={{ marginRight: 8 }}>保存</a>
                <a onClick={() => this.cancel(record)}>取消</a>
              </span>
            </Space>
          ) :  (
            <Space>
              <ComboList
                disabled
                style={{ width: '80px', marginRight: '12px' }}
                showSearch={false}
                pagination={false}
                dataSource={this.state.OrNotStatus}
                defaultValue={ record.finishPlan }
                name="name"
                field={['name']}
                reader={{
                  name: 'name',
                  field: ['name'],
                }}
              />
              {authAction(
                <a authCode="XMGL-XMGL-SZJC" disabled={editingKey !== ''} onClick={() => this.edit(record)}>编辑</a>
              )}
            </Space>
            
          )
        },
      },
      {
        title: '最新下周计划',
        dataIndex: 'nextWeekPlan',
        width: 220,
        required: true,
      },
      {
        title: '上次修改时间',
        dataIndex: 'lastModifiedTime',
        width: 150,
        required: true,
      },
      {
        title: '最后修改时间',
        dataIndex: 'lastEditedDate',
        width: 150,
        required: true,
      },
    ],
    editingKey: '',
    param: '',
    changeParam: '', 
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    //获取科室
    dispatch({
      type: 'pmBaseInfoWeekReport/getOrgnameList',
      payload:{}
    }).then(res => {
      const { data } = res;
      for(let item of data){
        if(item.nodeLevel === 3 || item.name === '系统运维管理部'){
          this.state.orgnameList.push({code:item.code,name:item.name,extorgname:item.extorgname})
        }
      }
    })
    // 获取列表数据
    this.getData()
  }

  getData = () => {
    const { dispatch } = this.props;
    const filters = this.getTableFilters()
    debugger
    dispatch({
      type: 'pmBaseInfoWeekReport/getWeekReport',
      payload:{
        filters,
      }
    }).then(res => {
      const { data, msg } = res;
      if(data){
        for(let [index,item] of data.entries()){
          item.key = index
          for(let obj of this.state.OrNotStatus){
            if(obj.code === item.finishPlan){
              item.finishPlan = obj.name
            }
          }
        }
        if(data.length > 0){
          this.setState({
            dataList : data
          })
        }else{
          this.setState({
            dataList : null
          })
        }
      }
    })
  }

  getTableFilters = () => {
    debugger
    const { nameFilter, currentPeriodFilter, orgnameFilter, 
      projTypeFilter, projectMasterFilter, dateFilter } = this.state;
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
    if (orgnameFilter) {
      filters.push({
        fieldName: 'orgname',
        operator: 'LK',
        fieldType: 'string',
        value: orgnameFilter,
      });
    }
    if (projTypeFilter !== null) {
      filters.push({
        fieldName: 'projectTypes',
        operator: 'EQ',
        fieldType: 'string',
        value: projTypeFilter,
      });
    }
    if (projectMasterFilter) {
      filters.push({
        fieldName: 'leader',
        operator: 'LK',
        fieldType: 'string',
        value: projectMasterFilter,
      });
    }
    if(this.dateFilter){
      filters.push({
        fieldName: 'year',
        operator: 'EQ',
        fieldType: 'string',
        value: this.dateFilter
      })
    }
    return filters;
  };

  // 取消按钮
  cancel = () => {
    this.setState({ 
      editingKey: '',
      param:  '',
      changeParam: '',
    });
  };

  // 编辑按钮触发获取editingKey = record.id
  edit = (record) => {
    let obj = record.finishPlan
    this.setState({ 
      editingKey: record.id,
      param:  obj,
      changeParam: obj,
    });
  }

  // 根据editingKey判断是否行编辑中
  isEditing = record => record.id === this.state.editingKey;

  // 保存事件
  saveResult = (record, index) => {
    const { dispatch } = this.props
    let finishPlan = this.state.changeParam === '是' ? true : false
    if(record.weekId){
      dispatch({
        type: 'pmBaseInfoWeekReport/confirmFinishPlan',
        payload:{
          id: record.weekId,
          finishPlan: finishPlan
        }
      }).then(res => {
        const { success } = res;
        if(success){
          const dataReplace = [];
          Object.assign(dataReplace,this.state.dataList)
          dataReplace[index].finishPlan = this.state.changeParam
          this.setState({ 
            editingKey: '',
            param:  '',
            changeParam: '',
            dataList: dataReplace,
          });
        }
      })
    }else{
      message.error('该项目没有新的双周计划，不能保存')
    }
  }

  // 修改 '是否完成' 字段
  handleCellChange = (e, weekId) => {
    if(!weekId){
      return message.error('该项目没有新的双周计划')
    }
    this.setState({ 
      changeParam: e.name,
    });
  }

  refresh = () => {
    this.getData()
    // 修改dataList
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getExtableProps = () => {
    const toolBarProps = {
      layout: { leftSpan: 24, rightSpan: 0 },
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
          科室:{' '}
          <ComboList
            style={{ width: '150px' }}
            showSearch={false}
            pagination={false}
            dataSource={this.state.orgnameList}
            allowClear
            name="name"
            field={['name']}
            afterClear={() => this.setState({ orgnameFilter: null })}
            afterSelect={item => this.setState({ orgnameFilter: item.name})}
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
          项目类型：{' '}
          <ComboList
            style={{ width: '150px' }}
            showSearch={false}
            pagination={false}
            dataSource={this.state.projTypeList}
            allowClear
            name="name"
            field={['name']}
            afterClear={item => this.setState({ projTypeFilter: null })}
            afterSelect={item => this.setState({ projTypeFilter: item.code })}
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
          主导人：{' '}
          <Input style={{width:"150px"}} onChange={item => this.setState({ projectMasterFilter: item.target.value })} allowClear></Input>
          项目年份：
          <YearPicker
            onChange={this.onDateChange}
            allowClear
            value={this.state.year}
            format="YYYY" />
          <Button onClick={this.refresh} type='primary'>查询</Button>
        </Space>
      ),
    };
    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return {
      columns,
      showSearch:false,
      bordered: true,
      toolBar: toolBarProps,
      remotePaging: true,
      sort:{
        field: { lastEditedDate: 'asc' },
      },
      dataSource: this.state.dataList,
    };
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

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;
    return dispatch({
      type,
      payload,
    });
  };

  // 打开附件弹窗
  checkUpload = (id) => {
    this.dispatchAction({
      type: 'pmBaseInfoWeekReport/updateState',
      payload: {
        weekAttId: id,
        weekAttModalVisible: true,
      },
    });
  };
  
  // 关闭附件弹窗
  handleAttEditModalClose = () => {
    this.dispatchAction({
      type: 'pmBaseInfoWeekReport/updateState',
      payload: {
        weekAttModalVisible: false,
        weekAttId: null,
      },
    });
  };
    
  // 附件查看弹窗
  getAttEditModalProps = () => {
    const { loading, pmBaseInfoWeekReport } = this.props;
    const { weekAttModalVisible, weekAttId } = pmBaseInfoWeekReport;
  
    return {
      weekAttId,
      visible: weekAttModalVisible,
      onClose: this.handleAttEditModalClose,
      // saving: loading.effects['pmBaseInfoWeekReport/saveWeekPlan'],
    };
  };

  // 弹窗
  // getEditModalProps = () => {
  //   const { loading, pmBaseInfoWeekReport } = this.props;
  //   const { modalVisible, editData } = pmBaseInfoWeekReport;

  //   return {
  //     onSave: this.handleSave,
  //     editData,
  //     visible: modalVisible,
  //     onClose: this.handleClose,
  //     saving: loading.effects['pmBaseInfoWeekReport/save'],
  //   };
  // };
  
  // handleSave = data => {
  //   this.dispatchAction({
  //     type: 'pmBaseInfoWeekReport/save',
  //     payload: data,
  //   }).then(res => {
  //     if (res.success) {
  //       this.dispatchAction({
  //         type: 'pmBaseInfoWeekReport/updateState',
  //         payload: {
  //           modalVisible: false,
  //         },
  //       });
  //       this.refresh();
  //     }
  //   });
  // };

  // handleClose = () => {
  //   this.dispatchAction({
  //     type: 'pmBaseInfoWeekReport/updateState',
  //     payload: {
  //       modalVisible: false,
  //       editData: null,
  //     },
  //   });
  // };

  render() {
    const { pmBaseInfoWeekReport } = this.props;
    const { weekAttModalVisible } = pmBaseInfoWeekReport;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {/* {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null} */}
        {weekAttModalVisible ? <AttEditModal {...this.getAttEditModalProps()} /> : null}
      </>
    );
  }
}

export default PmBaseInfoWeekReport;
