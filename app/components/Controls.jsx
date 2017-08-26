import React, { PureComponent } from 'react';
import { func } from 'prop-types';
import throttle from 'lodash/throttle';

import OptionSlider from './stateless/OptionSlider';
import OptionColorPicker from './stateless/OptionColorPicker';

export default class Controls extends PureComponent {
  static propTypes = {
    updateOptions: func.isRequired
  };

  delayedChange = throttle((options) => {
    this.props.updateOptions(options);
  }, 50);

  constructor(props) {
    super(props);
    this.state = {
      showColorPicker: false,
      showPulseColorPicker: false
    }
  }

  closeDropdown(id) {
    const capitalized = id[0].toUpperCase() + id.slice(1);
    const property = `show${capitalized}Picker`;
    this.setState((prev) => ({ [property]: false }));
  }

  toggleDropdown(id) {
    if (id === 'color') {
      this.setState((prev) => ({
          showColorPicker: !prev.showColorPicker,
          showPulseColorPicker: false
        }
      ));
    }
    else if (id === 'pulseColor') {
      this.setState((prev) => ({
        showColorPicker: false,
        showPulseColorPicker: !prev.showPulseColorPicker
      }));
    }
  }

  render() {
    const delayedChange = this.delayedChange.bind(this);
    const { options } = this.props;
    const { showColorPicker, showPulseColorPicker } = this.state;

    return (
      <div >
        <span className='subtitle' ><span className='icon' ><i className='fa fa-cogs' /></span > Options</span >
        <hr />
        <OptionSlider property="delay" onOptionChange={(delay) => delayedChange({ delay })}
                      min={1} max={800} option={options.delay} />

        <OptionSlider property="weight" onOptionChange={(weight) => delayedChange({ weight })}
                      min={1} max={20} option={options.weight} />

        <div className="columns" >
          <div className="column is-6" >
            <OptionSlider property="dashArray[0]"
                          onOptionChange={(dashArrayX) => delayedChange({ dashArray: [dashArrayX, options.dashArray[1]] })}
                          min={1} max={100} option={options.dashArray[0]} />
          </div >

          <div className="column is-6" >
            <OptionSlider property="dashArray[1]"
                          onOptionChange={(dashArrayY) => delayedChange({ dashArray: [options.dashArray[0], dashArrayY] })}
                          min={1} max={100} option={options.dashArray[1]} />
          </div >
        </div >
        <div className="columns is-mobile" >
          <div className="column is-centered is-6" >
            <OptionColorPicker onClick={() => this.toggleDropdown('color')} onBlur={() => this.closeDropdown('color')}
                               display={showColorPicker} property="color" option={options.color}
                               onChange={(color) => delayedChange({ color })} />
          </div >
          <div className="column is-centered is-6" >
            <OptionColorPicker onClick={() => this.toggleDropdown('pulseColor')}
                               display={showPulseColorPicker} property="pulseColor"
                               option={options.pulseColor} align="right" onBlur={() => this.closeDropdown('pulseColor')}
                               onChange={(pulseColor) => delayedChange({ pulseColor })} />
          </div >
        </div >
      </div >
    )
  }
}