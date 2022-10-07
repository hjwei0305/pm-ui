import React, { PureComponent } from 'react';
import { Form,DatePicker, Input } from 'antd';
import { ExtModal,ComboList } from 'suid';
import moment from 'moment';
import { getCurrentUser } from '@/utils/user';

const now = moment();

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
      if(editData == null){
        // eslint-disable-next-line no-param-reassign
        formData.type = '待办清单'
      }
      const params = {};
      Object.assign(params, editData, formData);
      if (onSave) {
        onSave(params);
      }
    });
  };

  render() {
    const { form, editData, onClose, saving, visible,name } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增待办';


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
        <FormItem>起草阶段</FormItem>
        <FormItem label="提出日期">
            {getFieldDecorator('submit_date', {
              initialValue: now,
            })(<DatePicker/>)}
          </FormItem>
          <FormItem label="起草人">
            {getFieldDecorator('submit_name', {
              initialValue: getCurrentUser().userName,
            })(<Input disabled value={name} />)}
          </FormItem>
          <FormItem label="待办事项">
            {getFieldDecorator('todoList', {
              initialValue: editData && editData.todoList,
              rules: [
                {
                  required: true,
                  message: '待办事项不能为空',
                },
              ],
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="责任人">
            {getFieldDecorator('ondutyName', {
              initialValue: editData && editData.ondutyName,
              rules: [
                {
                  required: true,
                  message: '责任人不能为空',
                },
              ],
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="要求完成日期">
            {getFieldDecorator('completionDate', {
              initialValue: editData && editData.completionDate,
              rules: [
                {
                  required: true,
                  message: '要求完成日期不能为空',
                },
              ],
            })(<DatePicker />)}
          </FormItem>
          <FormItem>确认阶段</FormItem>
          <FormItem label="确认人">
            {getFieldDecorator('confirmedby1', {
              initialValue: editData && editData.confirmedby1,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="建议状态">
            {getFieldDecorator('proposal_status', {
              initialValue: editData && editData.proposal_status,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="完成情况">
            {getFieldDecorator('completion', {
              initialValue: editData && editData.completion,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem>验证阶段</FormItem>
          <FormItem label="确认人">
            {getFieldDecorator('confirmedby2', {
              initialValue: editData && editData.confirmedby2,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="确认时间">
            {getFieldDecorator('confirmation_time', {
              initialValue: editData && editData.confirmation_time,
            })(<DatePicker />)}
          </FormItem>
          <FormItem label="结案状态">
            {getFieldDecorator('closing_status', {
              initialValue: editData && editData.closing_status,
            })(<ComboList disabled={!!editData || saving} />)}
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
