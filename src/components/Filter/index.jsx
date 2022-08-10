import React, { useState } from 'react';
import { isFunction } from 'lodash';
import { Drawer, Button, Form, Dropdown, Popover } from 'antd';
import { Space, ExtIcon, ProLayout } from 'suid';
import cls from 'classnames';

import styles from './index.less';

const { Content, Footer } = ProLayout;

const Filter = props => {
  const {
    showClear,
    title='过滤',
    children,
    onFilter,
    onReset,
    form,
    layout='vertical',
    width='60%',
    filterOverlay,
    ...rest
  } = props;

  const [visible, setVisible] = useState(false);

  const { validateFields, resetFields } = form;

  const handleReset = () => {
    resetFields();
    validateFields((err, formData) => {
      if (!err && onReset) {
        onReset(formData)
        setVisible(false)
      }
    })
  }

  const handleFilter = () =>  {
    return new Promise((resolve, reject) => {
      validateFields((err, formData) => {
        if (!err && onFilter) {
          onFilter(formData)
          resolve(formData);
          setVisible(false)
        } else {
          reject(err);
        }
      })
    });

  }

  return (
    <>
      <Space
        className={cls({
          [styles['filter-icon']]: true,
          [styles.filter]: showClear,
        })}
      >
        { !showClear ? (
          <span onClick={() => { setVisible(true) }}>
            <ExtIcon type="filter" style={{ fontSize: 16 }} />
            <span>过滤</span>
          </span>
        ) : (
          <Popover
            placement="bottomRight"
            content={filterOverlay || <></>}
            title="过滤条件"
          >
            <Space>
              <span onClick={() => { setVisible(true) }}>
                <ExtIcon type="filter" style={{ fontSize: 16 }} />
                <span>过滤</span>
              </span>
              <ExtIcon
                type="close"
                className="btn-clear"
                antd
                onClick={handleReset}
                tooltip={{ title: '清除过滤条件', placement: 'bottomRight' }}
                style={{ fontSize: 14 }}
              />
            </Space>
          </Popover>
        ) }
      </Space>
      <Drawer
        title={title}
        width={width}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        bodyStyle={{
          height: title ? 'calc(100% - 56px)' : '100%',
          padding: 8,
        }}
        {...rest}
      >
        <ProLayout>
          <Content>
            <Form
              layout={layout}
            >
              {isFunction(children) ? children(Form.Item, form) : children}
            </Form>
          </Content>
          <Footer align="end">
            <Space>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" onClick={handleFilter}>查询</Button>
            </Space>
          </Footer>
        </ProLayout>
      </Drawer>
    </>
  );
};

export default Form.create({
  onValuesChange: ({ onValuesChange }, _, allValues) => {
    if (onValuesChange) {
      onValuesChange(allValues, _);
    }
  },
})(Filter);
