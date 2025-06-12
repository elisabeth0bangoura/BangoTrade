import React from 'react';
import PinCodeComponent from './PinCodeComponent';
import * as Haptics from 'expo-haptics';

class PinCodeContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pin: [],
      enteredPin: [],
      title: this.props.title || 'Enter your PIN',
      isError: false,
    };

    this.pinRef = React.createRef();
    this.pinIsNumber = typeof this.props.pin === 'number';
  }

  componentDidMount() {
    this.pinRef.current?.reset(); // reset dots on mount
  }

  handleNumberButtonPress = (number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const updatedPin = [...this.state.pin, number];

    this.setState({ pin: updatedPin, isError: false }, () => {
      const targetLength = this.pinIsNumber ? this.props.pin : this.props.pin?.length || 4;

      if (updatedPin.length === targetLength) {
        this.pinRef.current?.animate(); // Trigger animation

        const correctPin = !this.pinIsNumber ? this.props.pin : null;

        setTimeout(() => {
          if (!this.pinIsNumber) {
            if (correctPin.join('') === updatedPin.join('')) {
              this.setState({ pin: [] });
              this.props.onSuccess(updatedPin);
            } else {
              this.setState({ isError: true });
              setTimeout(() => {
                this.pinRef.current?.reset();
                this.setState({ pin: [], isError: false });
                this.props.onFailure();
              }, 500);
            }
          } else {
            if (this.state.enteredPin.length > 0) {
              if (this.state.enteredPin.join('') === updatedPin.join('')) {
                this.setState({ pin: [] });
                this.props.onSuccess(updatedPin);
              } else {
                this.setState({ isError: true });
                setTimeout(() => {
                  this.pinRef.current?.reset();
                  this.setState({
                    pin: [],
                    enteredPin: [],
                    title: this.props.title || 'Enter your PIN',
                    isError: false,
                  });
                  this.props.onFailure();
                }, 500);
              }
            } else {
              this.setState({
                pin: [],
                enteredPin: updatedPin,
                title: this.props.repeatTitle || 'Repeat your PIN',
              });
            }
          }
        }, 300); // Wait until animation visibly completes
      }
    });
  };

  handleDeleteButtonPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const updatedPin = [...this.state.pin];
    updatedPin.pop();
    this.setState({ pin: updatedPin, isError: false });
  };

  render() {
    return (
      <PinCodeComponent
        ref={this.pinRef}
        pin={this.state.pin}
        handleNumberButtonPress={this.handleNumberButtonPress}
        handleDeleteButtonPress={this.handleDeleteButtonPress}
        pinLength={this.pinIsNumber ? this.props.pin : this.props.pin?.length || 4}
        title={this.state.title}
        titleStyle={this.props.titleStyle}
        numpadTextStyle={this.props.numpadTextStyle}
        bulletStyle={this.props.bulletStyle}
      />
    );
  }
}

export default PinCodeContainer;
