import DateTimePicker from 'ember-cli-bootstrap4-datetimepicker/components/bs-datetimepicker';
import ENV from '../config/environment';

export default DateTimePicker.extend({
  config: ENV['ember-cli-bootstrap4-datetimepicker']
});
