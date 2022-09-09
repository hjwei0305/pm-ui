import React, { Component } from 'react';
import { ExtTable } from 'suid';
import { Row, Col, Calendar } from 'antd';
import { withRouter } from 'umi';
import { connect } from 'dva';
import styles from './index.less'
import logo1 from '../../../static/proj-one.png'
import logo2 from '../../../static/proj-two.png'
import logo3 from '../../../static/proj-three.png'
import logo4 from '../../../static/proj-four.png'
import logo5 from '../../../static/proj-five.png'

@withRouter
@connect(({ home, loading }) => ({ home, loading }))
class Home extends Component {
  constructor(props){
    super(props)
    const { dispatch } = props;
    dispatch({
      type: 'home/getProjectInfo',
      payload:{
      }
    }).then(res => {
      const { data } = res
      if(res.success){
        this.setState({
          notStartedNum: data.notStartedNum,
          processingNum: data.processingNum,
          onLineNum: data.onLineNum,
          advanceFinishNum: data.advanceFinishNum,
          overTimeNum: data.overTimeNum,
        })
      }
    })
  }

  state = {
    notStartedNum: 0,
    processingNum: 0,
    onLineNum: 0,
    advanceFinishNum: 0,
    overTimeNum: 0,
  }

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };
  onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };
  // getExtableProps = () => {
  //   const columns = [
  //     {
  //       title: '代码',
  //       dataIndex: 'code',
  //       width: 120,
  //     },
  //     {
  //       title: '名称',
  //       dataIndex: 'name',
  //       width: 180,
  //     },
  //   ];
  //   const toolBarProps = {
  //     left: <Button onClick={this.refresh}>刷新</Button>,
  //   };

  //   return {
  //     columns,
  //     toolBar: toolBarProps,
  //     remotePaging: true,
  //     searchProperties: ['code', 'name'],
  //     searchPlaceHolder: '请输入关键字进行查询',
  //     onTableRef: inst => (this.tableRef = inst),
  //     store: {
  //       type: 'POST',
  //       url:
  //         '/mock/5e02d29836608e42d52b1d81/template-service/simple-master/findByPage',
  //     },
  //   };
  // };

  render() {
    return (
      <>
        <div className={styles['container']}>
          <Row style={{ height: "170px" }} className="row-content">
            <div style={{ margin: "9px 12px", background: "white", height: "152px", borderRadius: "4px" }}>
              <div>
                <Col className="col-content">
                  <div className="item item-color1">
                    <div className="item-img">
                      <img src={logo1} width={80} height={80}></img>
                      <div style={{ padding: "0 20px" }}>
                        <div className="item-text1">{this.state.notStartedNum}</div>
                        <div className="item-text2">未开始项目</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color2">
                    <div className="item-img">
                      <img src={logo2} width={80} height={80}></img>
                      <div style={{ padding: "0 20px" }}>
                        <div className="item-text1">{this.state.processingNum}</div>
                        <div className="item-text2">进行中项目</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color3">
                    <div className="item-img">
                      <img src={logo3} width={80} height={80}></img>
                      <div style={{ padding: "0 20px" }}>
                        <div className="item-text1">{this.state.onLineNum}</div>
                        <div className="item-text2">本年度已上线项目</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color4">
                    <div className="item-img">
                      <img src={logo4} width={80} height={80}></img>
                      <div style={{ padding: "0 20px" }}>
                        <div className="item-text1">{this.state.advanceFinishNum}</div>
                        <div className="item-text2">本年度提前完成项目</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color5">
                    <div className="item-img">
                      <img src={logo5} width={80} height={80}></img>
                      <div style={{ padding: "0 20px" }}>
                        <div className="item-text1">{this.state.overTimeNum}</div>
                        <div className="item-text2">本年度逾期项目（含未完成）</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </div>
            </div>
          </Row>
          <Row className="row-content">
            <div style={{ float: "left", width: "34%", margin: "9px 12px", background: "white", height: "calc(100% - 188px)", borderRadius: "4px" }}>
              <Col className="col-content2">
                <div class="progress">项目主计划进度</div>
                <div class="table">
                  <div class="column">
                    <div class="header first"><span>项目名称</span></div>
                    <div><span>项目管理系统（一期）</span></div>
                    <div><span>文本内容</span></div>
                    <div><span>文本内容</span></div>
                    <div><span>文本内容</span></div>
                    <div><span>文本内容</span></div>
                    <div><span>文本内容</span></div>
                    <div><span>文本内容</span></div>
                    <div><span>文本内容</span></div>
                    <div><span>文本内容</span></div>
                    <div><span>文本内容</span></div>
                    <div><span>文本内容</span></div>
                    <div><span>文本内容</span></div>
                  </div>
                  <div class="column">
                    <div class="header second">主导人</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                  </div>
                  <div class="column">
                    <div class="header third">主计划达成</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                  </div>
                </div>
              </Col>
            </div>
            <div style={{ float: "left", width: "44%", margin: "9px 12px", background: "white", height: "calc(100% - 392px)", borderRadius: "4px" }}>
              <Col className="col-content3">
                <div class="project">我的项目<span>（5/10）</span></div>
                <div class="table2">
                  <div class="column">
                    <div class="header"><span>序号</span></div>
                    <div><span>1</span></div>
                    <div><span>2</span></div>
                    <div><span>3</span></div>
                    <div><span>4</span></div>
                    <div><span>5</span></div>
                  </div>
                  <div class="column">
                    <div class="header first">主导人</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                  </div>
                  <div class="column">
                    <div class="header" style={{ 'width': '100px' }}>主导人</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                  </div>
                  <div class="column">
                    <div class="header" style={{ 'width': '100px' }}>主计划达成</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                  </div>
                  <div class="column">
                    <div class="header" style={{ 'width': '100px' }}>主计划达成</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                    <div>文本内容</div>
                  </div>
                </div>
              </Col>
            </div>
            <div style={{ float: "left", width: "17%", margin: "9px 12px", background: "white", height: "calc(100% - 392px)", borderRadius: "4px" }}>
              <Col>
                <div className="site-calendar-demo-card">
                  <Calendar fullscreen={false} onPanelChange={this.onPanelChange} />
                </div>
              </Col>
            </div>
            <div style={{ float: "left", width: "33%", margin: "9px 12px", background: "white", height: "calc(100% )", borderRadius: "4px" }}>
              <Col className='col-content5'>
                <div class="project">待办事项<span>（3）</span></div>
                <div className="items">
                  <div className="item">
                    <div className='item-title'>【项目管理系统（一期）】您有一个待办事项，请及时处理。</div>
                    <div className='item-time'>13分钟前</div>
                  </div>
                  <div className="item">
                    <div className='item-title'>【项目管理系统（一期）】您有一个待办事项，请及时处理。</div>
                    <div className='item-time'>2小时前</div>
                  </div>
                  <div className="item">
                    <div className='item-title'>【项目管理系统（一期）】您有一个待办事项，请及时处理。</div>
                    <div className='item-time'>6/28</div>
                  </div>
                </div>
              </Col>
            </div>
            <div style={{ float: "left", width: "28%", margin: "9px 12px", background: "white", height: "calc(100% )", borderRadius: "4px" }}>
              <Col className='col-content6'>
              <div class="project">我的通知<span>（1）</span></div>
                <div className="items">
                  <div className="item">
                    <div className='item-title'>【加入项目组】您已加入[项目管理系统]项目组。</div>
                    <div className='item-time'>13分钟前</div>
                  </div>
                </div>
              </Col>
            </div>
          </Row>
        </div>
      </>
    );
  }
}

export default Home;
