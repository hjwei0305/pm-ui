import React, { PureComponent } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { WorkFlow, utils, AuthUrl, ComboList } from 'suid';
import { Form, Row, Col, Input, DatePicker } from 'antd';
import moment from 'moment';
import { getCurrentUser } from '@/utils/user';
import { authAction } from 'suid/lib/utils';
// import { TodoDetail  } from '@/pages/TodolistDetails/TodoDetail'

const now = moment();
const { Approve } = WorkFlow;
const { eventBus } = utils;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@withRouter
@Form.create()
@connect(({ todolistDetails, loading }) => ({ todolistDetails, loading }))
class ApproveDetail extends PureComponent {
  constructor(props){
    super(props)
    const { form,dispatch } = props;
    const { location } = this.props;
    const { id } = location.query;
    this.editData = {};
    console.log("BBBAAA")
  };

  aa = () => {
    const { dispatch, location } = this.props;
    const { id } = location.query;
    console.log("testAAABBB")
    dispatch({
      type: 'todolistDetails/findOne',
      payload:{
        id: id
      }
    }).then(res => {
      const { data } = res;
      this.editData = data;
      // form.setFieldsValue(this.editData);
      this.forceUpdate();
    })
  };

  /** 提交执行完成后的回调函数 */
  submitComplete = res => {
    if (res.success) {
      const { location } = this.props;
      const { taskId } = location.query;
      eventBus.emit('closeTab', [taskId]);
    }
  };

  handleSave = data => {
    this.dispatchAction({
      type: 'todolistDetails/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'todolistDetails/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.refresh();
      }
    });
  };

  // handleClose = () => {
  //   this.dispatchAction({
  //     type: 'todolistDetails/updateState',
  //     payload: {
  //       modalVisible: false,
  //       editData: null,
  //     },
  //   });
  // };

  // getEditModalProps = () => {
  //   const { loading, todolistDetails } = this.props;
  //   const { editData } = todolistDetails;

  //   return {
  //     onSave: this.handleSave,
  //     editData,
  //     visible: true,
  //     onClose: this.handleClose,
  //     saving: loading.effects['todolistDetails/save'],
  //   };
  // };

  render() {
    const { form, editData } = this.props;
    const { getFieldDecorator } = form;
    const { location } = this.props;
    const { id, taskId, instanceId } = location.query;
    // const notStart = editData.flowStatus == 0 ? true : false;
    // const confirm = editData.flowStatus == 1 && editData.proposalStatus ? true : false;
    // const verify = editData.flowStatus == 1 &&  ? true : false ;
    const approveProps = {
      businessId: id,
      taskId,
      instanceId,
      beforeSubmit: this.handleSave,
      submitComplete: this.submitComplete,
      onApproveRef: this.aa,
    };
    

    return (
      <AuthUrl>
        <Approve {...approveProps}>
          <Form
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          >
            <div style={{margin:"30px",fontSize:"18px",fontWeight:"bold"}}>起草阶段</div>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="待办事项">
                  {getFieldDecorator('todoList', {
                    initialValue: this.editData && this.editData.todoList,
                    rules: [
                      {
                        required: true,
                        message: '待办事项不能为空',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
                <Col span={10}>
                  <FormItem label="提出日期">
                    {getFieldDecorator('submitDate', {initialValue: this.editData ? this.editData.submitDate && moment.utc(this.editData.submitDate) : now,})
                    (<DatePicker disabled/>)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem label="起草人">
                    {getFieldDecorator('submitName', {initialValue: getCurrentUser().userName,})
                    (<Input disabled />)}
                  </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="要求完成日期">
                  {getFieldDecorator('completionDate', {initialValue: this.editData && this.editData.completionDate && moment.utc(this.editData.completionDate),
                    rules: [
                      {
                        required: true,
                        message: '要求完成日期不能为空',
                      },
                    ],
                  })(<DatePicker disabled/>)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="责任人">
                  {getFieldDecorator('ondutyName', {initialValue: this.editData && this.editData.ondutyName,
                    rules: [
                      {
                        required: true,
                        message: '责任人不能为空',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
            <div style={{margin:"30px",fontSize:"18px",fontWeight:"bold"}}>确认阶段</div>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="确认人">
                  {getFieldDecorator('confirmedby1', {initialValue: this.editData && this.editData.confirmedby1, })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="建议状态">
                  {getFieldDecorator('proposalStatus', {initialValue: this.editData && this.editData.proposalStatus, })(<Input placeholder='请输入结案/不结案' disabled />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="完成情况">
                  {getFieldDecorator('completion', { initialValue: this.editData && this.editData.completion,})(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
            <div style={{margin:"30px",fontSize:"18px",fontWeight:"bold"}}>验证阶段</div>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="确认人">
                  {getFieldDecorator('confirmedby2', {initialValue: this.editData && this.editData.confirmedby2,})(<Input disabled />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="确认时间">
                  {getFieldDecorator('confirmationTime', {initialValue: this.editData && this.editData.confirmationTime && moment.utc(this.editData.confirmationTime),})
                  (<DatePicker disabled/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="结案状态">
                  {getFieldDecorator('closingStatus', {initialValue: this.editData && this.editData.closingStatus,})(<Input placeholder='请输入合格/不合格' disabled />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="备注">
                  {getFieldDecorator('remark', {initialValue: this.editData && this.editData.remark,})(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Approve>
      </AuthUrl>
    );
  }
}

export default ApproveDetail;
