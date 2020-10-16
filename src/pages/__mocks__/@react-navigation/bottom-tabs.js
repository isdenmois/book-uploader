const React = require('react');

exports.createBottomTabNavigator = () => ({
  Screen(props) {
    return React.createElement('Screen', props);
  },
  Navigator({ children, ...props }) {
    return React.createElement('Navigator', props, children);
  },
});
