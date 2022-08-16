import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { ProLayout, ExtTable, ComboList, utils } from 'suid';
import { Tree, Tabs, Input, Button, message } from 'antd';
import TreeView from '@/components/TreeView';
import Table from './components/Table';
import { constants,exportXlsx } from '@/utils';

const { request } = utils;
const { TreeNode } = Tree;
const { TabPane } = Tabs;
const { PROJECT_PATH } = constants;

const { SiderBar, Content, Header  } = ProLayout;
@connect(({ emp, loading }) => ({ emp, loading }))
class Emp extends Component {
  state = {
    codeFilter: null,
    employeeNameFilter: null,
    empstatidFilter: null,
    status:[{
      id: 1,
      code: 1,
      name: '实习',
    },
    {
      id: 2,
      code: 2,
      name: '试用',
    },
    {
      id: 3,
      code: 3,
      name: '考察',
    },
    {
      id: 4,
      code: 4,
      name: '正式',
    },
    {
      id: 12,
      code: 12,
      name: '离职',
    }]
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'emp/queryTree',
    });
  }

  getExtableProps = () => {
    const columns = [
      // {
      //   title: '操作',
      //   key: 'operation',
      //   width: 100,
      //   align: 'center',
      //   dataIndex: 'id',
      //   className: 'action',
      //   required: true,
      //   render: (_, record) => (
      //     <Fragment>
      //       <ExtIcon
      //         key="edit"
      //         className="edit"
      //         onClick={() => this.handleEvent('edit', record)}
      //         type="edit"
      //         status="success"
      //         tooltip={{ title: '编辑' }}
      //         antd
      //       />
      //     </Fragment>
      //   ),
      // },
      {
        title: '姓名',
        dataIndex: 'employeeName',
        width: 100,
        required: true,
      },
      {
        title: '工号',
        dataIndex: 'employeeCode',
        width: 100,
        required: true,
      },
      {
        title: '职务',
        dataIndex: 'spName',
        width: 150,
        required: true,
      },
      {
        title: '所在小组',
        dataIndex: 'projectMaster',
        width: 200,
        required: true,
      },
      {
        title: '所在部门',
        dataIndex: 'orgname',
        width: 500,
        required: true,
      },
      {
        title: '联系电话',
        dataIndex: 'telephone',
        width: 200,
        required: true,
      },
      {
        title: '在职状态',
        dataIndex: 'empstatidEnumRemark',
        width: 100,
        required: true,
      },
    ];
    const toolBarProps = {
      layout: { leftSpan: 22, rightSpan: 2 },
      left: (
        <Fragment>
          姓名：{' '}
          <Input style={{width:"150px",marginRight:"10px"}} onChange={(event) => this.setState({ employeeNameFilter: event.target.value })} allowClear></Input>
          在职状态：{' '}
          <ComboList
            style={{ width: '150px', marginRight: '10px' }}
            showSearch={false}
            pagination={false}
            dataSource={this.state.status}
            allowClear
            name="name"
            field={['name']}
            afterClear={() => this.setState({ empstatidFilter: null })}
            afterSelect={item => this.setState({ empstatidFilter: item.code })}
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
          <Button type='primary' onClick={this.handlerExport}>导出</Button>
        </Fragment>
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
        url: `${PROJECT_PATH}/pmEmployee/findByPage`,
      },
    };
  };

  handlerExport = () => {
    const tableFilters = this.getTableFilters();
    request.post(`${PROJECT_PATH}/pmEmployee/export`, { filters: tableFilters }).then(res => {
      const { success, data } = res;
      if (success && data.length > 0) {
        exportXlsx(
          '人员一览表',
          [
            '工号',
            '姓名',
            '职务',
            '所在部门',
            '联系电话',
            '在职状态',
          ],
          data,
        );
      } else {
        message.error('没找到数据');
      }
    });
  };

  getTableFilters = () =>{
    const { codeFilter,employeeNameFilter,empstatidFilter } = this.state;
    const filters = [];
    if (codeFilter !== null) {
      filters.push({
        fieldName: 'orgcode',
        operator: 'EQ',
        fieldType: 'string',
        value: codeFilter,
      });
    }
    if (employeeNameFilter !== null) {
      filters.push({
        fieldName: 'employeeName',
        operator: 'LK',
        fieldType: 'string',
        value: employeeNameFilter,
      });
    }
    if (empstatidFilter !== null) {
      filters.push({
        fieldName: 'empstatid',
        operator: 'EQ',
        fieldType: 'string',
        value: empstatidFilter,
      });
    }
    return filters;
  }

  handleSelect = selectNodes => {
    if (selectNodes && selectNodes.length) {
      this.setState({
        codeFilter : selectNodes[0].code,
      })
    }
  };

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  render() {
    const { emp } = this.props;
    const { treeData, currNode } = emp;
    const callback = (key) => {
      console.log(key);
    }

    return (
      <ProLayout style={{background: "#F4F8FC",padding:"8px 12px"}}>
        <SiderBar allowCollapse width={300} gutter={[0,8]}>
          <TreeView
            treeData={treeData}
            onSelect={this.handleSelect}
          />
        </SiderBar>
        <Content>
        <div style={{marginLeft:"12px",background:"white",height:"100%"}}>
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="人员" key="1">
                  <ExtTable style={{height:"500px"}} onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
                </TabPane>
                <TabPane tab="组织" key="2">
                  Content of Tab Pane 2
                </TabPane>
              </Tabs>
            </div>
        </Content>
      </ProLayout>
    );
  }
}

export default Emp;
