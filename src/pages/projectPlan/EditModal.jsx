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
                  max: 10,
                  message: '项目编码不能超过5个字符',
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
          <FormItem label="计划类型">
            {getFieldDecorator('schedureType', {
              initialValue: editData && editData.schedureType,
              rules: [
                {
                  required: true,
                  message: '计划类型不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="计划开始日期">
            {getFieldDecorator('planStartDate', {
              initialValue: editData && editData.planStartDate,
            })(<DatePicker />)}
          </FormItem>
          <FormItem label="计划结束日期">
            {getFieldDecorator('planEndDate', {
              initialValue: editData && editData.planEndDate,
            })(<DatePicker />)}
          </FormItem>
          <FormItem label="实际开始日期">
            {getFieldDecorator('actualStartDate', {
              initialValue: editData && editData.actualStartDate,
            })(<DatePicker />)}
          </FormItem>
          <FormItem label="实际结束日期">
            {getFieldDecorator('actualEndDate', {
              initialValue: editData && editData.actualEndDate,
            })(<DatePicker />)}
          </FormItem>
          <FormItem label="天数">
            {getFieldDecorator('schedureDays', {
              initialValue: editData && editData.schedureDays,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="序号">
            {getFieldDecorator('schedureNo', {
              initialValue: editData && editData.schedureNo,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="状态">
            {getFieldDecorator('schedureStatus', {
              initialValue: editData && editData.schedureStatus,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="任务类型">
            {getFieldDecorator('workType', {
              initialValue: editData && editData.workType,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="任务列表">
            {getFieldDecorator('workTodoList', {
              initialValue: editData && editData.workTodoList,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="协助人">
            {getFieldDecorator('workAssist', {
              initialValue: editData && editData.workAssist,
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
