import React from 'react'
import { Tag, Input, Tooltip, Icon, message } from 'antd';

import { newAccountValidator } from '../../schemes/validators.js'

let errors = [];

  class TagsField extends React.Component {
    state = {
      inputVisible: false,
      inputValue: '',
    };

    handleClose = (removedTag) => {
      const { onUpdate } = this.props;
      const tags = this.props.tags.filter(tag => tag !== removedTag);
      onUpdate(tags);
    }

    showInput = () => {
      this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange = (e) => {
      this.setState({ inputValue: e.target.value });
    }


    handleTags = (m) => {
      const { onUpdate } = this.props;
      const { inputValue } = this.state;
      let { tags } = this.props;

      if (!m && !errors.length) {
        if (inputValue && tags.indexOf(inputValue) === -1) {
          tags = [...tags, inputValue];
        }
        onUpdate(tags);
        this.setState({
          inputVisible: false,
          inputValue: '',
        });
      } else if (m) {
        errors.push(m);
        message.error(m);
      }
    }

    handleInputConfirm = () => {
      const {inputValue} = this.state;
      errors = [];
      newAccountValidator({}, inputValue, this.handleTags )
    }

    saveInputRef = input => this.input = input

    render() {
      const { tags } = this.props;
      const { inputVisible, inputValue } = this.state;
      return (
        <div className="custom-field">
          {tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag key={tag} closable={true} onClose={() => this.handleClose(tag)}>
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </Tag>
            );
            return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
          })}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag
              onClick={this.showInput}
              style={{ background: '#fff', borderStyle: 'dashed' }}
            >
              <Icon type="plus" /> Add Producer
            </Tag>
          )}
        </div>
      );
    }
  }


export default TagsField;
