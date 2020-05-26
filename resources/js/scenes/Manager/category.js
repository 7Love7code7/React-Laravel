import React, { Component, Fragment } from 'react';

import {
  withRouter
} from 'react-router-dom';

import {
  Row, Col,
  FormGroup, Alert,
  Label, Input, Button
} from 'reactstrap';
import Select from 'react-select';
import { List } from 'semantic-ui-react'

import Api from '../../apis/app';

import TopBar from '../../components/TopBar';
import Menu from '../../components/Menu';

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      major: [],
      sub: [],
      cat_parent: null,
      cat_name: ''
    }
  }

  async componentDidMount() {
    const data = await Api.get('categories');
    const { response, body } = data;
    switch (response.status) {
      case 200:
        let parent = [];
        parent.push({
          name: 'No select',
          value: 0
        });

        for (let i in body.major) {
          let cat = {
            name: body.major[i].name,
            value: body.major[i].id
          }

          parent.push(cat);
        }
      
        this.setState({
          major: body.major,
          sub: body.sub,
          parent
        });
        break;
      default:
        break;
    }
  }

  async handleAddCategory() {
    const { cat_parent, cat_name } = this.state;
    
    if (cat_name != '') {
      const params = [];

      params.parent_id = cat_parent ? cat_parent.value : 0;
      params.name = cat_name;

      const data = await Api.post('create-category', params);
      const { response, body } = data;
      switch (response.status) {
        case 200:
          let parent = [];
          parent.push({
            name: 'No select',
            value: 0
          });

          for (let i in body.major) {
            let cat = {
              name: body.major[i].name,
              value: body.major[i].id
            }

            parent.push(cat);
          }

          this.setState({
            alertVisible: true,
            messageStatus: true,
            message: body.message,
            major: body.major,
            sub: body.sub,
            parent,
            cat_parent: null,
            cat_name: ''
          });

          setTimeout(() => {
            this.setState({ alertVisible: false });
          }, 2000);
          break;
        case 422:
          this.setState({
            alertVisible: true,
            messageStatus: false,
            message: body.data
          });

          setTimeout(() => {
            this.setState({ alertVisible: false });
          }, 2000);
          break;
        default:
          break;
      }
    }
  }

  render() {
    const { 
      major, sub, 
      parent, cat_parent, cat_name
    } = this.state;

    return (
      <Fragment>
        <TopBar type="contest" />

        <Menu type="contest" />
        
        <div className="dashboard container">
          <Row>
            <Col sm="6">
              {
                this.state.alertVisible && (
                  <div className="w-100 mb-5">
                    <Alert color={this.state.messageStatus ? 'success' : 'warning'} isOpen={this.state.alertVisible}>
                      {this.state.message}
                    </Alert>
                  </div>
                )
              }

              <FormGroup row>
                <Label for="parent" sm="4" className="text-right">Major Categories:</Label>
                <Col sm="8">
                  <Select
                    classNamePrefix="react-select-lg"
                    options={parent}
                    getOptionValue={option => option.value}
                    getOptionLabel={option => option.name}
                    value={cat_parent}
                    onChange={(option) => {
                      this.setState({
                        cat_parent: option
                      });
                    }}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="name" sm="4" className="text-right">Category Name:</Label>
                <Col sm="8">
                  <Input
                      type="text"
                      sm="8"
                      placeholder="Category Name"
                      value={cat_name}
                      onChange={(name) => {
                        this.setState({
                          cat_name: name.target.value
                        });
                      }}
                    />
                </Col>
              </FormGroup>
              <FormGroup className="text-center">
                <Button
                  color="success"
                  type="button"
                  onClick={this.handleAddCategory.bind(this)}
                >
                  <i className="fa fa-plus-circle" /> New Category
                </Button>
              </FormGroup>
            </Col>
            <Col sm="6">
              {
                major && major.length > 0 && (
                  <List>
                    {
                      major.map((item, index) => (
                        <List.Item key={index}>
                          <List.Icon name="minus" />
                          <List.Content>
                            <List.Header>{item.name}</List.Header>
                            {
                              sub.filter(child => child.parent_id == item.id).length > 0 && (
                                <List.List>
                                  {
                                    sub.filter(child => child.parent_id == item.id).map((subitem, key) => (
                                      <List.Item key={key}>
                                        <List.Icon name="minus" />
                                        <List.Content>
                                          <List.Header>{subitem.name}</List.Header>
                                        </List.Content>
                                      </List.Item>
                                    ))
                                  }
                                </List.List>
                              )
                            }
                          </List.Content>
                        </List.Item>
                      ))
                    }
                  </List>
                )
              }
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Category);