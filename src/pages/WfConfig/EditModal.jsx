import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
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
          <FormItem label="代码">
            {getFieldDecorator('code', {
              initialValue: editData && editData.code,
              rules: [
                {
                  required: true,
                  message: '代码不能为空',
                },
                {
                  max: 10,
                  message: '代码不能超过5个字符',
                },
              ],
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="名称">
            {getFieldDecorator('name', {
              initialValue: editData && editData.name,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="流程顺序">
            {getFieldDecorator('wfNo', {
              initialValue: editData && editData.wfNo,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="流程名称流程名称">
            {getFieldDecorator('wfName', {
              initialValue: editData && editData.wfName,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="节点顺序">
            {getFieldDecorator('nodeNo', {
              initialValue: editData && editData.nodeNo,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="节点名称">
            {getFieldDecorator('nodeName', {
              initialValue: editData && editData.nodeName,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="有无附件">
            {getFieldDecorator('nodeAttachement', {
              initialValue: editData && editData.nodeAttachement,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="附件名称">
            {getFieldDecorator('nodeAttachementName', {
              initialValue: editData && editData.nodeAttachementName,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="节点启用">
            {getFieldDecorator('isFrozen', {
              initialValue: editData && editData.isFrozen,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
