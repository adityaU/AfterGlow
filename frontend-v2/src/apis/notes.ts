import { api } from 'boot/axios';
import apiConfig from '../helpers/apiConfig'

const fetchNote =  async function(id, token, callback ) {
        callback(null, true)
        api.get('notes/' + id, apiConfig(token)).then((response) => {
                callback(response.data.data.attributes, false)
        })
}

const saveNote =  async function(id, payload, token, callback ) {
        callback(null, true)
        payload = {data: {type: 'notes', attributes: payload}}
        if (id){
                api.put('notes/' + id, payload, apiConfig(token)).then((response) => {

                        response.data.data.attributes.id = id
                        callback(response.data.data.attributes, false)
                })

        }else{
                api.post('notes/', payload, apiConfig(token)).then((response) => {
                        response.data.data.attributes.id = response.data.data.id
                        callback(response.data.data.attributes, false)
                })
        }
}

const deleteNote =  async function(id, token, callback ) {
        callback(true)
        api.delete('notes/' + id, apiConfig(token)).then((response) => {
                callback(false)
        }).catch(() => {
                callback(false)
        })
}
export {fetchNote, saveNote, deleteNote};
