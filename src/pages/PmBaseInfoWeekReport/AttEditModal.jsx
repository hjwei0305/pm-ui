import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { ExtModal, Attachment } from 'suid';
import { constants } from '@/utils';

const { SERVER_PATH } = constants;

@Form.create()
class FormModal extends PureComponent {
  render() {
    const {onClose, saving, visible, loading = false, weekAttId } = this.props;
    const title = '附件查看';

    const attachmentProps = {
      allowUpload: false,
      allowDelete: false,
      serviceHost: `${SERVER_PATH}/edm-service`,
      multiple: true,
      customBatchDownloadFileName: true,
      onAttachmentRef: ref => (this.attachmentRef = ref),
      entityId: weekAttId,
      // maxUploadNum: 1,
      // fileList: fileList,
      // itemFieldExtra: fileList => {
      //   console.log(fileList);
      //   return <span>自定义渲染</span>;
      // },
    };

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        footer={null}
      >
        <Attachment {...attachmentProps} />
      </ExtModal>
    );
  }
}

export default FormModal;
