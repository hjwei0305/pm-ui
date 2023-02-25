import React, { PureComponent } from 'react';
import { Form,DatePicker, Input, Button, Row, Col,Select,message } from 'antd';
import { ExtModal } from 'suid';
import moment from 'moment';
import StartFlow from 'suid/es/work-flow/StartFlow';
import { getCurrentUser } from '@/utils/user';
import TextArea from 'antd/lib/input/TextArea';


const FormItem = Form.Item;
const now = moment();

@Form.create()
class FormModal extends PureComponent {
  state = {
    // eslint-disable-next-line react/no-unused-state
    isDisabled: true
  }

  beforeStart = () => {
    return new Promise(resolve => {
      this.handleSubmit(resolve)
    });
    
  };

  handleSubmit = (flowCallBack = this.defaultCallBack) => {
    const { dispatch, form, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      params.submitDate = formData.submitDate.format('YYYY-MM-DD')
      params.completionDate = formData.completionDate.format('YYYY-MM-DD')
      dispatch({
        type: 'todolistDetails/save',
        payload: params,
      }).then(res => {
          if (res.success) {
            let saveData = res.data
            // dispatch({
            //   type: 'todolistDetails/updateState',
            //   payload: {
            //     modalVisible: false,
            //   },
            // });
            dispatch({
              type: 'todolistDetails/getUserInfo',
              payload: {
                code: saveData.ondutyCode,
              }
            }).then(result => {
              if(result.success){
                saveData.confirmedby1 = result.data.id
                dispatch({
                  type: 'todolistDetails/saveUserId',
                  payload: saveData,
                }).then(result1 => {
                  flowCallBack(result1)
                })
              }
            })
          }
        })
      });
  };


  handleSave = (key) => {
    const { form, onSave, onSubmit, editData, dispatch } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      formData.organizationId = 'ECF54567-9025-11ED-8F9A-0242AC120011'
      formData.organizationCode = '00018064'
      formData.organizationName = '新宝股份-营运管理中心-数字化管理中心'
      formData.submitDate = formData.submitDate.format('YYYY-MM-DD')
      if(formData.completionDate != null){
        formData.completionDate = formData.completionDate.format('YYYY-MM-DD')
      }
      if(editData == null){
        // eslint-disable-next-line no-param-reassign
        formData.type = '待办清单'
      }
      const params = {};
      if(formData.completionDate===null){
        return message.error('请选择要求完成日期');
      }
      if(formData.todoList===null){
        return message.error('请输入待办事项');
      }
      if(formData.ondutyName===null){
        return message.error('请选择负责人');
      }
      if(formData.advisor===null){
        return message.error('请选择提出人');
      }
      Object.assign(params, editData, formData);
      if (key === 'save') {
        onSave(params);
        // this.forceUpdate()
      }
    });
  };

  defaultCallBack = res => {
    if (!res.success) {
      message.warning(res.message);
    }
  };

    // 返回待办列表页面
    BackBill = () => {
      this.props.history.push({
        pathname: '/pm/TodolistDetails',
      });
    };

    changeSelect = (value,option) => {
      const { form } = this.props
      if(value && option){
        if(value === '石风婷'){
          form.setFieldsValue({ orgname: '运营策略科' })
        }else{
          form.setFieldsValue({ orgname: option.props.orgname })
        }
      }else{
        form.setFieldsValue({ orgname: null })
      }
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

    renderOptions = () => {
      const { employee, editData } = this.props;
      const isDisabled = editData && (editData.flowStatus !== 'INIT') && (editData.flowStatus != null) ;
      return <Select onChange={(value,option) => this.changeSelect(value,option)} style={{width: "120",fontSize:"17px"}} allowClear showSearch disabled={isDisabled}>{employee}</Select>
    }

    renderAssistOptions = () => {
      const { employee, editData } = this.props;
      const isDisabled = editData && (editData.flowStatus !== 'INIT') && (editData.flowStatus != null) ;
      return <Select onChange={(value,option) => this.changeAssistSelect(value,option)} style={{width: "120",fontSize:"17px"}} allowClear showSearch disabled={isDisabled}>{employee}</Select>
    }

    renderAdvisorOptions = () => {
      const { employee, editData } = this.props;
      const isDisabled = editData && (editData.flowStatus !== 'INIT') && (editData.flowStatus != null) ;
      return <Select style={{width: "120",fontSize:"17px"}} allowClear showSearch disabled={isDisabled}>{employee}</Select>
    }


  render() {
    const { form, editData, onClose, saving, visible,name } = this.props;
    const { getFieldDecorator } = form;
    let title = editData ? '编辑待办' : '新增待办';
    const isDisabled = editData && (editData.flowStatus !== 'INIT') && (editData.flowStatus != null) ;
    if(editData && isDisabled){
      title = '查看待办'
    }
    const startFlowProps = {
      businessKey: editData && editData.id,
      businessModelCode: 'com.donlim.pm.entity.TodoList',
      startComplete: () => this.BackBill,
      needStartConfirm: false,
      beforeStart: () => this.beforeStart(),
    };
    // const dataReplace = Object.assign({},editData)
    // dataReplace.id = attId
    // const attachmentProps = {
    //   serviceHost: `${SERVER_PATH}/edm-service`,
    //   multiple: true,
    //   customBatchDownloadFileName: true,
    //   onAttachmentRef: ref => (this.attachmentRef = ref),
    //   entityId: get(dataReplace, 'id'),
    //   maxUploadNum: 1,
    // };
    

    return (

      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.handleSave}
        okText="保存"
        width={800}
        footer={[
        ]}
      >
    <Form
      labelCol={{span: 10}}
      wrapperCol={{span: 14}} 
    >
        <div>
          <span style={{fontWeight:'bold',fontSize:"20px"}}>起草阶段</span>
        </div>
         <Row gutter={24}  style={{ margin: "10px 0" }}>
            <Col span={10}>
              <FormItem style={{fontSize:'40px'}} label={<span style={{fontSize:"17px"}}>提出日期</span>}>
               
              {getFieldDecorator('submitDate', {initialValue: editData ? editData.submitDate && moment.utc(editData.submitDate) : now,})
              (<DatePicker disabled={isDisabled || saving}/>)}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem style={{fontSize:'40px'}} label={<span style={{fontSize:"17px"}}>起草人</span>}>
                {getFieldDecorator('submitName', {initialValue: editData && title == '查看待办' ? editData.submitName : getCurrentUser().userName ,})
                (<Input style={{fontSize:"17px"}} disabled/>)}
              </FormItem>
            </Col>
        </Row>
        <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
          <Col span={10}>
            <FormItem label={<span style={{fontSize:"17px"}}>提出人</span>}>
            {getFieldDecorator('advisor',
              {initialValue: editData && editData.advisor,
              })(this.renderAdvisorOptions())}
            </FormItem>
          </Col>
          <Col span={10}>
          <FormItem label={<span style={{fontSize:"17px"}}>要求完成日期</span>}>
          {/* <span>要求完成日期：</span> */}
          {getFieldDecorator('completionDate',
            {initialValue: editData && editData.completionDate && moment.utc(editData.completionDate),
            })(<DatePicker disabled={isDisabled || saving} />)}
          </FormItem>
          </Col>
        </Row>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col span={10}>
            <FormItem label={<span style={{fontSize:"17px"}}>责任人</span>}>
              {getFieldDecorator('ondutyName', {
                initialValue: editData && editData.ondutyName,
              })(this.renderOptions())}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label={<span style={{fontSize:"17px"}}>科室名称</span>}>
              {getFieldDecorator('orgname', {
                initialValue: editData && editData.orgname,
              })(<Input style={{fontSize:"17px"}} disabled></Input>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col span={10}>
            <FormItem label={<span style={{fontSize:"17px"}}>协助人</span>}>
              {getFieldDecorator('assistName', {
                initialValue: editData && editData.assistName,
              })(this.renderAssistOptions())}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label={<span style={{fontSize:"17px"}}>协助人科室</span>}>
              {getFieldDecorator('assistOrgname', {
                initialValue: editData && editData.assistOrgname,
              })(<Input style={{fontSize:"17px"}} disabled></Input>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col span={24}>
          <span style={{fontSize:"17px"}}>待办事项：</span>
          {getFieldDecorator('todoList', {
              initialValue: editData && editData.todoList,
            })(<TextArea style={{width:"600px",height:"70px",fontSize:"17px"}} disabled={isDisabled || saving} />)}
          </Col>
        </Row>
        <Row>
          <div style={{float:"right",margin:"10px"}}>
            <Button  key="save" onClick={() => this.handleSave('save')}  hidden={isDisabled}>
              保存
            </Button>
            {(editData && <StartFlow {...startFlowProps}>
              {sLoading => (
                <Button type="primary" disabled={sLoading} loading={sLoading} style={{marginLeft:"5px"}}  hidden={isDisabled}>
                  提交
                </Button>
              )}
            </StartFlow>
            )}
          </div>
        </Row>
       {/* <div>
          <span style={{fontWeight:'bold',fontSize:"16px"}}>确认阶段</span>
        </div>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col span={10}>
            <span>确认人:</span>
            {getFieldDecorator('confirmedby1', {initialValue: editData && editData.confirmedby1, })(<Input disabled={isDisabled || saving} />)}
          </Col>
          <Col span={10}>
            <span>建议状态:</span>
            {getFieldDecorator('proposalStatus', {initialValue: editData && editData.proposalStatus, })(<Input placeholder='请输入结案/不结案' disabled={isDisabled || saving} />)}
          </Col>
        </Row>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col>
            <span>完成情况</span>
            {getFieldDecorator('completion', { initialValue: editData && editData.completion,})(<Input disabled={isDisabled || saving} />)}

          </Col>
        </Row>
        <div>
          <span style={{fontWeight:'bold',fontSize:"16px"}}>验证阶段</span>
        </div>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col span={10}>
            <span>确认人:</span>
            {getFieldDecorator('confirmedby2', {initialValue: editData && editData.confirmedby2,})(<Input disabled={isDisabled || saving} />)}
          </Col>
          <Col span={10}>
            <span>确认时间</span>
            {getFieldDecorator('confirmationTime', {initialValue: editData && editData.confirmationTime && moment.utc(editData.confirmationTime),})
            (<DatePicker disabled={isDisabled || saving}/>)}
          </Col>
        </Row>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col>
            <span>结案状态:</span>
            {getFieldDecorator('closingStatus', {initialValue: editData && editData.closingStatus,})(<Input placeholder='请输入合格/不合格' disabled={isDisabled || saving} />)}
          </Col>
        </Row>
        <Row gutter={24} style={{ margin: "10px 0" }}>
          <Col>
            <span>备注:</span>
            {getFieldDecorator('remark', {initialValue: editData && editData.remark,})(<Input disabled={isDisabled || saving} />)}
          </Col>
        </Row> */}
    </Form>

      </ExtModal>
    );
  }
}

export default FormModal;
