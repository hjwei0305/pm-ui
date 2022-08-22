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
  handleSync = () => {
    const { form, onSync } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, formData);
      if (onSync) {
        onSync(params.newProjCode);
      }
    });
  };

  render() {
    const { form, onClose, sync, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = '新增';

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={sync}
        maskClosable={false}
        title={title}
        onOk={this.handleSync}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="项目编码">
            {getFieldDecorator('newProjCode', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '项目编码不能为空',
                },
              ],
            })(<Input disabled={sync} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
