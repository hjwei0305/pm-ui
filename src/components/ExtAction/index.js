import React, { PureComponent } from 'react';
import cls from 'classnames';
import { Dropdown, Menu } from 'antd';
import { utils, ExtIcon, WorkFlow } from 'suid';
import styles from './index.less';

const { getUUID, authAction } = utils;
const { Item } = Menu;

const { StartFlow } = WorkFlow;
const { FlowHistoryButton } = WorkFlow;

class ExtAction extends PureComponent {
  static globalLoad;

  constructor(props) {
    super(props);
    this.state = {
      menuShow: false,
      selectedKeys: '',
    };
  }

  onActionOperation = e => {
    const { onAction, recordItem } = this.props;
    e.domEvent.stopPropagation();
    this.setState(
      {
        selectedKeys: '',
        menuShow: false,
      },
      () => {
        onAction(e.key, recordItem);
      },
    );
  };

  beforeStart = props => {
    return new Promise(resolve => {
      if (props.beforeStart) {
        return resolve(props.beforeStart());
      }
      this.setState({ menuShow: false });
      resolve({ success: true });
    }).catch(e => window.console.log(e));
  };

  getMenu = (menus, recordItem) => {
    const menuId = getUUID();
    return (
      <Menu
        id={menuId}
        className={cls(styles['action-menu-box'])}
        onClick={e => this.onActionOperation(e, recordItem)}
      >
        {menus.map(m => {
          if (m.key === 'flow') {
            return (
              <Item key={m.key}>
                <StartFlow {...m.props} beforeStart={() => this.beforeStart(m.props)}>
                  {() => <span className="menu-title">{m.title}</span>}
                </StartFlow>
              </Item>
            );
          }
          if (m.key === 'flowHistory') {
            return (
              <Item key={m.key}>
                <FlowHistoryButton {...m.props}>
                  <span className="menu-title">{m.title}</span>
                </FlowHistoryButton>
              </Item>
            );
          }
          if (m.authCode) {
            return authAction(
              <Item key={m.key} authCode={m.authCode}>
                <span className="menu-title">{m.title}</span>
              </Item>,
            );
          }
          return (
            <Item key={m.key}>
              <span className="menu-title">{m.title}</span>
            </Item>
          );
        })}
      </Menu>
    );
  };

  onVisibleChange = v => {
    const { selectedKeys } = this.state;
    this.setState({
      menuShow: v,
      selectedKeys: !v ? '' : selectedKeys,
    });
  };

  getRenderContent = () => {
    const { onAction, recordItem, menusData } = this.props;
    const { menuShow } = this.state;
    return (
      <>
        {menusData.length === 1 ? (
          <ExtIcon
            className={cls('action-recordItem')}
            type={menusData[0].icon}
            tooltip={{ title: menusData[0].title }}
            onClick={e => {
              e.stopPropagation();
              onAction(menusData[0].key, recordItem);
            }}
            antd
          />
        ) : (
          <Dropdown
            trigger={['click']}
            overlay={this.getMenu(menusData, recordItem)}
            className="action-drop-down"
            placement="bottomLeft"
            onClick={e => e.stopPropagation()}
            visible={menuShow}
            onVisibleChange={this.onVisibleChange}
          >
            <ExtIcon className={cls('action-recordItem')} type="more" antd />
          </Dropdown>
        )}
      </>
    );
  };

  render() {
    const { menusData } = this.props;
    return <>{menusData.length > 0 ? this.getRenderContent() : null}</>;
  }
}

export default ExtAction;
