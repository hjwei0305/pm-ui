import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, InputNumber, Input, DatePicker, Radio, Form, Select, message  } from 'antd';
import { ExtTable, ExtIcon, Space, ComboList,ProLayout, DataImport } from 'suid';
import moment from 'moment';
// import { constants } from '@/utils';
//
// const { PROJECT_PATH } = constants;

const { Header ,Content } = ProLayout;

@Form.create()
@withRouter
@connect(({ pmBaseInfoEdit, loading }) => ({ pmBaseInfoEdit, loading }))
class ProjectPlan extends Component {
  static editData;

  constructor(props) {
    super(props);
    const { dispatch,id } = props;
    this.editData = {};
    // 初始化五行
    // let cg = [];
    // for (let i = 1; i <= 5; i++) {
    //   cg = cg.concat({
    //     id: i,
    //     key: i,
    //     orderCode: '',
    //     goodsCode: '',
    //     goodsName: '',
    //     specificationModal: '',
    //     unit: '',
    //     number: '',
    //     remark: '',
    //   });
    // }
    // this.state.obj = cg;

    dispatch({
      type: 'pmBaseInfoEdit/projPlanFindByPage',
      payload: {
        sortOrders: [
          {
            property: 'schedureNo'
          }
        ],
        filters: [
          {
            fieldName: 'projectId',
            operator: 'EQ',
            value: id,
          },
          {
            fieldName: 'planType',
            operator: 'EQ',
            value: 0,
          }
        ],
      }
    }).then(res =>{
      const { rows } = res.data;
      for(let [index,item] of rows.entries()){
        item.key = index
        item.workOnduty = item.workOnduty === '' ? [] : item.workOnduty.split(',')
        item.workAssist = item.workAssist === '' ? [] : item.workAssist.split(',')
      }
      if(rows.length > 0){
        this.setState({
          obj : rows
        })
      }
    })
  }

  state = {
    editingKey: '',
    delId: null,
    planType: 0,
    columns: [],
    columns1: [
      {
        title: '序号',
        dataIndex: 'schedureNo',
        width: 100,
        required: true,
        elem:'INPUT',
        editFlag: true,
      },
      {
        title: '任务类型',
        dataIndex: 'workType',
        width: 150,
        required: true,
        elem: 'INPUT',
        editFlag: true,

      },
      {
        title: '主要任务/关键步骤',
        dataIndex: 'workTodoList',
        width: 300,
        required: true,
        elem: 'INPUT',
        editFlag: true,

      },
      {
        title: '计划开始日期',
        dataIndex: 'planStartDate',
        width: 150,
        required: false,
        elem: 'DATE_PICK',
        editFlag: true,

      },
      {
        title: '计划完成日期',
        dataIndex: 'planEndDate',
        width: 150,
        required: false,
        elem: 'DATE_PICK',
        editFlag: true,

      },
      {
        title: '实际开始日期',
        dataIndex: 'actualStartDate',
        width: 150,
        required: false,
        elem: 'DATE_PICK',
        editFlag: true,

      },
      {
        title: '实际完成日期',
        dataIndex: 'actualEndDate',
        width: 150,
        required: false,
        elem: 'DATE_PICK',
        editFlag: true,

      },
      {
        title: '实际天数',
        dataIndex: 'schedureDays',
        width: 100,
        required: true,
        elem: 'INPUT',
        editFlag: false,

      },
      {
        title: '开发状态',
        dataIndex: 'schedureStatus',
        width: 100,
        required: true,
        elem: 'COMBOLIST',
        editFlag: true,

      },
      {
        title: '执行人',
        dataIndex: 'workOnduty',
        width: 220,
        required: true,
        elem: 'EMPSELECT',
        editFlag: true,

      },
      {
        title: '协助人',
        dataIndex: 'workAssist',
        width: 220,
        required: true,
        elem: 'EMPSELECT',
        editFlag: true,

      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 150,
        required: true,
        elem: 'INPUT',
        editFlag: true,

      },
      {
        title: '操作',
        key: 'operation',
        width: 85,
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => (
          <span>
            <Button
              hidden={this.state.saveButton}
              key="del"
              onClick={() => this.handleDel(record)}
              type="danger"
              ghost
              ignore="true"
            >
              删除
            </Button>
          </span>
        ),
      },
    ],
    obj: [],
    status:[{
      id: 1,
      code: 0,
      name: '未开始',
    },
      {
        id: 2,
        code: 1,
        name: '进行中',
      },
      {
        id: 3,
        code: 2,
        name: '完成',
      }],
  };

  componentDidMount() {
    this.init();

  };

  handleDel = record => {
    const newObj = [];
    this.state.obj.forEach(item => item !== record && newObj.push(item));
    this.state.obj = newObj;
    for (let i = 0; i <= this.state.obj.length - 1; i++) {
      this.state.obj[i].index = i + 1;
    }
    if (record.id != null) {
      this.handleEvent(
        'del',
         record
      )
    }
  };

  // handleExport = () => {
  //   this.tableRef.extTool.exportData();
  // };

  init = () => {
    const tempColumn = this.state.columns1;
    for (const item of tempColumn) {
      if (item.editFlag) {
        item.editable = true;
      }
    }
    this.setState({
      columns: tempColumn,
    });
  }

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'projectPlan/updateState',
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
              type: 'pmBaseInfoEdit/projPlanDel',
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

  handleSaveBatch = data => {
    this.dispatchAction({
      type: 'pmBaseInfoEdit/projPlanSaveBatch',
      payload: data,
    }).then(res =>{
      if(res.success){
        this.refresh()
      }
    })
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['pmBaseInfoEdit/projPlanDel'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  handleAddGood = () => {
    let add_obj = [];
    let key;
    if(this.state.obj.length > 0){
      key = Math.max.apply(
        Math,
        this.state.obj.map(item => {
          return item.key;
        }),
      );
    }else{
      key = -1;
    }
    add_obj = this.state.obj.concat({
      key: key + 1,
      schedureNo: '',
      schedureStatus: '',
      workType: '',
      workTodoList: '',
      workOnduty: [],
      workAssist: [],
      planStartDate: '',
      planEndDate: '',
      actualStartDate: '',
      actualEndDate: '',
      schedureDays: '',
      remark: '',

    });
    this.state.obj = add_obj;
    this.forceUpdate();
  };

  save = () => {
    const { id } = this.props;
    const save_obj = [];
    let flag = true
    let requiredFlag = true
    this.state.obj.forEach(
      item => {
        if(item.schedureNo !== ''){
            var dataReplace = Object.assign({},item)
            dataReplace.projectId = id;
            dataReplace.planType = this.state.planType
            dataReplace.workOnduty = item.workOnduty.length === 0 ? '' : item.workOnduty.join(",")
            dataReplace.workAssist = item.workAssist.length === 0 ? '' :item.workAssist.join(",")
            save_obj.push(dataReplace);
        }else{
          flag = false
        }
        if(item.schedureStatus === '' || item.workOnduty.length === 0){
          requiredFlag = false
          if(flag)
          message.error('序号[' + item.schedureNo + '] 计划状态或负责人不能为空')
        }
      }
    );
    if(flag && requiredFlag){
      this.handleSaveBatch(save_obj)
    }if(flag === false){
      message.error('序号不能为空！！!')
    }

  };

  changeInput = (e,r,c) => {
    const row = r;
    const obj_copy = this.state.obj
    row[c.dataIndex] = e.target.value
    this.editData[r.key] = row;
    obj_copy[r.key] = row
    this.setState({
      obj: obj_copy
    })
  }

 validateItem = (data) => {
    return data.map(d => {
      if ( d.schedureNo === undefined) {
        return {
          ...d,
          validate: false,
          status: '验证未通过',
          statusCode: 'failed',
          message: '序号不能为空',
        };
      }
      return {
        ...d,
        validate: true,
        status: '验证通过',
        statusCode: 'success',
        message: '验证通过',
      };
    });
  }

  importExcel = (data) => {
    for(let item of data){
      item.planType = this.state.planType
      item.projectId = this.props.id
      item.planEndDate -= 25569
      item.planStartDate -= 25569
      item.actualStartDate -= 25569
      item.actualEndDate -= 25569
    }
    this.dispatchAction({
      type: 'pmBaseInfoEdit/uploadMasterPlan',
      payload: data,
    }).then(res =>{
      if(res.success){
        this.refresh()
      }
    })
  }

  downLoadTemplate = (type) => {
    this.dispatchAction({
      type: 'pmBaseInfoEdit/downLoadTemplate',
      payload: {
        type: type
      }
    });
  }

  getExtableProps = () => {
    const excelColumns = [
      {
        dataIndex: 'schedureNo',
        title: '序号',
      },
      {
        dataIndex: 'schedureStatus',
        title: '状态',
      },
      {
        dataIndex: 'workType',
        title: '任务类型',
      },
      {
        dataIndex: 'workTodoList',
        title: '任务列表',
      },
      {
        dataIndex: 'workOnduty',
        title: '负责人',
      },
      {
        dataIndex: 'workAssist',
        title: '协助人',
      },
      {
        dataIndex: 'planStartDate',
        title: '计划开始日期',
      },
      {
        dataIndex: 'planEndDate',
        title: '计划结束日期',
      },
      {
        dataIndex: 'actualStartDate',
        title: '实际开始日期',
      },
      {
        dataIndex: 'actualEndDate',
        title: '实际结束日期',
      },
      {
        dataIndex: 'schedureDays',
        title: '天数',
      },
      {
        dataIndex: 'remark',
        title: '备注',
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
          <Button
            key="add"
            icon="plus"
            type="primary"
            onClick={this.handleAddGood}
            ignore="true"
          >
            新增行
          </Button>
          <Button
              // hidden={this.state.saveButton}
              type="primary"
              style={{ marginRight: '16px' }}
              ghost
              onClick={this.save}
            >
              保存
            </Button>
          <Button onClick={this.refresh}>刷新</Button>
          <Button onClick={() => this.downLoadTemplate('项目计划导入')}>模板</Button>
          {/* <Button onClick={() => this.tableRef.extTool.exportData()}>导出</Button> */}
          {/* <Button onClick={this.handleExport}>导出</Button> */}
          <DataImport
            tableProps={{ excelColumns, showSearch: false }}
            validateFunc={this.validateItem}
            validateAll={true}
            importFunc={this.importExcel}
            // templateFileList={[
            //   {
            //     download: '/templates/项目计划导入模板.xlsx',
            //     fileName: '项目计划导入模板.xlsx',
            //     key: 'projectPlan',
            //   },
            // ]}
          />,
        </Space>
      ),
    };
    return {
      columns: this.state.columns.map(col => {
        const c = col;
        if (!c.hasOwnProperty('render')) {
          c.render = (_, r, i) => {
            const editRow = this.editData[i.index];
            if (c.editable && this.isEditing(r)) {
              const dom = {};
              this.editRef = {};
              switch (c.elem) {
                case 'INPUT':
                  dom.a = (
                    <Input
                      onBlur={e => {
                        this.handleCellSave(e, r, c);
                      }}
                      value={(editRow && editRow[c.dataIndex]) || r[c.dataIndex]}
                      onChange={e =>{this.changeInput(e,r,c)}}
                    />
                  );
                  break;
                case 'INPUT_NUMBER':
                  dom.a = (
                    <InputNumber
                      onBlur={e => {
                        this.handleCellSave(e, r, c);
                      }}
                      min={0}
                      defaultValue={(editRow && editRow[c.dataIndex]) || r[c.dataIndex]}
                    />
                  );
                break;
                case 'DATE_PICK':
                  debugger
                  dom.a = (
                    <DatePicker
                      ref={node => (this.input = node)}
                      onChange={(m, d) => {
                        this.handleCellSave(d, r, c);
                      }}
                      format="YYYY-MM-DD"
                      value={
                        (editRow && editRow[c.dataIndex] && moment(editRow[c.dataIndex])) ||
                        (r[c.dataIndex] && moment(r[c.dataIndex]))
                      }
                      disabled = {
                        (c.dataIndex === 'planStartDate' || c.dataIndex === 'planEndDate')
                      && ((editRow && editRow[c.dataIndex] != null) || (r[c.dataIndex] != null))}
                    />
                  );
                break;
                case 'COMBOLIST':
                  dom.a = (
                    <ComboList
                      style={{ width: '80px', marginRight: '12px' }}
                      showSearch={false}
                      pagination={false}
                      dataSource={this.state.status}
                      allowClear
                      afterClear={e => { this.handleCellSave(e, r, c)}}
                      afterSelect={e => { this.handleCellSave(e, r, c)}}
                      defaultValue={(editRow && editRow[c.dataIndex]) || r[c.dataIndex]}
                      name="name"
                      field={['name']}
                      reader={{
                        name: 'name',
                        field: ['name'],
                      }}
                    />
                  );
                  break;
                  case 'EMPSELECT':
                    dom.a = (
                      <Select
                        defaultValue={(editRow && editRow[c.dataIndex]) || r[c.dataIndex]}
                        mode="tags"
                        style={{ width: '100%' }}
                        onChange={e => { this.handleCellSave(e, r, c)}}
                      >
                          {this.props.employee}
                      </Select>
                    );
                    break;
                default:
                  break;
              }
              return dom.a;
            }
            return r[col.dataIndex];
          };
        }
        return c;
      }),
      bordered: true,
      toolBar: toolBarProps,
      refreshButton: 'empty',
      remotePaging: true,
      lineNumber: false,
      showSearch: false,
      pagination: false,
      onRow: record => {
        return {
          onClick: () => {
            this.edit(record.index);
          },
        };
      },
      allowCustomColumns: false,
      checkbox: false,
      dataSource: this.state.obj,
      rowKey: 'key',
      // exportData: true,
      // onTableRef: inst => (this.tableRef = inst),
      // exportData: queryParams => {
      //   return {
      //     url: `${PROJECT_PATH}/projectPlan/export`,
      //     data: queryParams,
      //     method: 'POST',
      //     responseType: 'blob',
      //   };
      // },
    };
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  handleCellSave = (e, r, c) => {
    const row = r;
    const obj_copy = this.state.obj
    if(c.elem === 'COMBOLIST'){
      if(e === undefined){
        row[c.dataIndex] = '';
      }else{
        row[c.dataIndex] = e.name;
      }
    }else if(c.elem === 'DATE_PICK'){
      row[c.dataIndex] = e;
      if((c.dataIndex === "actualEndDate" || c.dataIndex === "actualStartDate") && (row.actualEndDate != '' && row.actualStartDate != '' )){
        const days = (Date.parse(row.actualEndDate) - Date.parse(row.actualStartDate)) / 3600 / 1000 /24 + 1;
        row.schedureDays = days;
      }
    }else if(c.elem === 'EMPSELECT'){
      row[c.dataIndex] = e;
    }else{
      row[c.dataIndex] = e.target.value;
    }
    this.editData[r.key] = row;
    obj_copy[r.key] = row
    this.setState({
      obj: obj_copy
    })
  };

  isEditing = record => {
    return record.index === this.state.editingKey ? 1 : 0;
  };

  refresh = () => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'pmBaseInfoEdit/projPlanFindByPage',
      payload: {
        sortOrders: [
          {
            property: 'orderNo'
          }
        ],
        filters: [
          {
            fieldName: 'projectId',
            operator: 'EQ',
            value: id,
          },
          {
            fieldName: 'planType',
            operator: 'EQ',
            value: this.state.planType,
          },
        ],
      }
    }).then(res =>{
      const { rows } = res.data;
      for(let [index,item] of rows.entries()){
        item.key = `${index}`
        item.workOnduty = item.workOnduty === '' || item.workOnduty === null ? [] : item.workOnduty.split(',')
        item.workAssist = item.workAssist === '' || item.workAssist === null ? [] : item.workAssist.split(',')
      }
      this.setState({
        obj : rows
      })
      // message.success('处理成功')
    })
  };

  changePlanType = (e) => {
    this.setState({
      planType: e.target.value
    })
    this.refreshPlanType(e.target.value)
  }


  refreshPlanType = (planType) => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'pmBaseInfoEdit/projPlanFindByPage',
      payload: {
        sortOrders: [
          {
            property: 'orderNo'
          }
        ],
        filters: [
          {
            fieldName: 'projectId',
            operator: 'EQ',
            value: id,
          },
          {
            fieldName: 'planType',
            operator: 'EQ',
            value: planType,
          },
        ],
      }
    }).then(res =>{
      const { rows } = res.data;
      for(let [index,item] of rows.entries()){
        item.key = `${index}`
        item.workOnduty = item.workOnduty === '' || item.workOnduty === null ? [] : item.workOnduty.split(',')
        item.workAssist = item.workAssist === '' || item.workAssist === null ? [] : item.workAssist.split(',')
      }
      this.setState({
        obj : rows
      })
    })
  };

  render() {
    return (
      <>
        <ProLayout>
          <Header>
            <div>
              <Radio.Group defaultValue="0" buttonStyle="solid" onChange={this.changePlanType} size="large">
                <Radio.Button value="0">主计划</Radio.Button>
                <Radio.Button value="1">后端开发计划</Radio.Button>
                <Radio.Button value="2">前端开发计划</Radio.Button>
                <Radio.Button value="3">实施计划</Radio.Button>
              </Radio.Group>
            </div>
          </Header>
          <Content>
            <ExtTable style={{ height: "620px" }} onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
          </Content>
        </ProLayout>
      </>
    );
  }
}

export default ProjectPlan;
