/**
 * Defines the React 16 Adapter for Enzyme.
 *
 * @link http://airbnb.io/enzyme/docs/installation/#working-with-react-16
 * @copyright 2017 Airbnb, Inc.
 */
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const EventEmitter = require('wolfy87-eventemitter');

enzyme.configure({ adapter: new Adapter() });

require('jsdom-global/register');

class MockImage {
  source = '';
  ee = new EventEmitter();
  constructor() {
    this.ee.defineEvents(['load', 'error']);
  }

  set src(value) {
    this.source = value;
    if (value === 'success.png') {
      this.ee.emitEvent('load');
    } else {
      this.ee.emitEvent('error');
    }
  }

  addEventListener(event, callback) {
    this.ee.addListener(event, callback);
  }

  get src() {
    return this.source;
  }
}

global.Image = MockImage;
