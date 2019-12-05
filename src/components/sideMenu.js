import React, { Component } from "react";
import { Icon } from "antd";
import { Layout, Menu } from "antd";
import { BrowserRouter as Router, Link } from "react-router-dom";

const { Sider } = Layout;

export default class sideMenu extends Component {
  state = {
    collapsed: false
  };

  //triggering side menu
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  render() {
    return (
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo"></div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1">
            <Icon type="home" />
            <span>Home</span>
            <Link to="/" />
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="plus" />
            <span>Add Contact</span>
            <Link to="/addContact" />
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="star" />
            <span>Favourites</span>
            <Link to="/favourites" />
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}
