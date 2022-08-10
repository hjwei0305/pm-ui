import React, { PureComponent } from 'react';
import { Form, DatePicker,Input } from 'antd';
import { ExtModal } from 'suid';

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
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';

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
              rules: [
                {
                  required: true,
                  message: '项目编码不能为空',
                },
                {
                  max: 80,
                  message: '项目编码不能超过40个字符',
                },
              ],
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="项目名称">
            {getFieldDecorator('projectName', {
              initialValue: editData && editData.projectName,
              rules: [
                {
                  required: true,
                  message: '项目名称不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="代办事项">
            {getFieldDecorator('todoList', {
              initialValue: editData && editData.todoList,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="责任人工号">
            {getFieldDecorator('ondutyCode', {
              initialValue: editData && editData.ondutyCode,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="责任人姓名">
            {getFieldDecorator('ondutyName', {
              initialValue: editData && editData.ondutyName,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="提出人工号">
            {getFieldDecorator('submitCode', {
              initialValue: editData && editData.submitCode,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="提出人姓名">
            {getFieldDecorator('submitName', {
              initialValue: editData && editData.submitName,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="提出时间">
            {getFieldDecorator('submitDate', {
              initialValue: editData && editData.submitDate,
            })(<DatePicker />)}
          </FormItem>
          <FormItem label="结案时间">
            {getFieldDecorator('endDate', {
              initialValue: editData && editData.endDate,
            })(<DatePicker />)}
          </FormItem>
          <FormItem label="是否完成">
            {getFieldDecorator('isCompleted', {
              initialValue: editData && editData.isCompleted,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="是否结案">
            {getFieldDecorator('isFinished', {
              initialValue: editData && editData.isFinished,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remark', {
              initialValue: editData && editData.remark,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>

        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
