import React, { Component } from 'react';
import cls from 'classnames';
import styles from './index.less';
import { Button, message } from 'antd';
import Schedule from './Schedule';
import { connect } from 'dva';
import { withRouter } from 'umi';
import EditModal from './EditModal'

@withRouter
@connect(({ pmBaseInfoEdit, loading }) => ({ pmBaseInfoEdit, loading }))
class ProjectSchedule extends Component {
  state = {
    ScheduleArys: []
  }
  // ScheduleArys = {
  //   2.1: "0",
  //   '2.2': 1,
  //   '2.3': 1,
  //   '2.4': 1,
  //   '3.1': 1,
  //   '5.1': 0,
  //   '6.2': 1,
  // };

  checkStage = target => { // 阶段验证
    const { ScheduleArys } = this.props
    if(ScheduleArys.length != 0 && this.state.ScheduleArys != ScheduleArys){
      this.setState({
        ScheduleArys: ScheduleArys
      })
    }
    var scheduleKeys = Object.keys(this.state.ScheduleArys);
    if (scheduleKeys) {
      var scheduleKeysLen = scheduleKeys.length;
      target = parseFloat(target);
      var bNum = 0;
      var tNum = 0;
      for (var y = 0; y < scheduleKeysLen; y++) {
        if (scheduleKeys[y].substring(0, 1) == target) {
          bNum++;
          if (this.state.ScheduleArys[scheduleKeys[y]] == 1) {
            tNum++;
          }
        }
      }
      if (bNum > 0 && bNum == tNum) {
        return 1;
      } else if (bNum > 0 && bNum > tNum) {
        return 0;
      } else {
        return -1;
      }
    }
  };

  stageCls = (target, stype) => { // 流程阶段样式
    var targetCls = '';
    var checkResult = this.checkStage(target);
    if (checkResult == 0) {
      targetCls = 'InProgress';
    } else if (checkResult == -1) {
      targetCls = 'NoStart';
    } else {
      targetCls = 'Finish';
    }
    return cls(styles[stype + targetCls]);
  };

  stageLineCls = () => { // 阶段百份比线条
    var tNum = 7;
    for (var i = 7; i >= 2; i--) {
      var checkResult = this.checkStage(i);
      if (checkResult < 0) {
        tNum = i;
      } else {
        tNum = i;
        break;
      }
    }
    return cls(styles['scheduleLineInside' + tNum])
  };

  checkSchedule = target => { // 流程验证
    var scheduleKeys = Object.keys(this.state.ScheduleArys);
    if (scheduleKeys) {
      var scheduleKeysLen = scheduleKeys.length;
      for (var i = 0; i < scheduleKeysLen; i++) {
        if (scheduleKeys[i] == target) {
          return this.state.ScheduleArys[target];
        }
      }
      return -1;
    }
  };

  titleCls = (target) => { // 流程标题样式
    var clsAry = []
    // 流程步骤ClassName
    clsAry.push(styles["step" + target.replace(/\./g, '_')]);
    // 流程步骤状态ClassName
    var stateClsName = 'step_dn';
    var checkResult = this.checkSchedule(target);
    if (checkResult == 0) {
      stateClsName = 'step_on';
    } else if (checkResult == -1) {
      stateClsName = 'step_no';
    }
    clsAry.push(styles[stateClsName]);
    return clsAry.join(' ');
  };

  lineColor = (target) => { // 画线颜色
    var lColor = '#0DB2B4' // 已完成 默认颜色
    var checkResult = this.checkSchedule(target);
    if (checkResult == 0) { // 进行中 默认颜色
      lColor = '#FEBB20'
    } else if (checkResult == -1) { // 未开始 默认颜色
      lColor = '#a1a1a1'
    }
    return lColor;
  };

  btnState = (target) => { // 按钮状态
    return this.checkSchedule(target) < 0;
  };

  btnCls = (target, btype) => { // 按钮样式
    var clsName = 'step_btns_' + btype;
    var checkResult = this.checkSchedule(target);
    if (checkResult == -1) {
      clsName += '_no';
    }
    return cls(styles[clsName]);
  };

  upload = (type,typeName) => {
    this.dispatchAction({
      type: 'pmBaseInfoEdit/updateState',
      payload: {
        modalVisibleSche: true,
        fileType: type,
        attId: typeName,
      },
    });
  };

  defaultCallBack = res => {
    if (!res.success) {
      message.warning(res.message);
    }
  };

  getEditModalProps = () => {
    const { loading, pmBaseInfoEdit,editData, dispatch } = this.props;
    const { modalVisibleSche, fileType, attId } = pmBaseInfoEdit;
    // const { code, name } = this.props.location.state;

    return {
      // onSave: this.SaveUpload,
      editData,dispatch,fileType,attId,
      visible: modalVisibleSche,
      onClose: this.handleClose,
      saving: loading.effects['pmBaseInfoEdit/saveUpload'],
    };
  };

  handleClose = () => {
    this.dispatchAction({
      type: 'pmBaseInfoEdit/updateState',
      payload: {
        modalVisibleSche: false,
        editData: null,
        fileType: null,
        attId: null,
      },
    });
    this.updateNode()
    console.log(this.state)
    this.forceUpdate();
  };

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;
    return dispatch({
      type,
      payload
    });
  }

  check = () =>{
    this.dispatchAction({
      type: 'pmBaseInfoEdit/review',
      payload: {
      },
    });
  }

  updateNode = () => {
      const { dispatch, id } = this.props;
      dispatch({
        type: 'pmBaseInfoEdit/findByIdForSchedule',
        payload: {
          id: id
        }
      }).then(res =>{
        if(res.data){
          this.setState({
            ScheduleArys: JSON.parse(res.data.gfxJson)
          })
        }
      })
  }

  render() {
    const { pmBaseInfoEdit, editData } = this.props;
    const { modalVisibleSche } = pmBaseInfoEdit;
    return (
      <>
        <p className={cls(styles['scheduleLine'])}>
          <div className={this.stageLineCls()}></div>
        </p>
        <p className={cls(styles['title'])}>
          <div className={`${styles.titleLis1} ${styles.titleLis}`}>
            <div className={cls(styles['circle'])}>
              <div className={cls(styles['circleFinish'])}></div>
            </div>
            <div className={cls(styles['titleFontFinish'])}>项目提案</div>
            <div className={cls(styles['titleDate'])}>2022.01.01 - 2022.12.31</div>
          </div>
          <div className={`${styles.titleLis2} ${styles.titleLis}`}>
            <div className={cls(styles['circle'])}>
              <div className={this.stageCls('2', 'circle')}></div>
            </div>
            <div className={this.stageCls('2', 'titleFont')}>需求分析</div>
            <div className={cls(styles['titleDate'])}>2022.01.01 - 2022.12.31</div>
          </div>
          <div className={`${styles.titleLis3} ${styles.titleLis}`}>
            <div className={cls(styles['circle'])}>
              <div className={this.stageCls('3', 'circle')}></div>
            </div>
            <div className={this.stageCls('3', 'titleFont')}>UI设计</div>
            <div className={cls(styles['titleDate'])}>2022.01.01 - 2022.12.31</div>
          </div>
          <div className={`${styles.titleLis4} ${styles.titleLis}`}>
            <div className={cls(styles['circle'])}>
              <div className={this.stageCls('4', 'circle')}></div>
            </div>
            <div className={this.stageCls('4', 'titleFont')}>系统开发</div>
            <div className={cls(styles['titleDate'])}>2022.01.01 - 2022.12.31</div>
          </div>
          <div className={`${styles.titleLis5} ${styles.titleLis}`}>
            <div className={cls(styles['circle'])}>
              <div className={this.stageCls('5', 'circle')}></div>
            </div>
            <div className={this.stageCls('5', 'titleFont')}>测试</div>
            <div className={cls(styles['titleDate'])}>2022.01.01 - 2022.12.31</div>
          </div>
          <div className={`${styles.titleLis6} ${styles.titleLis}`}>
            <div className={cls(styles['circle'])}>
              <div className={this.stageCls('6', 'circle')}></div>
            </div>
            <div className={this.stageCls('6', 'titleFont')}>上线实施</div>
            <div className={cls(styles['titleDate'])}>2022.01.01 - 2022.12.31</div>
          </div>
          <div className={`${styles.titleLis7} ${styles.titleLis}`}>
            <div className={cls(styles['circle'])}>
              <div className={this.stageCls('7', 'circle')}></div>
            </div>
            <div className={this.stageCls('7', 'titleFont')}>项目结案</div>
            <div className={cls(styles['titleDate'])}>2022.01.01 - 2022.12.31</div>
          </div>
        </p>
        <div className={`${styles.module} ${styles.module1}`}>
          <span className={cls(styles['step1'])}>创建项目</span>
          <Schedule clsName='canvas1' width="80" height="36" color="#0DB2B4" Lines='[{"frX":5,"toX":75,"frY":18,"toY":18}]' direction="Horizontal" />
        </div>
        <div className={`${styles.module} ${styles.module2}`}>
          <span className={this.titleCls('2.1')}>调研</span>
          <Schedule clsName='canvas2_1' width="140" height="160" color={this.lineColor('2.1')} Lines='[{"frX":40,"toX":40,"frY":5,"toY":155}]' direction="Vertical" />
          <div className={`${styles.step_content} ${styles.step_content2_1}`}>
            <div className={cls(styles['step_font'])}>需求范围说明书</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('2.1', 'template')} disabled={this.btnState('2.1')}>模板</Button></li>
              <li><Button className={this.btnCls('2.1', 'upload')} disabled={this.btnState('2.1')} onClick={() => this.upload('RequireDoc',editData.requireDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('2.1', 'check')} disabled={this.btnState('2.1')} onClick={() => this.check}>查看</Button></li> */}
            </ul>
            <div className={cls(styles['step_font'])}>验收标准</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('2.1', 'template')} disabled={this.btnState('2.1')}>模板</Button></li>
              <li><Button className={this.btnCls('2.1', 'upload')} disabled={this.btnState('2.1')} onClick={() => this.upload('AcceptStandardDoc',editData.acceptStandardDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('2.1', 'check')} disabled={this.btnState('2.1')}>查看</Button></li> */}
            </ul>
          </div>

          <span className={this.titleCls('2.2')}>启动会议</span>
          <Schedule clsName='canvas2_2' width="140" height="100" color={this.lineColor('2.2')} Lines='[{"frX":40,"toX":40,"frY":5,"toY":95}]' direction="Vertical" />
          <div className={`${styles.step_content} ${styles.step_content2_2}`}>
            <div className={cls(styles['step_font'])}>启动报告</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('2.2', 'template')} disabled={this.btnState('2.2')}>模板</Button></li>
              <li><Button className={this.btnCls('2.2', 'upload')} disabled={this.btnState('2.2')}  onClick={() => this.upload('StartReportDoc',editData.startReportDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('2.2', 'check')} disabled={this.btnState('2.2')}>查看</Button></li> */}
            </ul>
          </div>

          <span className={this.titleCls('2.3')}>提案系统</span>
          <Schedule clsName='canvas2_3' width="140" height="100" color={this.lineColor('2.3')} Lines='[{"frX":40,"toX":40,"frY":5,"toY":95}]' direction="Vertical" />
          <div className={`${styles.step_content} ${styles.step_content2_3}`}>
            <div className={cls(styles['step_font'])}>用户需求说明</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('2.3', 'template')} disabled={this.btnState('2.3')}>模板</Button></li>
              <li><Button className={this.btnCls('2.3', 'upload')} disabled={this.btnState('2.3')} onClick={() => this.upload('UserRequireDoc',editData.userRequireDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('2.3', 'check')} disabled={this.btnState('2.3')}>查看</Button></li> */}
            </ul>
          </div>

          <span className={this.titleCls('2.4')}>需求评审</span>
          <Schedule clsName='canvas2_4' width="200" height="100" color={this.lineColor('2.4')} direction="Horizontal" lineMode="OnlyLine" Lines='[{"frX":40,"toX":40,"frY":5,"toY":50},{"toX":200,"toY":50}]' />
          <Schedule clsName='canvas2_4_1' width="30" height="621" color={this.lineColor('2.4')} direction="Horizontal" Lines='[{"frX":2,"toX":2,"frY":621,"toY":85},{"toX":20,"toY":85}]' />
        </div>
        <div className={`${styles.module} ${styles.module3}`}>
          <span className={this.titleCls('3.1')}>UI设计</span>
          <Schedule clsName='canvas3_1' width="140" height="160" color={this.lineColor('3.1')} Lines='[{"frX":35,"toX":35,"frY":5,"toY":155}]' direction="Vertical" />
          <div className={`${styles.step_content} ${styles.step_content3_1}`}>
            <div className={cls(styles['step_font'])}>设计图备份</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('3.1', 'template')} disabled={this.btnState('3.1')}>模板</Button></li>
              <li><Button className={this.btnCls('3.1', 'upload')} disabled={this.btnState('3.1')} onClick={() => this.upload('DesignerDoc',editData.designerDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('3.1', 'check')} disabled={this.btnState('3.1')}>查看</Button></li> */}
            </ul>
            <div className={cls(styles['step_font'])}>切图</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('3.1', 'template')} disabled={this.btnState('3.1')}>模板</Button></li>
              <li><Button className={this.btnCls('3.1', 'upload')} disabled={this.btnState('3.1')} onClick={() => this.upload('CropDoc',editData.cropDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('3.1', 'check')} disabled={this.btnState('3.1')}>查看</Button></li> */}
            </ul>
          </div>

          <span className={this.titleCls('3.2')}>UI评审</span>
          <Schedule clsName='canvas3_2' width="200" height="100" color={this.lineColor('3.2')} direction="Horizontal" lineMode="OnlyLine" Lines='[{"frX":35,"toX":35,"frY":5,"toY":60},{"toX":200,"toY":60}]' />
          <Schedule clsName='canvas3_2_1' width="30" height="358" color={this.lineColor('3.2')} direction="Horizontal" Lines='[{"frX":2,"toX":2,"frY":358,"toY":85},{"toX":20,"toY":85}]' />
          <Schedule clsName='canvas3_2_2' width="20" height="80" color={this.lineColor('3.2')} direction="Horizontal" Lines='[{"frX":0,"toX":20,"frY":45,"toY":45}]' />
        </div>
        <div className={`${styles.module} ${styles.module4}`}>
          <span className={this.titleCls('4.1')}>前端开发</span>
          <Schedule clsName='canvas4_1' width="140" height="100" color={this.lineColor('4.1')} Lines='[{"frX":40,"toX":40,"frY":5,"toY":95}]' direction="Vertical" />
          {/* <div className={`${styles.step_content} ${styles.step_content4_1}`}>
            <div className={cls(styles['step_font'])}>上传开发计划</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('4.1', 'template')} disabled={this.btnState('4.1')}>模板</Button></li>
              <li><Button className={this.btnCls('4.1', 'upload')} disabled={this.btnState('4.1')}>上传</Button></li>
              <li><Button className={this.btnCls('4.1', 'check')} disabled={this.btnState('4.1')}>查看</Button></li>
            </ul>
          </div> */}

          <span className={this.titleCls('4.2')}>前端评审</span>
          <Schedule clsName='canvas4_2' width="200" height="100" direction="Horizontal" color={this.lineColor('4.2')} lineMode="OnlyLine" Lines='[{"frX":40,"toX":40,"frY":5,"toY":60},{"toX":200,"toY":60}]' />

          <span className={this.titleCls('4.3')}>后端开发</span>
          <Schedule clsName='canvas4_3' width="140" height="100" color={this.lineColor('4.3')} Lines='[{"frX":40,"toX":40,"frY":5,"toY":95}]' direction="Vertical" />
          {/* <div className={`${styles.step_content} ${styles.step_content4_3}`}>
            <div className={cls(styles['step_font'])}>上传开发计划</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('4.3', 'template')} disabled={this.btnState('4.3')}>模板</Button></li>
              <li><Button className={this.btnCls('4.3', 'upload')} disabled={this.btnState('4.3')}>上传</Button></li>
              <li><Button className={this.btnCls('4.3', 'check')} disabled={this.btnState('4.3')}>查看</Button></li>
            </ul>
          </div> */}

          <span className={this.titleCls('4.4')}>后端评审</span>
          <Schedule clsName='canvas4_4' width="200" height="100" color={this.lineColor('4.4')} direction="Horizontal" lineMode="OnlyLine" Lines='[{"frX":40,"toX":40,"frY":5,"toY":60},{"toX":200,"toY":60}]' />
          <Schedule clsName='canvas4_4_1' width="30" height="571" color={this.lineColor('4.4')} direction="Horizontal" Lines='[{"frX":2,"toX":2,"frY":571,"toY":85},{"toX":20,"toY":85}]' />
        </div>
        <div className={`${styles.module} ${styles.module5}`}>
          <span className={this.titleCls('5.1')}>缺陷管理系统</span>
          <Schedule clsName='canvas5_1' width="140" height="160" color={this.lineColor('5.1')} Lines='[{"frX":40,"toX":40,"frY":5,"toY":155}]' direction="Vertical" />
          <div className={`${styles.step_content} ${styles.step_content5_1}`}>
            <div className={cls(styles['step_font'])}>测试用例</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('5.1', 'template')} disabled={this.btnState('5.1')}>模板</Button></li>
              <li><Button className={this.btnCls('5.1', 'upload')} disabled={this.btnState('5.1')}  onClick={() => this.upload('TestExampleDoc')}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('5.1', 'check')} disabled={this.btnState('5.1')}>查看</Button></li> */}
            </ul>
            <div className={cls(styles['step_font'])}>测试报告</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('5.1', 'template')} disabled={this.btnState('5.1')}>模板</Button></li>
              <li><Button className={this.btnCls('5.1', 'upload')} disabled={this.btnState('5.1')}  onClick={() => this.upload('TestReportDoc',editData.testReportDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('5.1', 'check')} disabled={this.btnState('5.1')}>查看</Button></li> */}
            </ul>
          </div>

          <span className={this.titleCls('5.2')}>测试结果</span>
          <Schedule clsName='canvas5_2' width="200" height="100" color={this.lineColor('5.2')} direction="Horizontal" lineMode="OnlyLine" Lines='[{"frX":40,"toX":40,"frY":5,"toY":60},{"toX":200,"toY":60}]' />
          <Schedule clsName='canvas5_2_1' width="30" height="358" color={this.lineColor('5.2')} direction="Horizontal" Lines='[{"frX":2,"toX":2,"frY":358,"toY":85},{"toX":20,"toY":85}]' />
        </div>
        <div className={`${styles.module} ${styles.module6}`}>
          <span className={this.titleCls('6.1')}>上线</span>
          <Schedule clsName='canvas6_1' width="140" height="160" color={this.lineColor('6.1')} Lines='[{"frX":30,"toX":30,"frY":5,"toY":155}]' direction="Vertical" />
          <div className={`${styles.step_content} ${styles.step_content6_1}`}>
            <div className={cls(styles['step_font'])}>SOP</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('6.1', 'template')} disabled={this.btnState('6.1')}>模板</Button></li>
              <li><Button className={this.btnCls('6.1', 'upload')} disabled={this.btnState('6.1')} onClick={() => this.upload('SopDoc',editData.sopDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('6.1', 'check')} disabled={this.btnState('6.1')}>查看</Button></li> */}
            </ul>
            <div className={cls(styles['step_font'])}>问题点清单</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('6.1', 'template')} disabled={this.btnState('6.1')}>模板</Button></li>
              <li><Button className={this.btnCls('6.1', 'upload')} disabled={this.btnState('6.1')} onClick={() => this.upload('QuestionListDoc',editData.questionListDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('6.1', 'check')} disabled={this.btnState('6.1')}>查看</Button></li> */}
            </ul>
          </div>

          <span className={this.titleCls('6.2')}>监控</span>
          <Schedule clsName='canvas6_2' width="200" height="160" color={this.lineColor('6.2')} direction="Horizontal" lineMode="OnlyLine" Lines='[{"frX":30,"toX":30,"frY":5,"toY":110},{"toX":200,"toY":110}]' />
          <Schedule clsName='canvas6_2_1' width="30" height="409" color={this.lineColor('6.2')} direction="Horizontal" Lines='[{"frX":2,"toX":2,"frY":409,"toY":85},{"toX":20,"toY":85}]' />
          <div className={`${styles.step_content} ${styles.step_content6_2}`}>
            <div className={cls(styles['step_font'])}>关键节点点检表</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('6.2', 'template')} disabled={this.btnState('6.2')}>模板</Button></li>
              <li><Button className={this.btnCls('6.2', 'upload')} disabled={this.btnState('6.2')} onClick={() => this.upload('CheckListDoc',editData.checkListDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('6.2', 'check')} disabled={this.btnState('6.2')}>查看</Button></li> */}
            </ul>
          </div>
        </div>
        <div className={`${styles.module} ${styles.module7}`}>
          <span className={this.titleCls('7.1')}>结案</span>
          <Schedule clsName='canvas15' width="140" height="210" color={this.lineColor('7.1')} Lines='[{"frX":30,"toX":30,"frY":5,"toY":205}]' direction="Vertical" />
          <div className={`${styles.step_content} ${styles.step_content7_1}`}>
            <div className={cls(styles['step_font'])}>结案报告</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('7.1', 'template')} disabled={this.btnState('7.1')}>模板</Button></li>
              <li><Button className={this.btnCls('7.1', 'upload')} disabled={this.btnState('7.1')} onClick={() => this.upload('CaseCloseReportDoc',editData.caseCloseReportDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('7.1', 'check')} disabled={this.btnState('7.1')}>查看</Button></li> */}
            </ul>
            <div className={cls(styles['step_font'])}>满意度调查</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('7.1', 'template')} disabled={this.btnState('7.1')}>模板</Button></li>
              <li><Button className={this.btnCls('7.1', 'upload')} disabled={this.btnState('7.1')} onClick={() => this.upload('SatisfactionSurveyDoc',editData.satisfactionSurveyDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('7.1', 'check')} disabled={this.btnState('7.1')}>查看</Button></li> */}
            </ul>
            <div className={cls(styles['step_font'])}>页面点检</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('7.1', 'template')} disabled={this.btnState('7.1')}>模板</Button></li>
              <li><Button className={this.btnCls('7.1', 'upload')} disabled={this.btnState('7.1')} onClick={() => this.upload('PageCheckDoc',editData.pageCheckDocId)}>上传/查看</Button></li>
              {/* <li><Button className={this.btnCls('7.1', 'check')} disabled={this.btnState('7.1')}>查看</Button></li> */}
            </ul>
          </div>

          <span className={this.titleCls('7.2')}>验收</span>
          <Schedule clsName='canvas7_2' width="140" height="150" color={this.lineColor('7.2')} Lines='[{"frX":30,"toX":30,"frY":5,"toY":145}]' direction="Vertical" />
          {/* <div className={`${styles.step_content} ${styles.step_content7_2}`}>
            <div className={cls(styles['step_font'])}>验收单</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('7.2', 'template')} disabled={this.btnState('7.2')}>模板</Button></li>
              <li><Button className={this.btnCls('7.2', 'upload')} disabled={this.btnState('7.2')}>上传</Button></li>
              <li><Button className={this.btnCls('7.2', 'check')} disabled={this.btnState('7.2')}>查看</Button></li>
            </ul>
            <div className={cls(styles['step_font'])}>验收报告</div>
            <ul className={cls(styles['step_btns'])}>
              <li><Button className={this.btnCls('7.2', 'template')} disabled={this.btnState('7.2')}>模板</Button></li>
              <li><Button className={this.btnCls('7.2', 'upload')} disabled={this.btnState('7.2')}>上传</Button></li>
              <li><Button className={this.btnCls('7.2', 'check')} disabled={this.btnState('7.2')}>查看</Button></li>
            </ul>
          </div> */}

          <span className={cls(styles['step7_3'])}>项目完结</span>
        </div>
        {modalVisibleSche ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default ProjectSchedule;
