import React, { Component } from "react";
import { Layout, Menu, Card } from "antd";
import contactService from "../services/contact.service";
import Contact from "../components/contact";
import SideMenu from "../components/sideMenu";

const { Header, Content } = Layout;

export default class Favourites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favs: []
    };
  }

  handleDelete = item => {
    contactService.deleteContact(item).then(res => {
      console.log("deleted");
      this.getFavContacts();
    });
  };

  getFavContacts = () => {
    contactService.getFavContacts().then(res => {
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
        favs: res.data
      });
    });
  };

  componentDidMount = () => {
    this.getFavContacts();
  };

  render() {
    return (
      <div>
        <Layout style={{ overflow: "visible" }}>
          <SideMenu />
          <Layout style={{ overflow: "visible" }}>
            <Header style={{ background: "#fff" }}>
              <h3 className="mt-3">Favourites</h3>
            </Header>
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                background: "#fff",
                minHeight: "100vh"
              }}
            >
              {this.state.favs.map(item => {
                return (
                  <Contact
                    key={item._id}
                    id={item._id}
                    imagePath={item.imagePath}
                    name={item.name}
                    address={item.address}
                    contact={item.contact}
                    country={item.country}
                    isFav={item.isFavourite}
                  ></Contact>
                );
              })}
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
