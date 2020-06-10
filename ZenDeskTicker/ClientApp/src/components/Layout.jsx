import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export class Layout extends Component {
  displayName = Layout.name

  render() {
    return (
      <Container alignItems="center">
        <Row>
          <Col>
            {this.props.children}
          </Col>
        </Row>
      </Container>
    );
  }
}
