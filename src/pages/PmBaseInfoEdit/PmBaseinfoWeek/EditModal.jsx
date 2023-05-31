import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, message } from 'antd';
import { ExtModal, Attachment, ProLayout, ScrollBar} from 'suid';
import { constants } from '@/utils';

const { Content } = ProLayout
const { TextArea } = Input
const { SERVER_PATH } = constants;
// import Content from 'suid/lib/pro-layout/Content';
// import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;

@Form.create()
class FormModal extends PureComponent {
  handleSave = () => {
    const { form, onSave, weekData, id } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, weekData, formData);
      // 新建，没有row数据过来
      if(!weekData){
        params.baseinfoId = id
      }else{
        // 编辑，获取上次修改时间
        params.lastModifiedTime = weekData.lastEditedDate
      }
      const docIdList = [];
      if (this.attachmentRef) {
        const status = this.attachmentRef.getAttachmentStatus();
        const { fileList, ready } = status;
        if (!ready) {
          // message.warning('附件正在上传中，请等待上传完成后操作，否则会导致附件丢失');
          return;
        }
        if (fileList && fileList.length > 0) {
          fileList.forEach(item => {
            if (item.id && !docIdList.includes(item.id)) {
              docIdList.push(item.id);
            }
          });
        }else{
          // 没有附件 不允许保存
          message.warning('附件不能为空');
          return;
        }
      }
      params.attachmentIdList = docIdList
      if (onSave) {
        onSave(params);
      }
    });
  };

  handlerGetFile = (files) => {
    const { dispatch, weekData } = this.props;
    const docIdList = [];
    if (this.attachmentRef) {
      const status = this.attachmentRef.getAttachmentStatus();
      const { fileList, ready } = status;
      if (!ready) {
        // message.warning('附件正在上传中，请等待上传完成后操作，否则会导致附件丢失');
        return;
      }
      if (fileList && fileList.length > 0) {
        fileList.forEach(item => {
          if (item.id && !docIdList.includes(item.id)) {
            docIdList.push(item.id);
          }
        });
      }
      // 维护state
      // this.maintainDocIdState(docIdList)
      // 需考虑如何获取新建id
      const trueId = weekData ? weekData.id : null
      dispatch({
        type: 'pmBaseInfoEdit/saveWeekPlanAttachList',
        payload: {
          id: trueId,
          attachmentIdList: docIdList,
        },
      }).then(res => {
        if(res.success === false){
          message.warning(res.message);
        }
      });
    };
  }

  render() {
    const { form, weekData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = weekData ? '编辑双周计划' : '新增双周计划';

    const attachmentProps = {
      serviceHost: `${SERVER_PATH}/edm-service`,
      multiple: true,
      customBatchDownloadFileName: true,
      onAttachmentRef: ref => (this.attachmentRef = ref),
      entityId: weekData && weekData.id,
      onChange: this.handlerGetFile,
      allowUpload: true,
      style: {height: "300px"},
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
        width = '80%'
        okText='保存'
      >
        <ProLayout>
          <Content>
            <ScrollBar>
              <Form
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
              >
                <Row gutter={24}>
                  <Col span={5} >
                    <FormItem label="周数">
                      {getFieldDecorator('week', {
                        initialValue: weekData && weekData.week,
                      })(<TextArea 
                        value={ weekData ? weekData.week : null }
                        autoSize={{ minRows: 4, maxRows: 8 }} 
                        maxLength={16}
                      ></TextArea>)}
                    </FormItem>
                  </Col>
                  <Col span={7}>
                    <FormItem label="本周计划">
                      {getFieldDecorator('weekPlan', {
                        initialValue: weekData && weekData.weekPlan,
                      })(<TextArea 
                        value={ weekData ? weekData.weekPlan : null }
                        autoSize={{ minRows: 4, maxRows: 8 }} 
                        maxLength={256}
                      ></TextArea>)}
                    </FormItem>
                  </Col>
                  <Col span={7}>
                    <FormItem label="下周计划">
                      {getFieldDecorator('nextWeekPlan', {
                        initialValue: weekData && weekData.nextWeekPlan,
                      })(<TextArea 
                        value={ weekData ? weekData.nextWeekPlan : null }
                        autoSize={{ minRows: 4, maxRows: 8 }} 
                        maxLength={256}
                      ></TextArea>)}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label="当前风险">
                      {getFieldDecorator('workRisk', {
                        initialValue: weekData && weekData.workRisk,
                      })(<TextArea 
                        value={ weekData ? weekData.workRisk : null }
                        autoSize={{ minRows: 4, maxRows: 8 }} 
                        maxLength={256}
                      ></TextArea>)}
                    </FormItem>
                  </Col>
                </Row>
                <div style={{margin:"10px 0",fontSize:"18px",fontWeight:"bold"}}>产出上传</div>
                <Row gutter={24}>
                  <Attachment {...attachmentProps} />
                </Row>
              </Form>
            </ScrollBar>
          </Content>
        </ProLayout>
      </ExtModal>
    );
  }
}

export default FormModal;
