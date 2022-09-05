import React, { PureComponent } from 'react';
import { Form, message } from 'antd';
import { ExtModal, Attachment } from 'suid';
import { constants } from '@/utils';
import { get } from 'lodash';

const { SERVER_PATH } = constants;
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
  state = {
    projTypeList: [
      {
        name: 'KPI项目',
        code: 6,
      },
      {
        name: '年度重点项目',
        code: 1,
      },{
        name: '其他项目',
        code: 2,
      },
    ],
  }


  handleSave = () => {
    const { form, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      this.SaveUpload(params);
    });
  };

  SaveUpload = (flowCallBack = this.defaultCallBack) => {
    console.log(this.props)
    const { dispatch,editData, fileType } = this.props;
    const dataReplace = Object.assign({},editData)
    // const { isValid,data } = this.requestHeadRef.getHeaderData();
    // if (isValid) {
      const docIdList = [];
      if (this.attachmentRef) {
        console.log(this.attachmentRef)
        const status = this.attachmentRef.getAttachmentStatus();
        const { fileList, ready } = status;
        if (!ready) {
          flowCallBack({
            success: false,
            message: '附件正在上传中，请等待上传完成后操作，否则会导致附件丢失',
          });
          return;
        }
        if (fileList && fileList.length > 0) {
          fileList.forEach(item => {
            if (item.id && !docIdList.includes(item.id)) {
              docIdList.push(item.id);
            }
          });
        }
      }
      Object.assign(dataReplace, { attachmentIdList: docIdList });
      dataReplace.leader = dataReplace.leader.join(',')
      dataReplace.developer = dataReplace.developer.join(',')
      dataReplace.designer = dataReplace.designer.join(',')
      dataReplace.implementer = dataReplace.implementer.join(',')
      dataReplace.proOpt = dataReplace.proOpt.join(',')
      if(typeof(dataReplace.projectTypes) == "string"){
        for(let item of this.state.projTypeList){
          if(item.name == dataReplace.projectTypes){
            dataReplace.projectTypes = item.code
          }
        }
      }
      dataReplace.fileType = fileType;
      dispatch({
        type: 'pmBaseInfoEdit/saveUpload',
        payload: {
          ...dataReplace,
        },
      }).then(res => {
        if(res.success === false){
          message.warning(res.message);
        }
      });
  };

  defaultCallBack = res => {
    if (!res.success) {
      message.warning(res.message);
    }
  };

  render() {
    const { form, editData, onClose, saving, visible, loading = false, attId } = this.props;
    // const title = editData ? '编辑' : '新增';
    const title = '附件上传查看';
    const dataReplace = Object.assign({},editData)
    dataReplace.id = attId

    const attachmentProps = {
      serviceHost: `${SERVER_PATH}/edm-service`,
      multiple: true,
      customBatchDownloadFileName: true,
      onAttachmentRef: ref => (this.attachmentRef = ref),
      entityId: get(dataReplace, 'id'),
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
        onOk={this.handleSave}
      >
        <Attachment {...attachmentProps} />
      </ExtModal>
    );
  }
}

export default FormModal;
