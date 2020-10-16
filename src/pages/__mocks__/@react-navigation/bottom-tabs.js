const { mockComponent } = require('utils/test-utils/component');

exports.createBottomTabNavigator = () => ({
  Screen: mockComponent('Screen'),
  Navigator: mockComponent('Navigator'),
});
