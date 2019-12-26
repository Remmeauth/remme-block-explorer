import React from 'react'

import { RemmeSpin, OptionList } from '../../components'
import { fetchBackend } from '../../functions/helpers'

class TagsField extends React.Component {
  state = {
    loading: true,
    producers: []
  };

  handleUpdate = async () => {
    try {
      const json = await fetchBackend('getInfo');
      if (json.producers) {
        this.setState({
          loading: false,
          producers: json.producers
        });
      }
      this.pushActions(json.producers);
    } catch (e) {
      console.log(e.message);
    }
  }

  componentDidMount() {
    this.handleUpdate();
  }

  handleChange = (items) => {
    this.props.onUpdate(items);
  }

  render() {
    const { loading, producers } = this.state;
    return (
      <div className="custom-field">
        { loading ? <RemmeSpin/> : <OptionList producers={producers} onChange={this.handleChange} values={this.props.tags} /> }
      </div>
    );
  }
}

export default TagsField;
