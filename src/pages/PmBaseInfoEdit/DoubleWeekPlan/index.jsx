import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Input, Form, Row, Col  } from 'antd';
import { ProLayout } from 'suid';


const { TextArea } = Input
const { Content } = ProLayout;

@Form.create()
@withRouter
@connect(({ pmBaseInfoEdit, loading }) => ({ pmBaseInfoEdit, loading }))
class DoubleWeekPlan extends Component {
  constructor(props) {
    super(props);
    const { id, dataList } = props;
    if(id != ''){
      this.state = {
        // weekPlan : weekPlan,
        // nextWeekPlan: nextWeekPlan,
        // workRisk: workRisk,
        dataList: dataList,
      }
    }
  }

  /** 修改input内容 */
  change = (name ,value) =>{
    let target = Object.assign({}, this.state.dataList, {
      [name]: value
    })
    this.setState({
      dataList: target
    })
  }
  /** 保存双周计划 */
  saveWeekPlan = () => {
    const { onSave } = this.props;
    onSave(this.state.dataList,'week')
  }

  render() {
    return (
      <>
        <ProLayout>
          {/* <Header>
            
          </Header> */}
          <Content>
            <Form>
              <Row gutter={24} justify="space-around" style={{margin:"0 10px"}}>
                <Button
                  // hidden={this.state.saveButton}
                  type="primary"
                  style={{ marginRight: '16px' }}
                  ghost
                  onClick={this.saveWeekPlan}
                >
                  保存双周计划
                </Button>
              </Row>
              <Row gutter={24} justify="space-around" style={{margin:"0 10px 0 40px"}}>
                <Col span={8}>
                  <div style={{textAlign:'center',fontSize:'20px',margin:"20px 0"}}>本周计划</div>
                  <TextArea 
                    onChange={(event) => this.change('weekPlan',event.target.value)}
                    value={this.state.dataList.weekPlan}
                    autoSize={{ minRows: 4, maxRows: 8 }} 
                    maxLength={256}
                  ></TextArea>
                </Col>
                <Col span={8}>
                  <div style={{textAlign:'center',fontSize:'20px',margin:"20px 0"}}>下周计划</div>
                  <TextArea 
                    onChange={(event) => this.change('nextWeekPlan',event.target.value)}
                    value={this.state.dataList.nextWeekPlan}
                    autoSize={{ minRows: 4, maxRows: 8 }} 
                    maxLength={256}
                  ></TextArea>
                </Col>
                <Col span={6}>
                  <div style={{textAlign:'center',fontSize:'20px',margin:"20px 0"}}>当前工作风险点</div>
                  <TextArea
                    onChange={(event) => this.change('workRisk',event.target.value)}
                    value={this.state.dataList.workRisk}
                    autoSize={{ minRows: 4, maxRows: 8 }} 
                    maxLength={256}
                  ></TextArea>
                </Col>
              </Row>
            </Form>
          </Content>
        </ProLayout>
      </>
    );
  }
}

export default DoubleWeekPlan;
