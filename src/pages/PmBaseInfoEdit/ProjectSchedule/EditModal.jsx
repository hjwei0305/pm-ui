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
    const { dispatch,editData } = this.props;
    var dataReplace = Object.assign({},editData)
    // const { isValid, data } = this.requestHeadRef.getHeaderData();
    // if (isValid) {
      const docIdList = [];
      if (this.attachmentRef) {
        const status = this.attachmentRef.getAttachmentStatus();
        console.log(status)
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
      dataReplace.fileType = "RequireDoc";
      dispatch({
        type: 'pmBaseInfoEdit/saveUpload',
        payload: {
          ...dataReplace,
        },
      }).then(res => console.log(dataReplace));
    // } 
    // else {
    //   flowCallBack({
    //     success: false,
    //     message: '数据校验未通过，请检查数据',
    //   });
    // }
  };

  defaultCallBack = res => {
    if (!res.success) {
      message.warning(res.message);
    }
  };

  render() {
    const { form, editData, onClose, saving, visible, loading = false } = this.props;
    const { getFieldDecorator } = form;
    // const title = editData ? '编辑' : '新增';
    const title = '附件上传查看';
    // const fileList = [
    //   {
    //     appModule: 'EDM_API',
    //     description: null,
    //     documentType: 1,
    //     documentTypeEnum: 'Image',
    //     documentTypeEnumRemark: '图片',
    //     fileName: 'R1550-3.jpg',
    //     fileSize: '491K',
    //     id: '5e250d4bb1bece000188ebd0',
    //     itemId: 'CB88B221-3B2A-11EA-AF7D-0242C0A84423',
    //     name: 'R1550-3.jpg',
    //     ocrData: null,
    //     size: 503670,
    //     status: 'done',
    //     tenantCode: '10044',
    //     uploadUserAccount: '654321',
    //     uploadUserId: '1592D012-A330-11E7-A967-02420B99179E',
    //     uploadUserName: '系统管理员',
    //     uploadedTime: '2020-01-20 10:15:39',
    //   },
    // ];

    const attachmentProps = {
      serviceHost: `${SERVER_PATH}/edm-service`,
      maxUploadNum: 1,
      onAttachmentRef: ref => (this.attachmentRef = ref),
      entityId: get(editData, 'id'),
      itemFieldExtra: file => {
        console.log(file);
        return <span>自定义渲染</span>;
      },
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
        {/* <Button
          type="primary"
          loading={loading}
          onClick={e => {
            e.stopPropagation();
            onSave();
          }}
        >
          保存
        </Button> */}
        <Attachment {...attachmentProps} />
        {/* <Form {...formItemLayout} layout="horizontal">
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
        </Form> */}
      </ExtModal>
    );
  }
}

export default FormModal;
