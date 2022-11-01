import React, { Component } from 'react';
import { connect } from 'dva';
import { withRouter } from 'umi';
import {Button, Col, Form, Input, Row} from 'antd';

const formItemLayout = {
  style: { margin: '0 auto' },
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
};

@Form.create()
@withRouter
@connect(({ eipTodo, loading }) => ({ eipTodo, loading }))
class EipTodo extends Component {

  static editData;

  deleteEipTodo =()=>{
    const {dispatch,form} = this.props;
    dispatch({
      type:'eipTodo/deleteEipTodo',
      payload: {
        projectCode: form.getFieldValue('billType'),
      },
    })
  }

  render() {
    const { form,editData } = this.props;
    const { getFieldDecorator } = form;

    return(
      <div>
        <Form {...formItemLayout}>
          <Row>
            <Col>
              <Form.Item label="eip待办id" width={100}>
                {getFieldDecorator('billType',{initialValue: editData && editData.projectCode})(<Input />)}
              </Form.Item>
            </Col>
            <Col>
              <Button onClick={this.deleteEipTodo}>删除待办</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default EipTodo;
