import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, Switch } from 'antd';
import { ExtModal } from 'suid';
import moment from 'moment';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {
  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      if (onSave) {
        onSave(params);
      }
    });
  };

  render() {
    const { form, onClose, saving, visible, editData } = this.props;
    const { getFieldDecorator } = form;
    const title = '待办事项';
    console.log(editData)

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
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="项目编码">
          {getFieldDecorator('projectCode', {
              initialValue: editData && editData.projectCode,
            })(<Input disabled/>)}
          </FormItem>
          <FormItem label="项目名称">
            {getFieldDecorator('projectName', {
              initialValue: editData && editData.projectName,
            })(<Input disabled/>)}
          </FormItem>
          <FormItem label="待办事项">
            {getFieldDecorator('todoList', {
              initialValue: editData && editData.todoList,
            })(<Input disabled />)}
          </FormItem>
          {/* <FormItem label="责任人工号">
            {getFieldDecorator('ondutyCode', {
              initialValue: editData && editData.ondutyCode,
            })(<Input disabled/>)}
          </FormItem> */}
          <FormItem label="责任人姓名">
            {getFieldDecorator('ondutyName', {
              initialValue: editData && editData.ondutyName,
            })(<Input disabled/>)}
          </FormItem>
          {/* <FormItem label="提出人工号">
            {getFieldDecorator('submitCode', {
              initialValue: editData && editData.submitCode,
            })(<Input disabled/>)}
          </FormItem> */}
          <FormItem label="提出人姓名">
            {getFieldDecorator('submitName', {
              initialValue: editData && editData.submitName,
            })(<Input disabled/>)}
          </FormItem>
          <FormItem label="提出时间">
            {getFieldDecorator('submitDate', {
              initialValue: editData && editData.submitDate && moment.utc(editData.submitDate),
            })(<DatePicker disabled format="YYYY-MM-DD" />)}
          </FormItem>
          <FormItem label="结案时间">
            {getFieldDecorator('endDate', {
              initialValue: editData && editData.endDate && moment.utc(editData.endDate),
            })(<DatePicker format="YYYY-MM-DD" />)}
          </FormItem>
          <FormItem label="是否完成">
            {getFieldDecorator('isCompleted', {
              initialValue: editData && editData.isCompleted,
              valuePropName: 'checked',
            })(<Switch/>)}
          </FormItem>
          <FormItem label="是否结案">
            {getFieldDecorator('isFinished', {
              initialValue: editData && editData.isFinished,
              valuePropName: 'checked',
            })(<Switch/>)}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remark', {
              initialValue: editData && editData.remark,
            })(<Input disabled={saving} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
