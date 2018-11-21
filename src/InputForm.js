import React, { Fragment, Component } from 'react';
import { connect } from "react-redux";
import { Form, Input, Icon, Button } from 'antd';

import './InputForm.css';
import { setInput } from "./actions";
const { TextArea } = Input;

// import Form from 'antd/lib/Form';  // for js
// import Input from 'antd/lib/Input';  // for js
// import Icon from 'antd/lib/Icon';  // for js
// import Button from 'antd/lib/Button';  // for js
// import 'antd/lib/form/style/css';        // for css
// import 'antd/lib/input/style/css';        // for css
// import 'antd/lib/icon/style/css';        // for css
// import 'antd/lib/button/style/css';        // for css
const FormItem = Form.Item;

class InputForm extends Component {
  constructor(props) {
    super(props)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.setInput(values.commands)
        // console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <h1>Commands</h1>
        <FormItem>
          {getFieldDecorator('commands', {
          })(
            <TextArea style={{minHeight: '300px'}}/>
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
          >
            Order
          </Button>
        </FormItem>
      </Form>
    );
  }
}
InputForm = Form.create()(InputForm);

const mapDispatchToProps = dispatch => {
  return {
    setInput: input => dispatch(setInput(input)),
  };
};
export default connect(
  null,
  mapDispatchToProps
)(InputForm);
