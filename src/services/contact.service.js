import global from "../config/global";
import axios from "axios";

class ContactService {
  getContacts() {
    console.log("inside");
    let apiAddress = global.apiAddress;
    return axios
      .get(apiAddress + "/contact")
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        console.log(error);
        return error;
      });
  }

  getFavContacts() {
    console.log("inside");
    let apiAddress = global.apiAddress;
    return axios
      .get(apiAddress + "/contact/favs")
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        console.log(error);
        return error;
      });
  }

  addContact(form, contact) {
    console.log(contact);
    return axios
      .post(global.apiAddress + "/file", form)
      .then(function(response) {
        console.log(response.data.filePath);
        contact.imagePath = response.data.filePath;
        console.log(contact);
        return axios
          .post(global.apiAddress + "/contact", contact)
          .then(function(response) {
            return response;
          })
          .catch(function(error) {
            return error;
          });
      });
  }

  deleteContact(contact) {
    console.log(contact);
    return axios
      .post(global.apiAddress + "/contact/delete", contact)
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        return error;
      });
  }

  setFavourite(fav, id) {
    let obj = {
      fav,
      id
    };
    console.log(id);
    return axios
      .put(global.apiAddress + "/contact/setfav/" + id, obj)
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        return error;
      });
  }

  editContact(form, contact) {
    console.log(contact);
    return axios
      .post(global.apiAddress + "/file", form)
      .then(function(response) {
        console.log(response.data.filePath);
        contact.imagePath = response.data.filePath;
        console.log(contact);
        return axios
          .put(global.apiAddress + "/contact/" + contact._id, contact)
          .then(function(response) {
            return response;
          })
          .catch(function(error) {
            return error;
          });
      });
  }
}

const contact = new ContactService();
export default contact;
