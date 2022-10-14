import React, { PureComponent } from 'react';
import { Form,DatePicker, Input, Button, Row, Col,Select,message } from 'antd';
import { ExtModal } from 'suid';
import moment from 'moment';
import StartFlow from 'suid/es/work-flow/StartFlow';
import { getCurrentUser } from '@/utils/user';



const now = moment();

@Form.create()
class FormModal extends PureComponent {
  state = {
    // eslint-disable-next-line react/no-unused-state
    isDisabled: true
  }

  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      formData.organizationId = '00459FE3-1C44-11ED-B27F-005056C00001'
      formData.organizationCode = '00000293'
      formData.organizationName = '新宝股份-营运管理中心-信息化管理中心'
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
      Object.assign(params, editData, formData);
      if (onSave) {
        onSave(params);
        this.forceUpdate()
      }
    });
  };

    // 返回待办列表页面
    BackBill = () => {
      this.props.history.push({
        pathname: '/pm/TodolistDetails',
      });
    };

    renderOptions = () => {
      const { employee, editData } = this.props;
      const isDisabled = editData && (editData.flowStatus !== 'INIT') && (editData.flowStatus != null) ;
      return <Select style={{width: 120}} allowClear showSearch disabled={isDisabled}>{employee}</Select>
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
      beforeStart: () =>  this.handleSave(editData),
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
        footer={[
          // <Button key="back" onClick={onClose} hidden={isDisabled}>
          //   关闭
          // </Button>,
         
      ]}
      >
    <Form>
        <div>
          <span style={{fontWeight:'bold',fontSize:"16px"}}>起草阶段</span>
        </div>
         <Row gutter={24}  style={{ margin: "10px 0" }}>
            <Col span={10}>
              <span >提出日期：</span>
              {getFieldDecorator('submitDate', {initialValue: editData ? editData.submitDate && moment.utc(editData.submitDate) : now,})
              (<DatePicker disabled={isDisabled || saving}/>)}
            </Col>
            <Col span={10}>
              <span >起草人：</span>
              {getFieldDecorator('submitName', {initialValue: editData && title == '查看待办' ? editData.submitName : getCurrentUser().userName ,})(<Input disabled/>)}
            </Col>
        </Row>
        <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
          <Col span={10}>
          <span>要求完成日期：</span>
          {getFieldDecorator('completionDate',
            {initialValue: editData && editData.completionDate && moment.utc(editData.completionDate),
            })(<DatePicker disabled={isDisabled || saving} />)}
          </Col>
          <Col span={10}>
            <span>责任人：</span>
            {getFieldDecorator('ondutyName', {
              initialValue: editData && editData.ondutyName,
            })(this.renderOptions())}
          </Col>
        </Row>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col span={24}>
          <span>待办事项：</span>
          {getFieldDecorator('todoList', {
              initialValue: editData && editData.todoList,
            })(<Input  disabled={isDisabled || saving} />)}
          </Col>
        </Row>
        <Row>
          <Button key="save" onClick={this.handleSave}  hidden={isDisabled}>
            保存
          </Button>
          {(editData && <StartFlow {...startFlowProps}>
            {sLoading => (
              <Button type="primary" disabled={sLoading} loading={sLoading} style={{marginLeft:"5px"}}  hidden={isDisabled}>
                提交审批
              </Button>
            )}
          </StartFlow>
          )}
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
