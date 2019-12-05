import React, { Component } from "react";
import { Card, Icon, Avatar, Col, Button } from "antd";
import { Drawer, Divider, Row, Modal, Switch } from "antd";
import ContactService from "../services/contact.service";

const { Meta } = Card;

const pStyle = {
  fontSize: 16,
  color: "rgba(0,0,0,0.85)",
  lineHeight: "24px",
  display: "block",
  marginBottom: 16
};

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: "22px",
      marginBottom: 7,
      color: "rgba(0,0,0,0.65)"
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: "inline-block",
        color: "rgba(0,0,0,0.85)"
      }}
    >
      {title} :
    </p>
    {content}
  </div>
);

export default class contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      modal2Visible: false,
      modal21Visible: false,
      formFields: {
        _id: "",
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

    console.log(props);
  }

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

  validateControl = control => {
    const errors = this.state.errors;
    console.log(errors);
    console.log(this.state.formFields);

    if (this.state.formFields[control] == "") {
      this.state.errors[control] = `please enter ${control}`;
    } else if (this.state.formFields[control] == null && control == "file") {
      this.state.errors["file"] = "please choose a file";
    } else if (this.state.file == null) {
      this.state.errors["file"] = "please choose a file";
    } else if (this.state.file != null) {
      this.state.errors["file"] = "";
    } else {
      this.state.errors[control] = "";
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

    console.log(this.state.formFields);
    console.log(errors);
  };

  onSwitch = checked => {
    console.log(checked);
    console.log(this.props.id);
    let id = this.props.id;

    ContactService.setFavourite(checked, id).then(res => {
      if (res.status == 200) {
        window.location.href = "/favourites";
      }
    });
  };

  // loading animation
  showSkeleton = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
  };

  // setting the file
  setFile = e => {
    this.setState({
      file: e.target.files[0]
    });
    this.validateControl(e.target.name);
  };

  // handle form submit
  handleClick = e => {
    e.preventDefault();
    let flag = true;
    const formFields = this.state.formFields;
    for (const key in formFields) {
      this.validateControl(key);
    }
    const errors = this.state.errors;
    console.log(errors);
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
      ContactService.editContact(form, this.state.formFields).then(res => {
        if (res.status == 201) {
          window.location.href = "/";
        }
      });
    }
  };

  //handle form input field change
  handleChange = event => {
    const formFields = this.state.formFields;
    console.log(formFields);
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

  //executes when component is mounted
  componentDidMount = () => {
    this.setState({
      formFields: {
        _id: this.props.id,
        name: this.props.name,
        address: this.props.address,
        contact: this.props.contact,
        address: this.props.address,
        imagePath: this.props.imagePath,
        country: this.props.country
      }
    });
    this.showSkeleton();
    this.getContacts();
  };

  //for opening side drawer
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  //for closing side drawer
  onClose = () => {
    this.setState({
      visible: false
    });
  };

  //set visibility of first modal
  setModal1Visible(modal1Visible) {
    this.setState({ modal1Visible });
  }

  //set visibility of second modal
  setModal2Visible(modal2Visible) {
    this.setState({ modal2Visible });
  }

  render() {
    return (
      <div>
        <Col
          xs={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
          xl={{ span: 8 }}
        >
          <Card
            loading={this.state.loading}
            style={{
              margin: 10,
              boxShadow: "2px 2px 10px #ccc",
              borderRadius: "0px 7px 7px 0px"
            }}
            actions={[
              <Icon type="ellipsis" key="ellipsis" onClick={this.showDrawer} />,
              <Icon
                type="edit"
                key="edit"
                theme="twoTone"
                twoToneColor="#1890ff"
                onClick={() => this.setModal2Visible(true)}
              />,
              <Icon
                type="delete"
                key="delete"
                theme="twoTone"
                twoToneColor="red"
                onClick={() => this.setModal1Visible(true)}
              />
            ]}
          >
            <Meta
              style={{ marginTop: 10 }}
              avatar={
                <Avatar
                  style={{ marginTop: 3 }}
                  size={84}
                  src={require(`../../../server/public/${this.props.imagePath}`)}
                ></Avatar>
              }
              title={this.props.name}
              description={
                <a href={"tel:" + this.props.contact}>{this.props.contact}</a>
              }
            />
            <p style={{ marginTop: -25 }}>{this.props.country}</p>
          </Card>
        </Col>
        <Drawer
          width={300}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <h2
            style={{
              ...pStyle,
              textAlign: "left",
              marginBottom: 24,
              fontSize: 20
            }}
          >
            User Profile
          </h2>
          <Row>
            <Col span={12} offset={5}>
              <Avatar
                size={180}
                src={require(`../../../server/public/${this.props.imagePath}`)}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ marginTop: "20px" }}>
              <Row>
                <Col span={12} offset={8}>
                  <DescriptionItem
                    title={<Icon type="user"></Icon>}
                    content={this.props.name}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12} offset={8}>
                  <DescriptionItem
                    title={<Icon type="phone"></Icon>}
                    content={
                      <a href={"tel:" + this.props.contact}>
                        {this.props.contact}
                      </a>
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12} offset={8}>
                  <DescriptionItem
                    title={<Icon type="global"></Icon>}
                    content={this.props.country}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Divider />

          <Row>
            <Col span={6}>
              <p>Favourite: </p>
            </Col>
            <Col span={6}>
              {this.props.isFav && (
                <Switch defaultChecked onChange={this.onSwitch} />
              )}
              {!this.props.isFav && <Switch onChange={this.onSwitch} />}
            </Col>
          </Row>
        </Drawer>

        {/* modal */}
        <Modal
          title="Edit Contact"
          centered
          visible={this.state.modal2Visible}
          onOk={() => this.setModal2Visible(false)}
          onCancel={() => this.setModal2Visible(false)}
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
                <span className="text-danger">{this.state.errors["name"]}</span>
              </div>
              <div class="form-group col-md-6">
                <label>Contact No</label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleInputPassword1"
                  name="contact"
                  placeholder="Contact"
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
                name="imagePath"
                type="file"
                class="form-control-file"
                onChange={this.setFile}
              />
              <span className="text-danger">{this.state.errors["file"]}</span>
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
        </Modal>

        <Modal
          title="Confirm Delete Contact"
          centered
          visible={this.state.modal1Visible}
          onOk={() => this.setModal1Visible(false)}
          onCancel={() => this.setModal1Visible(false)}
        >
          <Button type="danger" onClick={() => this.props.delete()}>
            Delete
          </Button>
        </Modal>
      </div>
    );
  }
}
