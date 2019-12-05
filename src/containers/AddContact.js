import React, { Component } from "react";
import { Layout } from "antd";
import { Animated } from "react-animated-css";
import ContactService from "../services/contact.service";
import SideMenu from "../components/sideMenu";

const { Header, Content } = Layout;

export default class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formFields: {
        name: "",
        contact: "",
        address: "",
        country: "",
        imagePath: "",
        file: null
      },
      errors: {},
      contacts: []
    };
  }

  //fetch contacts from database
  getContacts = () => {
    ContactService.getContacts().then(res => {
      console.log(res.data);
      res.data.sort(function(a, b) {
        var nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB)
          //sort string ascending
          return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
      });
      this.setState({
        contacts: res.data
      });
    });
  };

  //validates name
  validateName = name => {
    console.log("inside validate name");
    var pattern = /^[a-zA-Z ]*$/;
    if (name != "" && !pattern.test(name)) {
      this.state.errors["name"] = "name can only contain alphabets";
    } else if (name != "" && pattern.test(name)) {
      this.state.errors["name"] = "";
    }
  };

  //validates mobile number
  validateMobileNumber = contact => {
    let flag = true;
    let searchList = this.state.contacts;
    for (let i = 0; i < searchList.length; i++) {
      console.log(contact);
      console.log(searchList[i].contact);
      if (contact == searchList[i].contact) {
        this.state.errors["contact"] = "contact number already exists";
        flag = false;
        break;
      }
    }

    var pattern = /^[789]\d{9}$/;
    const errors = this.state.errors;
    if (contact != "" && pattern.test(contact) && flag) {
      this.state.errors["contact"] = "";
    } else if (contact != "" && !pattern.test(contact)) {
      this.state.errors["contact"] = "Please enter valid mobile number";
    }

    this.setState({
      errors
    });
  };

  //validates each input field
  validateControl = control => {
    const errors = this.state.errors;

    if (this.state.formFields[control] == "") {
      this.state.errors[control] = `please enter ${control}`;
    } else {
      this.state.errors[control] = "";
    }
    if (control == "file" && this.state.file == null) {
      this.state.errors["file"] = "Please select image";
    } else if (this.state.file != null) {
      this.state.errors["file"] = "";
    }
    if (
      control != "file" &&
      this.state.formFields[control] != "" &&
      this.state.formFields[control].replace(/\s/g, "").length < 1
    ) {
      this.state.errors[control] = "blank spaces are not allowed";
    }
    this.setState({
      errors
    });
    console.log(errors);
  };

  //setting the file
  setFile = e => {
    this.setState({
      file: e.target.files[0]
    });
    console.log(e.target.name);
    this.validateControl(e.target.name);
  };

  //handling form submit
  handleClick = e => {
    e.preventDefault();
    let flag = true;
    const formFields = this.state.formFields;
    for (const key in formFields) {
      this.validateControl(key);
    }
    const errors = this.state.errors;
    for (const key in errors) {
      if (errors[key] != "" && key !== "imagePath") {
        flag = false;
        break;
      }
    }
    if (flag) {
      let form = new FormData();
      form.append("file", this.state.file);
      console.log(this.state.formFields);
      ContactService.addContact(form, this.state.formFields).then(res => {
        if (res.status == 201) {
          window.location.href = "/";
        }
      });
    }
  };

  //handling input field changes
  handleChange = event => {
    const formFields = this.state.formFields;
    formFields[event.target.name] = event.target.value;
    this.setState({
      formFields
    });
    if (event.target.name == "name") {
      this.validateName(event.target.value);
    }
    this.validateControl(event.target.name);
    if (event.target.name == "contact") {
      this.validateMobileNumber(event.target.value);
    }
  };

  //executed when component is mounted
  componentDidMount() {
    this.getContacts();
  }

  render() {
    return (
      <div>
        <Layout>
          <SideMenu />
          <Layout style={{ overflow: "visible" }}>
            <Header style={{ background: "#fff" }}>
              <h3 className="mt-3">Add contact</h3>
            </Header>
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                background: "#fff",
                minHeight: "100vh"
              }}
            >
              <Animated animationIn="bounceInRight 2s" isVisible={true}>
                <div className="row">
                  <div
                    className="col-lg-8 offset-lg-2"
                    style={{
                      padding: "25px",
                      boxShadow: "2px 2px 10px #ccc",
                      borderRadius: "0px 7px 7px 0px"
                    }}
                  >
                    <form>
                      <div className="form-row">
                        <div class="form-group col-md-6">
                          <label>Name</label>
                          <input
                            type="text"
                            class="form-control"
                            name="name"
                            placeholder="Name"
                            value={this.state.formFields.name}
                            onChange={this.handleChange}
                          />
                          <span className="text-danger">
                            {this.state.errors["name"]}
                          </span>
                        </div>
                        <div class="form-group col-md-6">
                          <label>Contact No</label>
                          <input
                            type="text"
                            class="form-control"
                            id="exampleInputPassword1"
                            name="contact"
                            placeholder="Contact"
                            pattern="[789][0-9]{9}"
                            required
                            value={this.state.formFields.contact}
                            onChange={this.handleChange}
                          />
                          <span className="text-danger">
                            {this.state.errors["contact"]}
                          </span>
                        </div>
                      </div>
                      <div class="form-group">
                        <label>Image</label>
                        <input
                          name="file"
                          type="file"
                          class="form-control-file"
                          onClick={this.setFile}
                          onChange={this.setFile}
                        />
                        <span className="text-danger">
                          {this.state.errors["file"]}
                        </span>
                      </div>
                      <div class="form-group">
                        <label>Address</label>
                        <textarea
                          type="text"
                          class="form-control"
                          id="exampleInputPassword1"
                          name="address"
                          placeholder="Address"
                          value={this.state.formFields.address}
                          onChange={this.handleChange}
                        />
                        <span className="text-danger">
                          {this.state.errors["address"]}
                        </span>
                      </div>
                      <div class="form-group">
                        <label>Country</label>
                        <select
                          class="form-control"
                          id="exampleFormControlSelect1"
                          name="country"
                          value={this.state.formFields.country}
                          onChange={this.handleChange}
                        >
                          <option selected value="null">
                            ---Select---
                          </option>
                          <option value="India">India</option>
                          <option value="China">China</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="Canada">Canada</option>
                        </select>
                        <span className="text-danger">
                          {this.state.errors["country"]}
                        </span>
                      </div>
                      <button
                        type="submit"
                        class="btn btn-primary"
                        onClick={this.handleClick}
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </Animated>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
