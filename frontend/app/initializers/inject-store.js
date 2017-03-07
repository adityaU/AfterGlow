export function initialize(application) {
    application.inject('component', 'store', 'service:store');
    application.inject('component', 'ajax', 'service:ajax');
    application.inject('controller', 'ajax', 'service:ajax');
}

export default {
  name: 'inject-store',
  initialize
};
