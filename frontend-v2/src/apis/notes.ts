import { apiV2 } from 'boot/axios';
import apiConfig from '../helpers/apiConfig';

const fetchNote = async function (id, token, callback) {
  callback(null, true);
  apiV2.get('notes/' + id, apiConfig(token)).then((response) => {
    callback(response.data.data, false);
  });
};

const saveNote = async function (id, payload, token, callback) {
  callback(null, true);
  if (id) {
    apiV2.put('notes/' + id, payload, apiConfig(token)).then((response) => {
      callback(response.data.data, false);
    });
  } else {
    apiV2.post('notes', payload, apiConfig(token)).then((response) => {
      callback(response.data.data, false);
    });
  }
};

const deleteNote = async function (id, token, callback) {
  callback(true);
  apiV2
    .delete('notes/' + id, apiConfig(token))
    .then((response) => {
      callback(false);
    })
    .catch((error) => {
      console.log(error);
      callback(false);
    });
};
export { fetchNote, saveNote, deleteNote };
