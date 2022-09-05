import React, { Component } from 'react';
import { ExtTable } from 'suid';
import { Row, Col } from 'antd';
import styles from './index.less'
import logo1 from '../../../static/proj-one.png'
import logo2 from '../../../static/proj-two.png'
import logo3 from '../../../static/proj-three.png'
import logo4 from '../../../static/proj-four.png'
import logo5 from '../../../static/proj-five.png'

class Home extends Component {
  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
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
          <Row style={{height:"170px"}} className="row-content">
            <div style={{margin:"9px 12px",background:"white",height:"152px",borderRadius:"4px"}}>
              <div>
                <Col className="col-content">
                  <div className="item item-color1">
                    <div className="item-img">
                      <img src={logo1} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">10</div>
                        <div className="item-text2">未开始项目</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color2">
                    <div className="item-img">
                      <img src={logo2} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">10</div>
                        <div className="item-text2">进行中项目</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color3">
                    <div className="item-img">
                      <img src={logo3} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">10</div>
                        <div className="item-text2">本年度已上线项目</div>
                      </div>
                    </div>
                  </div>
                  </Col>
                <Col className="col-content">
                  <div className="item item-color4">
                    <div className="item-img">
                      <img src={logo4} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">10</div>
                        <div className="item-text2">本年度提前完成项目</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color5">
                    <div className="item-img">
                      <img src={logo5} width={80} height={80}></img>
                      <div style={{padding:"0 20px"}}>
                        <div className="item-text1">10</div>
                        <div className="item-text2">本年度逾期项目（含未完成）</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </div>
            </div>
          </Row>
          <Row className="row-content">
            <div style={{float:"left",width:"33%", margin:"9px 12px",background:"white",height:"calc(100% - 188px)",borderRadius:"4px"}}>
              <Col className="col-content2">
                <div>项目主计划进度</div>
              </Col>
            </div>
          </Row>
        </div>
      </>
    );
  }
}

export default Home;
