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
          <FormItem label="工号">
            {getFieldDecorator('code', {
              initialValue: editData && editData.code,
              rules: [
                {
                  required: true,
                  message: '工号不能为空',
                },
                {
                  max: 20,
                  message: '代码不能超过10个字符',
                },
              ],
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="姓名">
            {getFieldDecorator('name', {
              initialValue: editData && editData.name,
              rules: [
                {
                  required: true,
                  message: '姓名不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="项目编码">
            {getFieldDecorator('projectCode', {
              initialValue: editData && editData.projectCode,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="所在小组">
            {getFieldDecorator('organizeId', {
              initialValue: editData && editData.organizeId,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="项目组身份">
            {getFieldDecorator('projectRole', {
              initialValue: editData && editData.projectRole,
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
