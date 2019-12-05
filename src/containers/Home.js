import React, { Component } from "react";
import { Row, Col } from "antd";
import { Layout, Icon } from "antd";
import { Animated } from "react-animated-css";
import contactService from "../services/contact.service";
import Contact from "../components/contact";
import SideMenu from "../components/sideMenu";

const { Header, Content } = Layout;

export default class Home extends Component {
  state = {
    collapsed: false,
    loading: true,
    contacts: [],
    searchList: []
  };

  handleDelete = item => {
    contactService.deleteContact(item).then(res => {
      console.log("deleted");
      this.getContacts();
    });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  getContacts = () => {
    contactService.getContacts().then(res => {
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
        contacts: res.data,
        searchList: res.data
      });
    });
  };

  handleChange = e => {
    let currentList = [];
    let newList = [];
    if (e.target.value !== "") {
      currentList = this.state.searchList;
      console.log(currentList);
      newList = currentList.filter(item => {
        const lc = item.name.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lc.includes(filter);
      });

      this.setState({
        contacts: newList
      });
    } else {
      this.setState({
        contacts: []
      });
      newList = this.state.searchList;
      this.setState({
        contacts: newList
      });
    }
  };

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
              <Row>
                <Col
                  xs={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 8, offset: 16 }}
                  xl={{ span: 8, offset: 16 }}
                >
                  <div class="input-group flex-nowrap mt-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="addon-wrapping">
                        <Icon type="search" />
                      </span>
                    </div>
                    <input
                      placeholder="search contact"
                      type="text"
                      class="form-control"
                      aria-label="Username"
                      aria-describedby="addon-wrapping"
                      onChange={this.handleChange}
                    />
                  </div>
                </Col>
              </Row>
            </Header>
            <Content
              style={{
                margin: "24px 16px 0px",
                padding: 24,
                background: "#fff",
                minHeight: "100vh"
              }}
            >
              <Animated animationIn="bounceInUp 2s" isVisible={true}>
                {this.state.contacts.map(item => {
                  return (
                    <div>
                      <Contact
                        key={item._id}
                        id={item._id}
                        imagePath={item.imagePath}
                        name={item.name}
                        address={item.address}
                        contact={item.contact}
                        country={item.country}
                        isFav={item.isFavourite}
                        delete={() => this.handleDelete(item)}
                      ></Contact>
                    </div>
                  );
                })}
              </Animated>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
