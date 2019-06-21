
import FormatObject from 'frontend/helpers/format-object';
export default Ember.Helper.extend({

  compute([row, columns, name]) {

    let formatObject = new FormatObject();
    if (name && columns && row){
      columns.forEach((column, i)=> {
        var patern = `{{\\W*${column}\\W*}}`;
        var re = new RegExp(patern, 'g');
        name = name.replace(re, formatObject.compute([row[i]]));
      });
    }
    return name;
  }
});
