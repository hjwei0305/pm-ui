import React, { PureComponent } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { WorkFlow, utils, AuthUrl, ComboList } from 'suid';
import { Form, Row, Col, Input, DatePicker } from 'antd';
import moment from 'moment';
import { getCurrentUser } from '@/utils/user';
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
    const { dispatch } = props;
    const { location } = this.props;
    const { id } = location.query;
    dispatch({
      type: 'todolistDetails/findOne',
      payload:{
        id: id
      }
    }).then(res => {
      const { data } = res;
      this.setState({
        editData : data,
      })
      
    })
  }


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
  //       this.state.editData: null,
  //     },
  //   });
  // };

  // getEditModalProps = () => {
  //   const { loading, todolistDetails } = this.props;
  //   const { this.state.editData } = todolistDetails;

  //   return {
  //     onSave: this.handleSave,
  //     this.state.editData,
  //     visible: true,
  //     onClose: this.handleClose,
  //     saving: loading.effects['todolistDetails/save'],
  //   };
  // };

  render() {
    const { form, dispatch } = this.props;
    const { getFieldDecorator } = form;
    const { location } = this.props;
    const { id, taskId, instanceId } = location.query;
    // const notStart = this.state.editData.flowStatus == 0 ? true : false;
    // const confirm = this.state.editData.flowStatus == 1 && this.state.editData.proposalStatus ? true : false;
    // const verify = this.state.editData.flowStatus == 1 &&  ? true : false ;
    const approveProps = {
      businessId: id,
      taskId,
      instanceId,
      beforeSubmit: this.handleSave,
      submitComplete: this.submitComplete,
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
                    initialValue: this.state.editData && this.state.editData.todoList,
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
                    {getFieldDecorator('submitDate', {initialValue: this.state.editData ? this.state.editData.submitDate && moment.utc(this.state.editData.submitDate) : now,})
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
                  {getFieldDecorator('completionDate', {initialValue: this.state.editData && this.state.editData.completionDate && moment.utc(this.state.editData.completionDate),
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
                  {getFieldDecorator('ondutyName', {initialValue: this.state.editData && this.state.editData.ondutyName,
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
                  {getFieldDecorator('confirmedby1', {initialValue: this.state.editData && this.state.editData.confirmedby1, })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="建议状态">
                  {getFieldDecorator('proposalStatus', {initialValue: this.state.editData && this.state.editData.proposalStatus, })(<Input placeholder='请输入结案/不结案' disabled />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="完成情况">
                  {getFieldDecorator('completion', { initialValue: this.state.editData && this.state.editData.completion,})(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
            <div style={{margin:"30px",fontSize:"18px",fontWeight:"bold"}}>验证阶段</div>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="确认人">
                  {getFieldDecorator('confirmedby2', {initialValue: this.state.editData && this.state.editData.confirmedby2,})(<Input disabled />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="确认时间">
                  {getFieldDecorator('confirmationTime', {initialValue: this.state.editData && this.state.editData.confirmationTime && moment.utc(this.state.editData.confirmationTime),})
                  (<DatePicker disabled/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <FormItem label="结案状态">
                  {getFieldDecorator('closingStatus', {initialValue: this.state.editData && this.state.editData.closingStatus,})(<Input placeholder='请输入合格/不合格' disabled />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="备注">
                  {getFieldDecorator('remark', {initialValue: this.state.editData && this.state.editData.remark,})(<Input disabled />)}
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
