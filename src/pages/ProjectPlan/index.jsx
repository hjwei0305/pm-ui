import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, InputNumber, Input, DatePicker } from 'antd';
import { ExtTable, ExtIcon, Space, ComboList } from 'suid';
// import {constants} from "@/utils";
import moment from 'moment';

// const {PROJECT_PATH} = constants

@withRouter
@connect(({ projectPlan, loading }) => ({ projectPlan, loading }))
class ProjectPlan extends Component {
  state = {
    editingKey: '',
    delId: null,
    columns: [
      {
        title: '序号',
        dataIndex: 'schedureNo',
        width: 90,
        required: true,
        elem: 'INPUT',
        editFlag: true,
        fixed: 'left',
      },
      {
        title: '状态',
        dataIndex: 'schedureStatus',
        width: 90,
        required: true,
        elem: 'COMBOLIST',
        editFlag: true,
        fixed: 'left',
      },
      {
        title: '任务类型',
        dataIndex: 'workType',
        width: 90,
        required: true,
        elem: 'INPUT',
        editFlag: true,
        fixed: 'left',
      },
      {
        title: '任务列表',
        dataIndex: 'workTodoList',
        width: 90,
        required: true,
        elem: 'INPUT',
        editFlag: true,
        fixed: 'left',
      },
      {
        title: '负责人',
        dataIndex: 'workOnduty',
        width: 90,
        required: true,
        elem: 'INPUT',
        editFlag: true,
        fixed: 'left',
      },
      {
        title: '协助人',
        dataIndex: 'workAssist',
        width: 90,
        required: true,
        elem: 'INPUT',
        editFlag: true,
        fixed: 'left',
      },
      {
        title: '计划开始日期',
        dataIndex: 'planStartDate',
        width: 130,
        required: false,
        elem: 'DATE_PICK',
        editFlag: true,
        fixed: 'left',
      },
      {
        title: '计划结束日期',
        dataIndex: 'planEndDate',
        width: 130,
        required: false,
        elem: 'DATE_PICK',
        editFlag: true,
        fixed: 'left',
      },
      {
        title: '实际开始日期',
        dataIndex: 'actualStartDate',
        width: 130,
        required: false,
        elem: 'DATE_PICK',
        editFlag: true,
        fixed: 'left',
      },
      {
        title: '实际结束日期',
        dataIndex: 'actualEndDate',
        width: 130,
        required: false,
        elem: 'DATE_PICK',
        editFlag: true,
        fixed: 'left',
      },
      {
        title: '天数',
        dataIndex: 'schedureDays',
        width: 70,
        required: true,
        elem: 'INPUT',
        editFlag: true,
        fixed: 'left',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 90,
        required: true,
        elem: 'INPUT',
        editFlag: true,
        fixed: 'left',
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

  static editData;

  constructor(props) {
    super(props);
    const { dispatch,id } = this.props;
    let cg = [];
    this.editData = {};
    for (let i = 1; i <= 5; i++) {
      cg = cg.concat({
        id: i,
        key: i,
        orderCode: '',
        goodsCode: '',
        goodsName: '',
        specificationModal: '',
        unit: '',
        number: '',
        remark: '',
      });
    }
    this.state.obj = cg;

    dispatch({
      type: 'projectPlan/findByPage',
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
        ],
      }
    }).then(res =>{
      const { rows } = res.data;
      for(let [index,item] of rows.entries()){
        console.log(index)
        console.log(item)
        // item.key = index
      }
      if(rows.length > 0){
        this.setState({
          obj : rows
        })
      }
    })
  }

  componentDidMount() {
    this.init();

  };

  /**
   * 删除功能
   * @param {*} record 
   */
  handleDel = record => {
    const new_obj = [];
    this.state.obj.forEach(item => item != record && new_obj.push(item));
    this.state.obj = new_obj;
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

  /**
   * 初始化计划表
   */
  init = () => {
    const tempColumn = this.state.columns;
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
              type: 'projectPlan/del',
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
      type: 'projectPlan/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'projectPlan/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.refresh();
      }
    });
  };

  /**
   * 批量保存多行计划
   * @param {*} data 
   */
  handleSaveBatch = data => {
    this.dispatchAction({
      type: 'projectPlan/saveBatch',
      payload: data,
    }).then(res =>{
      if(res.success){
        this.refresh()
      }
    })
  };

  handleClose = () => {
    this.dispatchAction({
      type: 'projectPlan/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['projectPlan/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  /**
   * 添加行
   */
  handleAddGood = () => {
    let add_obj = [];
    const key = Math.max.apply(
      Math,
      this.state.obj.map(item => {
        return item.key;
      }),
    );
    add_obj = this.state.obj.concat({
      key: key + 1,
      schedureNo: '',
    });
    this.state.obj = add_obj;
    this.forceUpdate();
  };

  /**
   * 保存
   */
  save = () => {
    const { id } = this.props;
    const save_obj = [];
    this.state.obj.forEach(
      item => {
        if((item.schedureNo != '' ||
          item.projectId != '' ||
          item.workType != '' ||
          item.workTodoList != '' )){
            item.projectId = id;
            save_obj.push(item);
          }

      }
    );
    this.handleSaveBatch(save_obj)
  };

  getExtableProps = () => {
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
              switch (c.elem) {
                case 'INPUT':
                  dom.a = (
                    <Input
                      onBlur={e => {
                        this.handleCellSave(e, r, c);
                      }}
                      defaultValue={(editRow && editRow[c.dataIndex]) || r[c.dataIndex]}
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
                      value={
                        (editRow && editRow[c.dataIndex] && moment(editRow[c.dataIndex])) ||
                        (r[c.dataIndex] && moment(r[c.dataIndex]))
                      }
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
    };
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  handleCellSave = (e, r, c) => {
    const row = r;
    const obj_copy = this.state.obj
    console.log(e)
    console.log(r)
    console.log(c)
    if(c.elem == 'COMBOLIST'){
      row[c.dataIndex] = e.name;
    }else if(c.elem == 'DATE_PICK'){
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
      type: 'projectPlan/findByPage',
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
        ],
      }
    }).then(res =>{
      const { rows } = res.data;
      for(let [index,item] of rows.entries()){
        item.key = `${index}${new Date()}`
      }
      this.setState({
        obj : rows
      })
    })
  };

  render() {
    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
      </>
    );
  }
}

export default ProjectPlan;
