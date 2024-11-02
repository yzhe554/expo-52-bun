import React from 'react';
import { View, ViewStyle } from 'react-native';

type DividerProps = {
  style?: ViewStyle;
};

const Divider = ({ style = {} }: DividerProps) => (
  <View
    style={{
      borderTopColor: 'black',
      borderTopWidth: 1,
      ...style,
    }}
  />
);

export default Divider;
