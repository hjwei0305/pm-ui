import React, { Component } from 'react';
import { ExtTable, ListCard } from 'suid';
import { Row, Col, Calendar } from 'antd';
import { withRouter } from 'umi';
import { connect } from 'dva';
import styles from './index.less'
import { constants } from '@/utils';
import logo1 from '../../../static/proj-one.png'
import logo2 from '../../../static/proj-two.png'
import logo3 from '../../../static/proj-three.png'
import logo4 from '../../../static/proj-four.png'
import logo5 from '../../../static/proj-six.png'
import logo6 from '../../../static/proj-nine.png'
import EditModal from './EditModal';

const { PROJECT_PATH } = constants;

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

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  listCardRefRefresh = () => {
    if (this.listCardRef) {
      this.listCardRef.remoteDataRefresh();
    }
  };

  onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  /**
   *
   * @returns 获取个人所有项目
   */
  getPersonalExtableProps = () => {
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        width: 300,
        required: true,
      },
      {
        title: '主导人',
        dataIndex: 'leader',
        width: 100,
        required: true,
      },
      {
        title: '当前阶段',
        dataIndex: 'currentPeriod',
        // width: 100,
        required: true,
      },
      {
        title: '当前进度%',
        dataIndex: 'masterScheduleRate',
        // width: 100,
        required: true,
      },
    ];
    return {
      showSearch: false,
      pagination: false,
      columns,
      bordered: true,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/pmBaseinfo/findPageByUserName`,
      },
    };
  };

    /**
   *
   * @returns 获取所有项目
   */
  getExtableProps = () => {
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        width: 300,
        required: true,
      },
      {
        title: '主导人',
        dataIndex: 'leader',
        width: 100,
        required: true,
      },
      {
        title: '当前进度%',
        dataIndex: 'masterScheduleRate',
        // width: 100,
        required: true,
      },
    ];
    return {
      showSearch: false,
      pagination: false,
      columns,
      bordered: true,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/pmBaseinfo/findByPage`,
      },
    };
  };


    /**
   *
   * @returns 通知过滤
   */
  getTableFilters = () =>{
    const filters = [];
    filters.push({
      fieldName: 'type',
      operator: 'EQ',
      fieldType: 'string',
      value: "通知",
    });
    return filters;
  }

      /**
   *
   * @returns 待办过滤
   */
  getToDoFilters = () =>{
    const filters = [];
    filters.push({
      fieldName: 'type',
      operator: 'EQ',
      fieldType: 'string',
      value: "待办",
    });
    return filters;
  }

      /**
   *
   * @returns 获取通知
   */
  getlistCardProps = () => {
    const filters = this.getTableFilters();
    return {
      // title:"我的通知",
      simplePagination: false,
      showArrow: false,
      pagination: false,
      showSearch: false,
      allowCancelSelect: true,
      // onSelectChange: (keys, items) => {
      //   message.success('test')
      //   console.log(keys, items);
      // },
      cascadeParams: {
        filters,
      },
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/todoList/findByPage`,
      },
      searchProperties: ['name', 'address'],
      itemField: {
        title: item => item.todoList,
        description: item => item.createdDate,
        extra: item => <span style={{ fontSize: 12, marginRight: 8 }}>{item.code}</span>,
      },
    };
  };

  /**
   *
   * @returns 获取待办
   */
  getToDoListCardProps = () => {
    const filters = this.getToDoFilters();
    return {
      // title:"待办事项",
      simplePagination: false,
      showArrow: false,
      pagination: false,
      showSearch: false,
      allowCancelSelect: true,
      onSelectChange: (keys, items) => {
        this.changeVisible(items)
      },
      cascadeParams: {
        filters,
      },
      store: {
        type: 'POST',
        url: `${PROJECT_PATH}/todoList/findByPage`,
      },
      searchProperties: ['name', 'address'],
      itemField: {
        title: item => item.projectName + "--" + item.todoList,
        description: item => item.submitDate,
        extra: item => <span style={{ fontSize: 12, marginRight: 8 }}>{item.code}</span>,
      },
    };
  };

  changeVisible = (items) => {
    let data = items[0]
    if(items.length === 0){
      for(const key in this.listCardRef.state.checkedList){
        data = this.listCardRef.state.checkedList[key]
      }
    }
    this.dispatchAction({
      type: 'home/updateState',
      payload: {
        modalVisible: true,
        editData: data
      },
    });
    this.listCardRefRefresh()
  };

  handleClose = () => {
    this.dispatchAction({
      type: 'home/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
    this.listCardRefRefresh()
  };

  handleSave = data => {
    this.dispatchAction({
      type: 'home/saveToDoList',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'home/updateState',
          payload: {
            modalVisible: false,
            editData: null,
          },
        });
      }
    });
    this.listCardRefRefresh()
  };

  getEditModalProps = () => {
    const { loading, home } = this.props;
    const { modalVisible, editData } = home;

    return {
      editData,
      onSave: this.handleSave,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['pmBaseInfo/syncProjectInfo'],
    };
  };

  render() {
    const { home } = this.props;
    const { modalVisible } = home;
    return (
      <>
        <div className={styles['container']}>
          <Row style={{ height: "170px" }} className="row-content">
            <div style={{ margin: "9px 12px", background: "white", height: "152px", borderRadius: "4px" }}>
              <div>
                <Col className="col-content">
                  <div className="item item-color3">
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
                      <img src={logo3} width={80} height={80}></img>
                      <div style={{ padding: "0 20px" }}>
                        <div className="item-text1">{this.state.processingNum}</div>
                        <div className="item-text2">进行中项目</div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col-content">
                  <div className="item item-color1">
                    <div className="item-img">
                      <img src={logo6} width={80} height={80}></img>
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
                  <div className="item item-color6">
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
                <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
                {/* <div class="table">
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
                </div> */}
              </Col>
            </div>
            <div style={{ float: "left", width: "42%", margin: "9px 12px", background: "white", height: "calc(100% - 500px)", borderRadius: "4px" }}>
              <Col className="col-content3">
                <div class="project">
                  我的项目
                  {/* <span>（5/10）</span> */}
                </div>
                <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getPersonalExtableProps()} />

                {/* <div class="table2">
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
                </div> */}
              </Col>
            </div>
            <div style={{ float: "left", width: "20%", margin: "9px 12px", background: "white", height: "calc(100% - 500px)", borderRadius: "4px" }}>
              <Col>
                <div className="site-calendar-demo-card">
                  <Calendar fullscreen={false} onPanelChange={this.onPanelChange} />
                </div>
              </Col>
            </div>
            <div style={{ float: "left", width: "33%", margin: "9px 12px", background: "white", height: "calc(100% - 642px)", borderRadius: "4px" }}>
              <Col className='col-content5'>
                <div class="project">
                  待办事项
                  {/* <span>（3）</span> */}
                </div>
                <ListCard onListCardRef={inst => (this.listCardRef = inst)} {...this.getToDoListCardProps()} />
                {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
                {/* <div className="items">
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
                </div> */}
              </Col>
            </div>
            <div style={{ float: "left", width: "29%", margin: "9px 12px", background: "white", height: "calc(100% - 642px)", borderRadius: "4px" }}>
              <Col className='col-content6'>
              <div class="project">
                我的通知
                {/* <span>（1）</span> */}
              </div>
              <ListCard {...this.getlistCardProps()} />
                {/* <div className="items">
                  <div className="item">
                    <div className='item-title'>【加入项目组】您已加入[项目管理系统]项目组。</div>
                    <div className='item-time'>13分钟前</div>
                  </div>
                </div> */}
              </Col>
            </div>
          </Row>
        </div>
      </>
    );
  }
}

export default Home;
