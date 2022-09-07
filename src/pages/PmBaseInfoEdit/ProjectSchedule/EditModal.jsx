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

  SaveUpload = () => {
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
          message.warning('附件正在上传中，请等待上传完成后操作，否则会导致附件丢失');
          return;
        }
        if (fileList && fileList.length > 0) {
          if(fileList.length > 1){
            message.warning('该节点只允许上传一个附件，请删除原附件后上传');
            return;
          }
          fileList.forEach(item => {
            if (item.id && !docIdList.includes(item.id)) {
              docIdList.push(item.id);
              switch(fileType){
                // 维护附件查找Id
                case 'RequireDoc': this.props.editData.requireDocId = item.id
                  break;
                case 'AcceptStandardDoc': this.props.editData.acceptStandardDocId = item.id
                  break;
                case 'StartReportDoc': this.props.editData.acceptStandardDocId = item.id
                  break;
                case 'UserRequireDoc': this.props.editData.userRequireDocId = item.id
                  break;
                case 'DesignerDoc': this.props.editData.designerDocId = item.id
                  break;
                case 'CropDoc': this.props.editData.cropDocId = item.id
                  break;
                case 'TestExampleDoc': this.props.editData.testExampleDocId = item.id
                  break;
                case 'TestReportDoc': this.props.editData.testReportDocId = item.id
                  break;
                case 'SopDoc': this.props.editData.sopDocId = item.id
                  break;
                case 'QuestionListDoc': this.props.editData.questionListDocId = item.id
                  break;
                case 'CheckListDoc': this.props.editData.checkListDocId = item.id
                  break;
                case 'CaseCloseReportDoc': this.props.editData.caseCloseReportDocId = item.id
                  break;
                case 'SatisfactionSurveyDoc': this.props.editData.satisfactionSurveyDocId = item.id
                  break;
                case 'PageCheckDoc': this.props.editData.pageCheckDocId = item.id
                  break;
              }
            }
          });
        }else if(fileList.length === 0){
          // 维护附件查找Id
          switch(fileType){
            case 'RequireDoc': this.props.editData.requireDocId = ''
              break;
            case 'AcceptStandardDoc': this.props.editData.acceptStandardDocId = ''
              break;
            case 'StartReportDoc': this.props.editData.acceptStandardDocId = ''
              break;
            case 'UserRequireDoc': this.props.editData.userRequireDocId = ''
              break;
            case 'DesignerDoc': this.props.editData.designerDocId = ''
              break;
            case 'CropDoc': this.props.editData.cropDocId = ''
              break;
            case 'TestExampleDoc': this.props.editData.testExampleDocId = ''
              break;
            case 'TestReportDoc': this.props.editData.testReportDocId = ''
              break;
            case 'SopDoc': this.props.editData.sopDocId = ''
              break;
            case 'QuestionListDoc': this.props.editData.questionListDocId = ''
              break;
            case 'CheckListDoc': this.props.editData.checkListDocId = ''
              break;
            case 'CaseCloseReportDoc': this.props.editData.caseCloseReportDocId = ''
              break;
            case 'SatisfactionSurveyDoc': this.props.editData.satisfactionSurveyDocId = ''
              break;
            case 'PageCheckDoc': this.props.editData.pageCheckDocId = ''
              break;
          }
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
      maxUploadNum: 1,
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
        okText="保存"
      >
        <Attachment {...attachmentProps} />
      </ExtModal>
    );
  }
}

export default FormModal;
