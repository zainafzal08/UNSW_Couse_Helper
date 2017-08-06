import React, { Component } from 'react';
import {Navbar} from 'react-bootstrap';

class UNSWNavBar extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>{"UNSW Course Helper"}</Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    );
  }
}

export default UNSWNavBar;
