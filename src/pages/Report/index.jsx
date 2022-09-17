import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ExtTable, ExtIcon} from 'suid';
import EditModal from './EditModal';
import { constants } from '@/utils';

const { PROJECT_PATH } = constants;
@withRouter
@connect(({ report, loading }) => ({ report, loading }))
class Report extends Component {

  static obj = [];

  constructor(props){
    super(props)
    this.state = {};
  }

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

  handleSave = data => {
    this.dispatchAction({
      type: 'report/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'report/updateState',
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
      type: 'report/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['report/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
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
        title: '总项目数',
        dataIndex: 'projectTotalNum',
        width: 120,
        required: true,
      },
      {
        title: '重点项目数',
        dataIndex: 'projectFocusNum',
        width: 120,
        required: true,
      },
      {
        title: '待办数',
        dataIndex: 'toDoNum',
        width: 120,
        required: true,
      },
      {
        title: '项目名称集合',
        dataIndex: 'projectNames',
        width: 1000,
        required: true,
      },
    ];

    return {
      columns,
      bordered: false,
      pagination:false,
      searchProperties: ['employeeName'],
      searchPlaceHolder: '请输入姓名查询',
      store:{
        type: 'POST',
        url:`${PROJECT_PATH}/report/findPersonnelProjectStatistics`,
        loaded: () => {
          this.tableRef.manualSelectedRows();
        },
      },
      rowKey: 'employeeCode',
    };
  };

  getEditModalProps = () => {
    const { loading, report } = this.props;
    const { modalVisible, editData } = report;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['report/save'],
    };
  };

  render() {
    const { report } = this.props;
    const { modalVisible } = report;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default Report;
