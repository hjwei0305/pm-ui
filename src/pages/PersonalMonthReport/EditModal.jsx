import React, { PureComponent } from 'react';
import { Form, Button, DatePicker, message, InputNumber, Input, Select, Tag } from 'antd';
import { ExtModal, ExtTable, Space, ComboList } from 'suid';
import moment from 'moment';

const { MonthPicker } = DatePicker;
const { Option } = Select

@Form.create()
class FormModal extends PureComponent {
  constructor(props) {
    super(props);
    this.editData = {};
  }

  static editData;

  static = {
    orgnameFilter: null,
    employeeNameFilter: null,
    monthDate: ''
  }
  state = {
    editingKey: '',
    employee:[],
    status:[{
      id: 1,
      code: 0,
      name: 'A',
      },
      {
        id: 2,
        code: 1,
        name: 'B',
      },
      {
        id: 3,
        code: 2,
        name: 'C',
      },
      {
        id: 4,
        code: 3,
        name: 'D',
      }],
    OrNotStatus:[
      {
        code: 0,
        name: '否',
      },
      {
        code: 1,
        name: '是',
      },
      {
        code: 2,
        name: '',
      },
    ],
    columns: [],
    dataList: [],
    columns1: [
      {
        title: '序号',
        dataIndex: 'scheNo',
        width: 80,
        required: true,
        elem:'INPUT',
        editFlag: true,
        fixed: true,
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 220,
        required: true,
        elem: 'INPUT',
        editFlag: true,
        fixed: true,
      },
      {
        title: '主要任务/关键步骤',
        dataIndex: 'workTodoList',
        width: 220,
        required: true,
        elem: 'INPUT',
        editFlag: true,
        fixed: true,
      },
      {
        title: '类别',
        dataIndex: 'type',
        width: 100,
        required: true,
        elem: 'COMBOLIST',
        editFlag: true,
        fixed: true,
      },
      {
        title: '协助人',
        dataIndex: 'workAssist',
        width: 150,
        required: true,
        elem: 'EMPSELECT',
        editFlag: true,
      },
      {
        title: '计划开始日期',
        dataIndex: 'planStartDate',
        width: 150,
        required: true,
        elem: 'DATE_PICK',
        editFlag: true,
      },
      {
        title: '计划结案日期',
        dataIndex: 'planEndDate',
        width: 150,
        required: true,
        elem: 'DATE_PICK',
        editFlag: true,
      },
      {
        title: '实际开始日期',
        dataIndex: 'actualStartDate',
        width: 150,
        required: true,
        elem: 'DATE_PICK',
        editFlag: true,
      },
      {
        title: '实际结案日期',
        dataIndex: 'actualEndDate',
        width: 150,
        required: true,
        elem: 'DATE_PICK',
        editFlag: true,
      },
      {
        title: '实际天数',
        dataIndex: 'schedureDays',
        width: 80,
        required: true,
        elem: 'INPUT_A',
        editFlag: false,
      },
      {
        title: '所占比例',
        dataIndex: 'workHouresRate',
        width: 100,
        required: true,
        elem: 'INPUT',
        editFlag: true,
        render:(_, record) => (
          record.workHouresRate + "%"
        )
      },
      {
        title: '工作时间(H)',
        dataIndex: 'workHours',
        width: 100,
        required: true,
        elem: 'INPUT',
        editFlag: false,
      },
      {
        title: '第一周进度',
        dataIndex: 'firstWeekSituation',
        width: 120,
        required: true,
        elem: 'INPUT',
        editFlag: true,
      },
      {
        title: '第二周进度',
        dataIndex: 'secondWeekSituation',
        width: 120,
        required: true,
        elem: 'INPUT',
        editFlag: true,
      },
      {
        title: '第三周进度',
        dataIndex: 'thirdWeekSituation',
        width: 120,
        required: true,
        elem: 'INPUT',
        editFlag: true,
      },
      {
        title: '第四周进度',
        dataIndex: 'fourthWeekSituation',
        width: 120,
        required: true,
        elem: 'INPUT',
        editFlag: true,
      },
      {
        title: '是否达成',
        dataIndex: 'complete',
        width: 100,
        required: true,
        elem: 'COMBOLIST_SUCCESS',
        editFlag: true,
      },
      {
        title: '是否生成',
        dataIndex: 'autoGenerate',
        width: 100,
        required: true,
        elem: 'INPUT',
        editFlag: false,
        render: (_, record) => {
          if (record.autoGenerate) {
            return <Tag color="green">是</Tag>;
          }
          return <Tag color="red">否</Tag>;
        },
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
  }

  componentDidMount() {
    const { editData, dispatch } = this.props
    this.monthDate = editData ? editData.ym : null
    // 查看详情进来，带出明细
    if(editData){
      dispatch({
        type: 'personalMonthReport/findBypersonalMonthReportId',
        payload:{
          sortOrders: [
            {
              property: 'scheNo'
            }
          ],
          filters: [
            {
              fieldName: 'personalMonthReportId',
              operator: 'EQ',
              fieldType: 'string',
              value: editData.id,
            }
          ]
        }
      }).then(res => {
        const { data, msg } = res;
        if(data){
          for(let [index,item] of data.entries()){
            item.key = index
            item.workAssist = item.workAssist === '' ? [] : item.workAssist.split(',')
            for(let obj of this.state.OrNotStatus){
              if(obj.code === item.complete){
                item.complete = obj.name
              }
            }
          }
          if(data.length > 0){
            this.setState({
              dataList : data
            })
          }
        }
      })
    }

    dispatch({
      type: 'personalMonthReport/findEmp',
      payload: {
        filters: [
        ],
      },
    }).then(res => {
      const { data } = res;
      for (let i = 0; i < data.length; i++) {
        this.state.employee.push(<Option key={data[i].employeeName} orgname={data[i].orgname}>{data[i].employeeName}</Option>);
      }
    });
    this.init();
  };

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

  handleDel = record => {
    const newObj = [];
    this.state.dataList.forEach(item => item !== record && newObj.push(item));
    this.setState({
      dataList: newObj
    })
    // for (let i = 0; i <= this.state.dataList.length - 1; i++) {
    //   this.state.dataList[i].index = i + 1;
    // }
    // if (record.id != null) {
    //   this.handleEvent(
    //     'del',
    //      record
    //   )
    // }
  };

  handleEvent = (type, row) => {
    switch (type) {
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

  getTableFilters = () => {
    const filters = [];
    if (this.monthDate) {
      filters.push({
        fieldName: 'month',
        operator: 'EQ',
        fieldType: 'string',
        value: this.monthDate,
      });
    }
    return filters;
  };

  save = () => {
    const { editData } = this.props
    const save_obj = [];
    this.state.editingKey = 0
    let flag = true
    this.state.dataList.forEach(
      item => {
        if(item.scheNo !== '' && item.workTodoList !== ''){
            var dataReplace = Object.assign({},item)
            dataReplace.workAssist = item.workAssist.length === 0 ? '' :item.workAssist.join(",")
            dataReplace.ym = this.monthDate
            // 文字转换为数字后保存
            for(let obj of this.state.OrNotStatus){
              if(obj.name === dataReplace.complete){
                dataReplace.complete = obj.code
              }
            }
            if(editData){
              dataReplace.personalMonthReportId = editData.id
            }
            save_obj.push(dataReplace);
        }else{
          flag = false
        }
      }
    );
    if(flag){
      this.handleSaveBatch(save_obj)
    }if(flag === false){
      message.error('序号、任务不能为空！！!')
    }
  };

  handleSaveBatch = data => {
    const { dispatch } = this.props
    dispatch({
      type: 'personalMonthReport/monthPlanSaveBatch',
      payload: data,
    }).then(res =>{
      const { data, msg } = res;
      if(data){
        for(let [index,item] of data.entries()){
          item.key = index
          item.workAssist = item.workAssist === '' ? [] : item.workAssist.split(',')
          // 保存后返回的数据，转换文字
          for(let obj of this.state.OrNotStatus){
            if(obj.code === item.complete){
              item.complete = obj.name
            }
          }
        }
        if(data.length > 0){
          this.setState({
            dataList : data
          })
        }
      }
    })
  };

  handleCellSave = (e, r, c) => {
    const row = r;
    const obj_copy = this.state.dataList
    if(c.elem === 'COMBOLIST'){
      row[c.dataIndex] = e.name;
    }else if(c.elem === 'COMBOLIST_SUCCESS'){
      row[c.dataIndex] = e.code;
    }else if(c.elem === 'DATE_PICK'){
      row[c.dataIndex] = e;
      // 计算实际天数
      if(c.dataIndex === "actualEndDate" || c.dataIndex === "actualStartDate"){
        const days = (Date.parse(row.actualEndDate) - Date.parse(row.actualStartDate)) / 3600 / 1000 /24 + 1;
        if(Number.isNaN(days)){
          row.schedureDays = 0
          row.workHours = 0
          row.workHouresRate = 0
          this.state.editingKey = 0
        }else{
          row.schedureDays = days
          row.workHours = days * 8
          row.workHouresRate = (row.workHours * 100 / 188).toFixed(2)
          this.state.editingKey = 0
        }
      }
    }else if(c.elem === 'EMPSELECT'){
      row[c.dataIndex] = e;
    }else{
      row[c.dataIndex] = e.target.value;
    }
    this.editData[r.key] = row;
    obj_copy[r.key] = row
    this.setState({
      dataList: obj_copy
    })
  };

  changeInput = (e,r,c) => {
    const row = r;
    const obj_copy = this.state.dataList
    row[c.dataIndex] = e.target.value
    this.editData[r.key] = row;
    obj_copy[r.key] = row
    this.setState({
      dataList: obj_copy
    })
  }

  handleAddGood = () => {
    let add_obj = [];
    let key;
    if(this.state.dataList.length > 0){
      key = Math.max.apply(
        Math,
        this.state.dataList.map(item => {
          return item.key;
        }),
      );
    }else{
      key = -1;
    }
    add_obj = this.state.dataList.concat({
      key: key + 1,
      scheNo: '',
      planStartDate: '',
      planEndDate: '',
      actualStartDate: '',
      actualEndDate: '',
      schedureDays: 0,
      projectName: '',
      workTodoList: '',
      type: '',
      workHouresRate:0,
      workHours:0,
      workAssist: [],
      firstWeekSituation: '',
      secondWeekSituation: '',
      thirdWeekSituation: '',
      fourthWeekSituation: '',
      complete: '',
      autoGenerate: 0
    });
    this.setState({
      dataList : add_obj
    })
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'scheNo',
        width: 120,
        required: true,
      },
      {
        title: '计划开始日期',
        dataIndex: 'planStartDate',
        width: 120,
        required: true,
      },
      {
        title: '计划结案日期',
        dataIndex: 'planEndDate',
        width: 120,
        required: true,
      },
      {
        title: '实际开始日期',
        dataIndex: 'actualStartDate',
        width: 120,
        required: true,
      },
      {
        title: '实际结案日期',
        dataIndex: 'actualEndDate',
        width: 120,
        required: true,
      },
      {
        title: '实际天数',
        dataIndex: 'schedureDays',
        width: 100,
        required: true,
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 220,
        required: true,
      },
      {
        title: '主要任务/关键步骤',
        dataIndex: 'workTodoList',
        width: 220,
        required: true,
      },
      {
        title: '类别',
        dataIndex: 'type',
        width: 80,
        required: true,
      },
      {
        title: '所占比例',
        dataIndex: 'workHouresRate',
        width: 120,
        required: true,
        render:(_, record) => (
          record.workHouresRate + "%"
        )
      },
      {
        title: '工作时间(H)',
        dataIndex: 'workHours',
        width: 120,
        required: true,
      },
      {
        title: '协助人',
        dataIndex: 'workAssist',
        width: 120,
        required: true,
      },
      {
        title: '第一周进度',
        dataIndex: 'firstWeekSituation',
        width: 120,
        required: true,
      },
      {
        title: '第二周进度',
        dataIndex: 'secondWeekSituation',
        width: 120,
        required: true,
      },
      {
        title: '第三周进度',
        dataIndex: 'thirdWeekSituation',
        width: 120,
        required: true,
      },
      {
        title: '第四周进度',
        dataIndex: 'fourthWeekSituation',
        width: 120,
        required: true,
      },
      {
        title: '是否达成',
        dataIndex: 'complete',
        width: 120,
        required: true,
      },
    ];

    const toolBarProps = {
      left: (
        <Space>
          <MonthPicker
            onChange={(_,dateString) => this.Monthchange(_,dateString)}
            placeholder='请选择生成月份'
            defaultValue={this.props.editData ? moment(this.monthDate) : ''}
            disabled = { this.props.editData ? true : false}
          />
          <Button type='primary' onClick={this.createPersonalMonthPlan}>生成计划</Button>
          <Button
            key="add"
            icon="plus"
            type="primary"
            onClick={this.handleAddGood}
            ignore="true"
          >
            新增行
          </Button>
          <Button type='primary' onClick={this.save}>保存</Button>
        </Space>
      ),
    };
    // const filters = this.getTableFilters();
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
                      defaultValue={(editRow && editRow[c.dataIndex]) || r[c.dataIndex]}
                      onChange={e =>{this.changeInput(e,r,c)}}
                    />
                  );
                  break;
                case 'INPUT_A':
                  dom.a = (
                    <Input
                      onBlur={e => {
                        this.handleCellSave(e, r, c);
                      }}
                      defaultValue={(editRow && editRow[c.dataIndex]) || r[c.dataIndex]}
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
                  dom.a = (
                    <DatePicker
                      ref={node => (this.input = node)}
                      onChange={(m, d) => {
                        this.handleCellSave(d, r, c);
                      }}
                      format="YYYY-MM-DD"
                      defaultValue={
                        (editRow && editRow[c.dataIndex] && moment(editRow[c.dataIndex])) ||
                        (r[c.dataIndex] && moment(r[c.dataIndex]))
                      }
                      // disabled = {
                      //   (c.dataIndex === 'planStartDate' || c.dataIndex === 'planEndDate')
                      // && (r.id !== undefined && (r[c.dataIndex] != "") && (r[c.dataIndex] != null))}
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
                case 'COMBOLIST_SUCCESS':
                    dom.a = (
                      <ComboList
                        style={{ width: '80px', marginRight: '12px' }}
                        showSearch={false}
                        allowClear
                        pagination={false}
                        dataSource={this.state.OrNotStatus}
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
                          {this.state.employee}
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
      dataSource: this.state.dataList,
      rowKey: 'key',
    };
  };

  isEditing = record => {
    return record.index === this.state.editingKey ? 1 : 0;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  /** 手动生成计划 */
  createPersonalMonthPlan = () => {
    const { dispatch } = this.props;
    this.state.editingKey = 0
    if(this.monthDate){
      const filters = this.getTableFilters()
      dispatch({
        type: 'personalMonthReport/createPersonalMonthPlan',
        payload:{
          sortOrders: [
            {
              property: 'scheNo'
            }
          ],
          filters
        }
      }).then(res => {
        const { data, msg } = res;
        if(data){
          const createObj = []
          const dataObj = this.state.dataList
          let key = 0;
          let scheNo = 1
          // 计算当前key
          // if(dataObj.length > 0){
          //   key = Math.max.apply(
          //     Math,
          //     dataObj.map(item => {
          //       return item.key;
          //     }),
          //   );
          // }else{
          //   key = -1;
          // }
          // 除去自动生成数据，重排scheNo
          for(let [index,item] of dataObj.entries()){
            if(item.autoGenerate === false){
              item.key = key
              key++
              item.scheNo = scheNo
              scheNo++
              createObj.push(item)
            }
          }
          // push重新生成的数据
          for(let [index,obj] of data.entries()){
            obj.key = key
            key++
            obj.scheNo = scheNo
            scheNo++
            obj.workAssist = obj.workAssist === '' ? [] : obj.workAssist.split(',')
            for(let item of this.state.OrNotStatus){
              if(item.code === obj.complete){
                obj.complete = item.name
              }
            }
            createObj.push(obj)
          }
          if(data.length > 0){
            this.setState({
              dataList : createObj
            })
          }
        }
      })
    }else{
      message.error('请选择生成月份')
    }
  }

  Monthchange = (date,dateString) => {
    this.monthDate = dateString
  }

  render() {
    const { onClose, visible, saving } = this.props;
    let title = '个人月度计划';

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={
          [<div style={{fontSize:'20px'}}>{title}</div>]
        }
        fullScreen={true}
        footer={null}
      >
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()}/>
      </ExtModal>
    );
  }
}

export default FormModal;
