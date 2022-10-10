import React, { PureComponent } from 'react';
import { Form,DatePicker, Input,Row,Col } from 'antd';
import { ExtModal } from 'suid';
import moment from 'moment';
import { getCurrentUser } from '@/utils/user';

const now = moment();

const FormItem = Form.Item;
// const formItemLayout = {
//   labelCol: {
//     span: 6,
//   },
//   wrapperCol: {
//     span: 18,
//   },
// };

@Form.create()
class FormModal extends PureComponent {
  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if(editData == null){
        // eslint-disable-next-line no-param-reassign
        formData.type = '待办清单'
      }
      const params = {};
      Object.assign(params, editData, formData);
      if (onSave) {
        onSave(params);
      }
    });
  };

  render() {
    const { form, editData, onClose, saving, visible,name } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增待办';


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
        <Form>
        <FormItem>起草阶段</FormItem>
         <Row gutter={24}  style={{ margin: "10px 0" }}>
            <Col span={10}>
              <span >提出日期：</span>
              {getFieldDecorator('submitDate', {initialValue: now,})(<DatePicker/>)}
            </Col>
            <Col span={10}>
              <span >起草人：</span>
              {getFieldDecorator('submitName', {initialValue: getCurrentUser().userName,})(<Input disabled value={name} />)}
            </Col>
        </Row>
        <Row gutter={24} justify="space-around" style={{ margin: "10px 0" }}>
          <Col span={10}>
          <span>要求完成日期：</span>
          {getFieldDecorator('completionDate', {initialValue: editData && editData.completionDate,
              rules: [
                {
                  required: true,
                  message: '要求完成日期不能为空',
                },
              ],
            })(<DatePicker />)}
          </Col>
          <Col span={10}>
            <span>责任人：</span>
            {getFieldDecorator('ondutyName', {initialValue: editData && editData.ondutyName,
              rules: [
                {
                  required: true,
                  message: '责任人不能为空',
                },
              ],
            })(<Input disabled={!!editData || saving} />)}
          </Col>
        </Row>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col span={24}>
          <span>待办事项：</span>
          {getFieldDecorator('todoList', {
              initialValue: editData && editData.todoList,
              rules: [
                {
                  required: true,
                  message: '待办事项不能为空',
                },
              ],
            })(<Input disabled={!!editData || saving} />)}
          </Col>
        </Row>
       <FormItem>确认阶段</FormItem>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col span={10}>
            <span>确认人:</span>
            {getFieldDecorator('confirmedby1', {initialValue: editData && editData.confirmedby1, })(<Input disabled={!!editData || saving} />)}
          </Col>
          <Col span={10}>
            <span>建议状态:</span>
            {getFieldDecorator('proposalStatus', {initialValue: editData && editData.proposalStatus, })(<Input placeholder='请输入结案/不结案' disabled={!!editData || saving} />)}
          </Col>
        </Row>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col>
            <span>完成情况</span>
            {getFieldDecorator('completion', { initialValue: editData && editData.completion,})(<Input disabled={!!editData || saving} />)}
          </Col>
        </Row>
      <FormItem>验证阶段</FormItem>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col span={10}>
            <span>确认人:</span>
            {getFieldDecorator('confirmedby2', {initialValue: editData && editData.confirmedby2,})(<Input disabled={!!editData || saving} />)}
          </Col>
          <Col span={10}>
            <span>确认时间</span>
            {getFieldDecorator('confirmationTime', {initialValue: editData && editData.confirmationTime,})(<DatePicker />)}
          </Col>
        </Row>
        <Row gutter={24}  style={{ margin: "10px 0" }}>
          <Col>
            <span>结案状态:</span>
            {getFieldDecorator('closingStatus', {initialValue: editData && editData.closingStatus,})(<Input placeholder='请输入合格/不合格' disabled={!!editData || saving} />)}
          </Col>
        </Row>
        <Row gutter={24} style={{ margin: "10px 0" }}>
          <Col>
            <span>备注:</span>
            {getFieldDecorator('remark', {initialValue: editData && editData.remark,})(<Input disabled={!!editData || saving} />)}
          </Col>
        </Row>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
