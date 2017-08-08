export function initialize(application) {
    application.inject('component', 'store', 'service:store');
    application.inject('component', 'ajax', 'service:ajax');
    application.inject('controller', 'ajax', 'service:ajax');
    application.inject('controller', 'theme', 'service:theme');
    application.inject('component', 'theme', 'service:theme');
}

export default {
  name: 'inject-store',
  initialize
};
