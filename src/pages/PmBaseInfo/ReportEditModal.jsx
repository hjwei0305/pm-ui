import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Popconfirm } from 'antd';
import { ExtModal, ExtTable, Space, ExtIcon, utils, ComboList } from 'suid';
import { constants, exportXlsx } from '@/utils';

const { PROJECT_PATH } = constants;
const { request } = utils;

@Form.create()
class FormModal extends PureComponent {
  static = {
    orgnameFilter: null,
    employeeNameFilter: null
  }

  getTableFilters = () => {
    // const { editData } = this.props
    // const { employeeCodeFilter, employeeNameFilter } = this.state;
    const filters = [];
    if (this.orgnameFilter) {
      filters.push({
        fieldName: 'orgname',
        operator: 'LK',
        fieldType: 'string',
        value: this.orgnameFilter,
      });
    }
    if (this.employeeNameFilter) {
      filters.push({
        fieldName: 'member',
        operator: 'LK',
        fieldType: 'string',
        value: this.employeeNameFilter,
      });
    }
    return filters;
  };

  getExtableProps = () => {
    const { editData, orgnameList } = this.props
    const columns = [
      {
        title: '工号',
        dataIndex: 'employeeCode',
        width: 120,
        required: true,
      },
      {
        title: '姓名',
        dataIndex: 'employeeName',
        width: 120,
        required: true,
      },
      {
        title: '部门',
        dataIndex: 'orgname',
        width: 220,
        required: true,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        width: 50,
        required: true,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        width: 50,
        required: true,
      },
      {
        title: '电话',
        dataIndex: 'tel',
        width: 120,
        required: true,
      },
      {
        title: '入职日期',
        dataIndex: 'hiredday',
        width: 220,
        required: true,
      },
      {
        title: '岗位',
        dataIndex: 'spName',
        width: 120,
        required: true,
      },
      {
        title: '职级',
        dataIndex: 'lvNum',
        width: 50,
        required: true,
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
            dataSource={orgnameList}
            allowClear
            name="name"
            field={['name']}
            afterClear={item => this.orgnameFilter=null}
            afterSelect={item => this.orgnameFilter=item.name}
            reader={{
              name: 'name',
              field: ['name'],
            }}
          />
          {/* <Input 
            style={{width:"150px"}} 
            onChange={(event) => this.setState({ employeeCodeFilter: event.target.value })} 
            allowClear
          >
          </Input> */}
          汇报人:{' '}
          <Input 
            style={{width:"150px"}} 
            onChange={(event) => this.setState({ employeeNameFilter: event.target.value })} 
            allowClear
          >
          </Input>
          {/* <Button onClick={this.refresh}>刷新</Button> */}
          <Button onClick={this.refresh}>新增</Button>
          <Button type='primary' onClick={this.handlerExport}>导出</Button>
        </Space>
      ),
    };
    const filters = this.getTableFilters();
    return {
      showSearch: false,
      checkbox: false,
      columns,
      toolBar: toolBarProps,
      cascadeParams: {
        filters,
      },
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/pmBaseinfo/findByPage`,
      },
    };
  };

  render() {
    const { form, onClose, sync, visible, saving } = this.props;
    const { getFieldDecorator } = form;
    let title = '项目进度汇报';
    // let url = `/pm-ui/#/pm-ui/pm/PmBaseInfoEdit?id=` + editData.id;

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
