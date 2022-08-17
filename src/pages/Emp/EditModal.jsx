import React, { PureComponent } from 'react';
import { Form, Switch, Input } from 'antd';
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
        okText='保存'
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="单位名称">
            <Input disabled value={editData.extorgname}/>
          </FormItem>
          <FormItem label="部门名称">
            <Input disabled value={editData.name}/>
          </FormItem>
          <FormItem label="小组名称">
            {getFieldDecorator('groupName', {
              initialValue: editData && editData.groupName,
            })
            (<Input/>)}
          </FormItem>
          <FormItem label="组长">
            {getFieldDecorator('manager', {
              initialValue: editData && editData.manager,
            })
            (<Input/>)}
          </FormItem>
          <FormItem label="小组成员数量">
            {getFieldDecorator('memberCount', {
              initialValue: editData && editData.memberCount,
            })
            (<Input/>)}
          </FormItem>
          <FormItem label="是否冻结">
            {getFieldDecorator('frozen', {
              initialValue: editData && editData.frozen,
              valuePropName: 'checked',
            })(<Switch/>)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
