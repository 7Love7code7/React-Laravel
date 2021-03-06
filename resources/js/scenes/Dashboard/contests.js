/* eslint-disable no-case-declarations */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {
  Component, Fragment
} from 'react';
import {
  Row, Col,
  Button
} from 'reactstrap';
import {
  withRouter
} from 'react-router-dom';

import Bitmaps from '../../theme/Bitmaps';

import Menu from '../../components/Menu';

import Api from '../../apis/app';

class Contests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contests: [],
      participants: []
    }
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem('auth'));
    
    const data = await Api.get('get-contests', {member_id: user.user.member_info.id});
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          contests: body.contests,
          participants: body.participants
        });
        break;
      default:
        break;
    }
  }

  handleAttend(id) {
    this.props.history.push('/contests/attend', id);
  }

  handleSignout() {
    localStorage.removeItem('auth');

    this.props.history.push('/signin');
  }

  render() {
    const { contests, participants } = this.state;
    
    return (
      <Fragment>
        <div className="top-header tile-top-bar">
          <a href="/">
            <img src={Bitmaps.logo} alt="Cot10" />
          </a>
          <a
            className="mt-3 mr-5"
            style={{float:"right",cursor:"pointer"}}
            onClick={this.handleSignout.bind(this)}
          >
            <i className="fa fa-user"></i> Sign Out
          </a>
        </div>

        <Menu type="member" />

        <div className="dashboard container">
          {
            contests.length > 0 && (
              <Row>
                {
                  contests.map((item, index) => (
                    <Col className="d-flex contest" sm="12" md="6" key={index}>
                      <div className="mx-3 my-2">
                        <img src={Bitmaps.contest} />
                      </div>
                      <div className="mx-3 my-2">
                        <h4>{item.name}</h4>
                        <hr className="my-1" />
                        <Row>
                          <Col sm="6" className="text-right">Major Category:</Col>
                          <Col sm="6">{item.major}</Col>
                        </Row>
                        <Row>
                          <Col sm="6" className="text-right">Sub Category:</Col>
                          <Col sm="6">{item.sub}</Col>
                        </Row>
                        <Row>
                          <Col sm="6" className="text-right">Start Date:</Col>
                          <Col sm="6">{item.start_date}</Col>
                        </Row>
                        <Row>
                          <Col className="text-center mt-2" sm="12">
                            {
                              participants.filter(obj => obj.contest_id == item.id).length > 0 ? (
                                <span>
                                  <i className="fa fa-check"></i> Accepted
                                </span>
                              ) : (
                                <Button
                                  color="success"
                                  type="button"
                                  onClick={this.handleAttend.bind(this, item.id)}
                                >
                                  <i className="fa fa-user" /> Accept Contest
                                </Button>
                              )
                            }
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  ))
                }
              </Row>
            )
          }
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Contests);