import React, { Component } from "react";
import { Form, Button } from 'antd';

import components from '../inputs';

const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class CreateForm extends Component {
  state = {
    isLoading: false,
  };

  toggleLoading = () => {
    this.setState(prevState => ({
      isLoading: !prevState.isLoading,
    }))
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { onSubmit, form: { validateFields, resetFields } } = this.props;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      this.toggleLoading();
      onSubmit(values);
      resetFields();
      this.toggleLoading();
    });
  };

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };
  render() {
    const { scheme, buttonName, className, form: { getFieldDecorator, getFieldsError } } = this.props;
    const { isLoading } = this.state;
    return (
      <Form
        onSubmit={this.handleSubmit}
        className={className}
        {...formLayout}
      >
        {
          scheme.map(field => (
            <FormItem

              label={field.label}
              key={field.name}
            >
              {getFieldDecorator(field.name, {
                rules: [
                  {
                    ...field.rules
                  },
                  {
                    required: field.required || false,
                    message: field.message || 'Please fill this input',
                  }
                ],
              })(
                components[field.type]({ disabled: isLoading, ...field.props })
              )}
            </FormItem>
          ))
        }

        {buttonName && <FormItem {...formLayout.button}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={this.hasErrors(getFieldsError()) || isLoading}
            loading={isLoading}
          >
            { buttonName }
          </Button>
          </FormItem>
        }


      </Form>
    )
  }
}

export default Form.create()(CreateForm);
