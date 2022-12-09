import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, Switch, Select } from 'antd';
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
    const { form, onSave, editToDoData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if(editToDoData == null){
        formData.type = '待办'
      }
      const params = {};
      Object.assign(params, editToDoData, formData);
      params.submitDate = params.submitDate.format('YYYY-MM-DD');
      params.endDate = params.endDate.format('YYYY-MM-DD');
      if (onSave) {
        onSave(params);
      }
    });
  };

  renderOptions = () => {
    const { employee } = this.props;
    return <Select style={{width: 120}} allowClear showSearch>{employee}</Select>
  } 

  render() {
    const { form, editToDoData, onClose, saving, visible, code, name } = this.props;
    const { getFieldDecorator } = form;
    const title = editToDoData ? '编辑' : '新增';

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
              initialValue: code,
            })(<Input disabled value={code} />)}
          </FormItem>
          <FormItem label="项目名称">
            {getFieldDecorator('projectName', {
              initialValue: name,
            })(<Input disabled value={name}></Input>)}
          </FormItem>
          <FormItem label="待办事项">
            {getFieldDecorator('todoList', {
              initialValue: editToDoData && editToDoData.todoList,
            })(<Input disabled={ saving} />)}
          </FormItem>
          {/* <FormItem label="责任人工号">
            {getFieldDecorator('ondutyCode', {
              initialValue: editToDoData && editToDoData.ondutyCode,
            })(<Input disabled={ saving} />)}
          </FormItem> */}
          <FormItem label="责任人">
            {getFieldDecorator('ondutyName', {
              initialValue: editToDoData && editToDoData.ondutyName,
            })(this.renderOptions())}
          </FormItem>
          {/* <FormItem label="提出人工号">
            {getFieldDecorator('submitCode', {
              initialValue: editToDoData && editToDoData.submitCode,
            })(<Input disabled={ saving} />)}
          </FormItem> */}
          <FormItem label="提出人">
            {getFieldDecorator('submitName', {
              initialValue: editToDoData && editToDoData.submitName,
            })(this.renderOptions())}
          </FormItem>
          <FormItem label="提出时间">
            {getFieldDecorator('submitDate', {
              initialValue: editToDoData && editToDoData.submitDate && moment.utc(editToDoData.submitDate),
            })(<DatePicker format="YYYY-MM-DD" />)}
          </FormItem>
          <FormItem label="结案时间">
            {getFieldDecorator('endDate', {
              initialValue: editToDoData && editToDoData.endDate && moment.utc(editToDoData.endDate),
            })(<DatePicker format="YYYY-MM-DD" />)}
          </FormItem>
          <FormItem label="建议状态">
            {getFieldDecorator('isCompleted', {
              initialValue: editToDoData && editToDoData.isCompleted,
              valuePropName: 'checked',
            })(<Switch/>)}
          </FormItem>
          <FormItem label="结案状态">
            {getFieldDecorator('isFinished', {
              initialValue: editToDoData && editToDoData.isFinished,
              valuePropName: 'checked',
            })(<Switch/>)}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remark', {
              initialValue: editToDoData && editToDoData.remark,
            })(<Input disabled={ saving} />)}
          </FormItem>

        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
