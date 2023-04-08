import React, { PureComponent } from 'react';
import { Form, Input, ComboList, Switch, Select, message } from 'antd';
import { ExtModal } from 'suid';

import {constants} from "@/utils";
const {PROJECT_PATH} = constants;
const { Option } = Select;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {
  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      if (onSave) {
        onSave(params);
      }
    });
  };

  change = (value) =>{
    const { editData, dispatch } = this.props;
    const params = {};
    Object.assign(params, editData);
    if(value.length == 0){
      params.proOpt = ''
    }else{
      params.proOpt = value.join(',')
    }
    
    dispatch({
      type: 'projectOption/updateState',
      payload: {
        editData: params,
      },
    });
  }



  render() {
    const { form, editData, onClose, saving, visible, proOptList } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';

    console.log(proOptList)

    // const getComboListProps = () => {
    //   return {
    //     form,
    //     showSearch: false,
    //     field: ['actitypeId','healthActitypeActivityType'],
    //     store: {
    //       url: `${PROJECT_PATH}/healthActitype/getactivityType`,
    //       type: 'POST',
    //     },
    //     reader: {
    //       name: 'activityType',
    //       field: ['id','activityType'],
    //     },
    //   };
    // };

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="配置名称">
            {getFieldDecorator('proName', {
              initialValue: editData && editData.proName,
              rules: [
                {
                  required: true,
                  message: '配置名称不能为空',
                },
                {
                  max: 10,
                  message: '配置名称不能超过5个字符',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="流程配置">
            {/* {getFieldDecorator('proOpt', {
              initialValue: (editData && editData.proOpt === '') ? [] : editData.proOpt,
            })
            ( */}
            <Select 
              value={editData && editData.proOpt === '' ? [] : editData.proOpt.split(',')}
              maxTagCount={6} 
              mode="tags" 
              style={{ width: '100%' }} 
              placeholder="选择项目流程" 
              onChange={(value,_) => this.change(value)}>
                {proOptList}
            </Select>
            {/* // ) */}
            {/* } */}
          </FormItem>
          <FormItem label="是否启用">
            {getFieldDecorator('usable', {
              initialValue: editData && editData.usable,
              valuePropName: 'checked',
            })(<Switch/>)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
