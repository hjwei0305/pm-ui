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
    const { form, onClose, sync, visible, editData, disable } = this.props;
    const { getFieldDecorator } = form;
    let title = editData.name;
    let url = `https://seiprod.donlim.com/#/pm-ui/pm/PmBaseInfoEdit?disable=` + disable+ "&id=" + editData.id;

    return (
      <ExtModal
        fullScreen={true}
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={sync}
        maskClosable={false}
        title={
          [<div style={{fontSize:'20px'}}>{title}</div>]
        }
        onOk={this.handleSync}
        footer={null}
      >
        <iframe
            editData
            title="doc-view"
            scrolling="auto"
            height="100%"
            width="100%"
            src={url}
            frameBorder="0"
        />
      </ExtModal>
    );
  }
}

export default FormModal;
