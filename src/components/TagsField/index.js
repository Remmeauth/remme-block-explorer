import React from 'react'
import { Tag, Input, Tooltip, Icon, message } from 'antd';

import { network } from "../../config";
import { newAccountValidator } from '../../schemes/validators.js'

const { Search } = Input;

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


    try {
      fetch(`${network.backendAddress}/api/getAccount/${inputValue}`).then(res => res.json()).then(json =>{
        if (!json.producer) {
          message.error("Producer not found.", 2);
        } else {
          this.handleTags();
        }
      });
    } catch (e) {
     message.error("Data is wrong. Try again.", 2);
    }
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
          <Search
            ref={this.saveInputRef}
            placeholder=""
            enterButton="Add producer"
            size="large"
            style={{ width: 350, margin: '0 auto' }}
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
