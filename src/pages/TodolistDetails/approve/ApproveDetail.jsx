import React, { PureComponent } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { WorkFlow, utils, AuthUrl, ComboList, Attachment} from 'suid';
import { Form, Row, Col, Input, DatePicker, message, Button, Select } from 'antd';
import moment from 'moment';
import { constants } from '@/utils';
import { getCurrentUser } from '@/utils/user';
import TextArea from 'antd/lib/input/TextArea';

const { SERVER_PATH } = constants;
const now = moment();
const { Approve } = WorkFlow;
const { eventBus } = utils;
const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@withRouter
@Form.create()
@connect(({ todolistDetails, loading }) => ({ todolistDetails, loading }))
class ApproveDetail extends PureComponent {
  constructor(props){
    super(props)
    const { form,dispatch } = props;
    const { location } = this.props;
    const { id } = location.query;
    this.currentStatus = false;
    this.editData = {};
    this.employee = [];
    this.compeleteList = [
      {
        code: 0,
        name: '结案',
      },
      {
        code: 1,
        name: '未结案',
      }
    ];
    this.okList = [
      {
        code: 0,
        name: '合格',
      },
      {
        code: 1,
        name: '不合格',
      }
    ]
    // 人员名单
    dispatch({
      type: 'todolistDetails/findEmp',
      payload: {
        filters: [
    
        ],
      },
    }).then(res => {
      const { data } = res;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < data.length; i++) {
        this.employee.push(
        <Option 
          key={data[i].employeeName} 
          orgname={data[i].orgname.substr(data[i].orgname.lastIndexOf('-') + 1)}
        >
          {data[i].employeeName}
        </Option>);
      }
    });
  };

  findInfo = () => {
    const { dispatch, location } = this.props;
    const { id } = location.query;
    dispatch({
      type: 'todolistDetails/findOne',
      payload:{
        id: id
      }
    }).then(res => {
      const { data } = res;
      this.editData = data;
      this.confirm = data && data.flowStatus == 'INPROCESS' && data.confirm1Status == 'true' ? true : false;
      // form.setFieldsValue(this.editData);
      this.forceUpdate();
    })
  };

  /** 提交执行完成后的回调函数 */
  submitComplete = res => {
    if (res.success) {
      const { location } = this.props;
      const { taskId } = location.query;
      eventBus.emit('closeTab', [taskId]);
    }
  };

  beforeSubmit = (params) => {
    if(params.actionType === 'turn' || params.actionType === 'end' || params.approved === false){
      return new Promise(resolve => {
        this.handleTurnSave(resolve)
        // resolve({success: true, message: '处理中,请稍后再试' });
      });
    }else{
      return new Promise(resolve => {
        this.handleSave(resolve,params)
      });
    }
  };

  handleTurnSave = (flowCallBack = this.defaultCallBack) => {
    const { dispatch, form } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, this.editData, formData);
      params.submitDate = formData.submitDate.format('YYYY-MM-DD')
      params.completionDate = formData.completionDate.format('YYYY-MM-DD')
      params.confir1Time = formData.confir1Time != null ? formData.confir1Time.format('YYYY-MM-DD') : null
      const result = {
        message:'',
      };
      params.confirmedby2 = getCurrentUser().userName
      params.confirmationTime = moment().format('YYYY-MM-DD')
      dispatch({
          type: 'todolistDetails/save',
          payload: params,
      }).then(res => {
        flowCallBack(res);
      });
    })
  };

  handleSave = (flowCallBack = this.defaultCallBack, opinion) => {
    const { dispatch, form } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, this.editData, formData);
      params.submitDate = formData.submitDate.format('YYYY-MM-DD')
      params.completionDate = formData.completionDate.format('YYYY-MM-DD')
      params.confir1Time = formData.confir1Time != null ? formData.confir1Time.format('YYYY-MM-DD') : null
      const result = {
        message:'',
      };
      // 保存
      if(this.currentStatus === true){
        return message.warning('单据审核后不能修改！');
      }
      if(opinion === 'save'){
        if(params.confirm1Status == 'true'){
          return message.warning('验证阶段不能修改确认阶段内容！');
        }
        if(params.newestProgress == '' || params.newestProgress == null){
          return message.warning('请输入最新进度说明');
        }
        params.confir1Time = moment().format('YYYY-MM-DD')
      }else{
        // 审批
        if(params.confirm1Status != 'true' && params.proposalStatus != '结案'){
          result.message = '状态为未结案单据不能提交';
          return flowCallBack(result);
        }else if(params.confirm1Status != 'true' && (formData.proposalStatus == undefined
          || formData.proposalStatus == null || formData.completion == undefined || formData.completion == ''
          || params.isUpload != 1 || params.newestProgress == '' || params.newestProgress == null)){
          result.message = '请输入建议状态、当前完成比率、最新进度说明及上传附件';
          return flowCallBack(result);
        } else if(params.confirm1Status == 'true' &&
          (formData.closingStatus == undefined || formData.closingStatus == null
              || formData.remark == undefined || formData.remark == null || formData.remark == '')){
            result.message = '请输入结案状态及备注';
          return flowCallBack(result);
        }else if(params.confirm1Status == 'true' && params.closingStatus == '不合格'){
          result.message = '结案状态为不合格，不能结束单据';
        }
        if(opinion.actionType === 'default'){
          params.confir1Time = moment().format('YYYY-MM-DD')
        }
        if(opinion.approved === true || opinion.approved === false){
          params.confirmedby2 = getCurrentUser().userName
          params.confirmationTime = moment().format('YYYY-MM-DD')
        }
      }
      dispatch({
          type: 'todolistDetails/save',
          payload: params,
      }).then(res => {
        if(opinion != 'save' && res.success){
          this.currentStatus = true
        }
        if(opinion != 'save'){
          flowCallBack(res);
        }
      });
    })
  };

  defaultCallBack = res => {
    if (!res.success) {
      message.warning(res.message);
    }
  };

  // handleClose = () => {
  //   this.dispatchAction({
  //     type: 'todolistDetails/updateState',
  //     payload: {
  //       modalVisible: false,
  //       editData: null,
  //     },
  //   });
  // };

  // getEditModalProps = () => {
  //   const { loading, todolistDetails } = this.props;
  //   const { editData } = todolistDetails;

  //   return {
  //     onSave: this.handleSave,
  //     editData,
  //     visible: true,
  //     onClose: this.handleClose,
  //     saving: loading.effects['todolistDetails/save'],
  //   };
  // };
  handlerGetFile = (files) => {
    const { id } = this.props.location.query;
    const { dispatch } = this.props;
    const docIdList = [];
    if (this.attachmentRef) {
      const status = this.attachmentRef.getAttachmentStatus();
      const { fileList, ready } = status;
      if (!ready) {
        // message.warning('附件正在上传中，请等待上传完成后操作，否则会导致附件丢失');
        return;
      }
      if (fileList && fileList.length > 0) {
        fileList.forEach(item => {
          if (item.id && !docIdList.includes(item.id)) {
            docIdList.push(item.id);
          }
        });
      }
      // // 维护state
      // this.maintainDocIdState(docIdList)
      dispatch({
        type: 'todolistDetails/bindFile',
        payload: {
          id: id,
          attachmentIdList: docIdList,
        },
      }).then(res => {
        if(res.success === false){
          message.warning(res.message);
        }else{
          // 上传成功，维护isUpload
          if(fileList && fileList.length > 0){
            this.editData.isUpload = 1;
          }else{
            this.editData.isUpload = 0;
          }
        }
      });
    };
  }

  renderAssistOptions = () => {
    const { editData } = this.props;
    const { employee } = this;
    const isDisabled = editData && (editData.flowStatus !== 'INIT') && (editData.flowStatus != null) ;
    return <Select onChange={(value,option) => this.changeAssistSelect(value,option)} style={{width: "120"}} allowClear showSearch disabled={isDisabled}>{employee}</Select>
  }

  changeAssistSelect = (value,option) => {
    const { form } = this.props
    if(value && option){
      if(value === '石风婷'){
        form.setFieldsValue({ assistOrgname: '运营策略科' })
      }else{
        form.setFieldsValue({ assistOrgname: option.props.orgname })
      }
    }else{
      form.setFieldsValue({ assistOrgname: null })
    }
  }

  render() {
    const { form, editData } = this.props;
    const { getFieldDecorator } = form;
    const { location } = this.props;
    const { id, taskId, instanceId } = location.query;
    const attachmentProps = {
      serviceHost: `${SERVER_PATH}/edm-service`,
      multiple: true,
      customBatchDownloadFileName: true,
      onAttachmentRef: ref => (this.attachmentRef = ref),
      entityId: id,
      // onDeleteFile: this.handlerGetFile,
      onChange: this.handlerGetFile,
      allowUpload: true,
      style: {height: "250px",marginLeft:"20px"},
    };
    const approveProps = {
      businessId: id,
      taskId,
      instanceId,
      beforeSubmit: (params) => this.beforeSubmit(params),
      submitComplete: this.submitComplete,
      onApproveRef: this.findInfo,
    };
    const comboListProps = {
      style: { width: '200px' },
      placeholder: '请选择结案/未结案',
      form,
      name: 'name',
      field: ['name'],
      dataSource: this.compeleteList,
      searchProperties: ['name'],
      allowClear: true,
      showSearch: false,
      afterClear: () => form.setFieldsValue({ proposalStatus: null }),
      afterSelect: item =>
        form.setFieldsValue({
          proposalStatus: item.name,
        }),
      reader: {
        name: 'name',
        field: ['name'],
      },
    };

    const completeProps = {
      style: { width: '200px' },
      placeholder: '请选择合格/不合格',
      form,
      name: 'name',
      field: ['name'],
      dataSource: this.okList,
      searchProperties: ['name'],
      allowClear: true,
      showSearch: false,
      afterClear: () => form.setFieldsValue({ closingStatus: null }),
      afterSelect: item =>
        form.setFieldsValue({
          closingStatus: item.name,
        }),
      reader: {
        name: 'name',
        field: ['name'],
      },
    };

    return (
      <AuthUrl>
        <Approve {...approveProps}>
          <Form
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
          >
            <Row gutter={24}>
              <Col>
                <div style={{margin:"30px",fontSize:"18px",fontWeight:"bold",float:"left"}}>起草阶段</div>
              </Col>
            </Row>
            <Row gutter={24}>
                <Col span={10}>
                  <FormItem label="提出日期">
                    {getFieldDecorator('submitDate', {initialValue: this.editData ? this.editData.submitDate && moment.utc(this.editData.submitDate) : now,})
                    (<DatePicker disabled/>)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem label="起草人">
                    {getFieldDecorator('submitName', {initialValue: this.editData && this.editData.submitName,})
                    (<Input disabled />)}
                  </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="提出人">
                  {getFieldDecorator('advisor', {
                    initialValue: this.editData && this.editData.advisor,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="要求完成日期">
                  {getFieldDecorator('completionDate', {initialValue: this.editData && this.editData.completionDate && moment.utc(this.editData.completionDate),
                  })(<DatePicker disabled/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="责任人">
                  {getFieldDecorator('ondutyName', {initialValue: this.editData && this.editData.ondutyName,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="科室">
                  {getFieldDecorator('orgname', {initialValue: this.editData && this.editData.orgname,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="协助人">
                  {getFieldDecorator('assistName', {initialValue: this.editData && this.editData.assistName,
                  })(this.renderAssistOptions())}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="协助人科室">
                  {getFieldDecorator('assistOrgname', {initialValue: this.editData && this.editData.assistOrgname,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={20}>
                <FormItem label="待办事项" 
                  labelCol={{span: 4}}
                  wrapperCol={{span: 20}}>
                  {getFieldDecorator('todoList', {
                    initialValue: this.editData && this.editData.todoList,
                  })(<TextArea disabled />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col>
                <div style={{margin:"30px",fontSize:"18px",fontWeight:"bold",float:"left"}}>确认阶段</div>
                <Button key="save" onClick={() => this.handleSave('','save')} type="primary" style={{float:"right",margin:"20px 100px"}}>
                    保存
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              {/* <Col span={10}>
                <FormItem label="确认人">
                  {getFieldDecorator('confirmedby1', {initialValue: this.editData && this.editData.confirmedby1, })(<Input disabled />)}
                </FormItem>
              </Col> */}
              <Col span={10}>
                <FormItem label="建议状态">
                  {getFieldDecorator('proposalStatus', {initialValue: this.editData && this.editData.proposalStatus, })
                  // (<Input placeholder='请输入结案/不结案' disabled={confirm} />)
                  (<ComboList {...comboListProps} disabled={this.confirm}/>)
                  }
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="当前完成比率(%)">
                  {getFieldDecorator('completion', { initialValue: this.editData && this.editData.completion,})
                  (<Input 
                      type="number" 
                      min={0} 
                      max={100} 
                      disabled={this.confirm} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="最新进度说明">
                  {getFieldDecorator('newestProgress', {initialValue: this.editData && this.editData.newestProgress})
                  (<TextArea disabled={this.confirm}/>)
                  }
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="确认时间">
                  {getFieldDecorator('confir1Time', {initialValue: this.editData && this.editData.confir1Time && moment.utc(this.editData.confir1Time) })
                  (<DatePicker disabled/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Attachment {...attachmentProps} />
            </Row>
            <div style={{margin:"30px",fontSize:"18px",fontWeight:"bold"}}>验证阶段</div>
            <Row gutter={24}>
              {/* <Col span={10}>
                <FormItem label="确认人">
                  {getFieldDecorator('confirmedby2', {initialValue: this.editData && this.editData.confirmedby2,})(<Input disabled={!confirm} />)}
                </FormItem>
              </Col> */}
              {/* <Col span={10}>
                <FormItem label="确认时间">
                  {getFieldDecorator('confirmationTime', {initialValue: this.editData && this.editData.confirmationTime && moment.utc(this.editData.confirmationTime),})
                  (<DatePicker disabled={!confirm}/>)}
                </FormItem>
              </Col> */}
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="结案状态">
                  {getFieldDecorator('closingStatus', {initialValue: this.editData && this.editData.closingStatus,})
                  // (<Input placeholder='请输入合格/不合格' disabled={!this.confirm} />)
                  (<ComboList {...completeProps} disabled={!this.confirm}/>)
                  }
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="备注">
                  {getFieldDecorator('remark', {initialValue: this.editData && this.editData.remark,})(<Input disabled={!this.confirm} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Approve>
      </AuthUrl>
    );
  }
}

export default ApproveDetail;
