import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { ProLayout, ExtTable, ComboList, utils, ExtIcon } from 'suid';
import { Tree, Tabs, Input, Button, message, Tag } from 'antd';
import TreeView from '@/components/TreeView';
import { constants,exportXlsx } from '@/utils';
import EditModal from './EditModal';

const { request } = utils;
const { TreeNode } = Tree;
const { TabPane } = Tabs;
const { PROJECT_PATH } = constants;

const { SiderBar, Content, Header  } = ProLayout;
@connect(({ emp, loading }) => ({ emp, loading }))
class Emp extends Component {
  state = {
    activeKey: 1,
    codeFilter: null,
    employeeNameFilter: null,
    empstatidFilter: null,
    idpathFilter: null,
    nameFilter: null,
    groupNameFilter: null,
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
  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };
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
          type: 'emp/updateState',
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
              type: 'healthActitype/del',
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

  /**
   *
   * @returns 人员表格
   */
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
        dataIndex: 'pmOrganizeGroupName',
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
  /**
   * 人员导出
   */
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
            '所在小组',
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
  /**
   * 组织导出
   */
 handlerOrgExport = () => {
  const tableFilters = this.getTableOrgFilters();
  request.post(`${PROJECT_PATH}/pmOrganize/export`, { filters: tableFilters }).then(res => {
    const { success, data } = res;
    if (success && data.length > 0) {
      exportXlsx(
        '组织一览表',
        [
          '单位名称',
          '部门名称',
          '小组名称',
          '组长',
          '小组成员数量',
          '是否冻结',
        ],
        data,
      );
    } else {
      message.error('没找到数据');
    }
  });
};
  /**
   *
   * @returns 人员过滤
   */
  getTableFilters = () =>{
    const { idpathFilter,employeeNameFilter,empstatidFilter } = this.state;
    const filters = [];
    if (idpathFilter !== null) {
      filters.push({
        fieldName: 'idpath',
        operator: 'LK',
        fieldType: 'string',
        value: idpathFilter,
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
  /**
   *
   * @returns 部门过滤
   */
  getTableOrgFilters = () =>{
    const { idpathFilter, nameFilter, groupNameFilter} = this.state;
    const filters = [];
    if (idpathFilter !== null) {
      filters.push({
        fieldName: 'idpath',
        operator: 'LK',
        fieldType: 'string',
        value: idpathFilter,
      });
    }
    if (nameFilter !== null && nameFilter != '') {
      filters.push({
        fieldName: 'name',
        operator: 'LK',
        fieldType: 'string',
        value: nameFilter,
      });
    }
    if (groupNameFilter !== null && groupNameFilter != '') {
      filters.push({
        fieldName: 'groupName',
        operator: 'LK',
        fieldType: 'string',
        value: groupNameFilter,
      });
    }
    return filters;
  }
  /**
   *
   * @returns 部门表格
   */
  getOrgExtableProps = () => {
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
          <Fragment>
            <ExtIcon
              key="edit"
              className="edit"
              onClick={() => this.handleEvent('edit', record)}
              type="edit"
              status="success"
              tooltip={{ title: '编辑' }}
              antd
            />
          </Fragment>
        ),
      },
      {
        title: '单位名称',
        dataIndex: 'extorgname',
        width: 500,
        required: true,
      },
      {
        title: '部门名称',
        dataIndex: 'name',
        width: 150,
        required: true,
      },
      {
        title: '小组名称',
        dataIndex: 'groupName',
        width: 150,
      },
      {
        title: '组长',
        dataIndex: 'manager',
        width: 200,
      },
      {
        title: '小组成员数量',
        dataIndex: 'memberCount',
        width: 100,
      },
      {
        title: '是否冻结',
        dataIndex: 'frozen',
        width: 120,
        required: true,
        render: (_, row) => {
          if (row.frozen) {
            return <Tag color="green">是</Tag>;
          }
          return <Tag color="red">否</Tag>;
        },
      },
    ];
    const toolBarProps = {
      layout: { leftSpan: 22, rightSpan: 2 },
      left: (
        <Fragment>
          部门：{' '}
          <Input style={{width:"150px",marginRight:"10px"}} onChange={(event) => this.setState({ nameFilter: event.target.value })} allowClear></Input>
          小组：{' '}
          <Input style={{width:"150px",marginRight:"10px"}} onChange={(event) => this.setState({ groupNameFilter: event.target.value })} allowClear></Input>
          <Button type='primary' onClick={this.handlerOrgExport}>导出</Button>
        </Fragment>
      ),
    };
    const filters = this.getTableOrgFilters();
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
        url: `${PROJECT_PATH}/pmOrganize/findByPage`,
      },
    };
  };

  /**
   * 点击树形节点
   * @param selectNodes
   */
  handleSelect = selectNodes => {
    if (selectNodes && selectNodes.length) {
      this.setState({
        codeFilter : selectNodes[0].code,
        idpathFilter: selectNodes[0].idpath,
      })
    }
  };

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  callback = (key) =>{
    this.setState({
      activeKey: key,
    })
  }

  handleSave = data => {
    this.dispatchAction({
      type: 'emp/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'emp/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.refresh();
      }
    });
  };

  handleClose = () => {
    this.dispatchAction({
      type: 'emp/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  getEditModalProps = () => {
    const { loading, emp } = this.props;
    const { modalVisible, editData } = emp;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['emp/save'],
    };
  };

  render() {
    const { emp } = this.props;
    const { treeData, currNode, modalVisible } = emp;

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
            <Tabs defaultActiveKey="1"
             onChange={this.callback}
             >
              <TabPane tab="人员" key="1">
                <ExtTable style={{height:"500px"}} onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
              </TabPane>
              <TabPane tab="组织" key="2">
                <ExtTable style={{height:"500px"}} onTableRef={inst => (this.tableRef = inst)} {...this.getOrgExtableProps()} />
                {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
              </TabPane>
            </Tabs>
          </div>
        </Content>
      </ProLayout>
    );
  }
}

export default Emp;
