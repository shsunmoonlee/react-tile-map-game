import React, { Fragment, Component } from 'react';
import { connect } from "react-redux";
// import logo from './logo.svg';
// import './App.css';
import { Row, Col, Layout, Menu, Breadcrumb, Icon } from 'antd';
import {XYPlot, XAxis, YAxis, Hint, VerticalGridLines, HorizontalGridLines, MarkSeries} from 'react-vis';

import 'antd/dist/antd.css';
import InputForm from './InputForm'
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      robots: [],
      lostGrid: null,
      value: null,
      chartData: []
    }
    this.onKeyDown = this.onKeyDown.bind(this)
    this._rememberValue = this._rememberValue.bind(this);
    this._forgetValue = this._forgetValue.bind(this);
  }
  componentDidMount() {
// 5 3
// 1 1 E
// RFRFRFRF
//
// 3 2 N
// FRRFLLFFRRFLL
//
// 0 3 W
// LLFFFLFLFL
    // Sample Input
// 5 3
// 1 1 E
// RFRFRFRF
// 3 2 N
// FRRFLLFFRRFLL
// 0 3 W
// LLFFFLFLFL
    // Sample Output
    // 1 1 E
    // 3 3 N LOST
    // 2 3 S
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.input !== prevProps.input) {
      this.parseInput(this.props.input)
    }
  }
  parseInput(string) {
    // two lines of input
    let gridX, gridY
    let robots = string.split('\n\n')
    let lostGrids = []
    robots = robots.map((robot, index) => {
      let lines = robot.split('\n')
      let location, commands
      let outOfBounds = false
      if(index === 0) { // first paragraph has gridX, gridY at first line
        [gridX, gridY] = lines[0].split(' ')
        location = lines[1]
        commands = lines[2]
      } else {
        location = lines[0]
        commands = lines[1]
      }
      let [ x, y, direction ] = location.split(' ')
      x = Number(x)
      y = Number(y)
      const move = (direction, command, x, y) => {
        let commandsMap = {
          N: {
            L: 'W',
            R: 'E',
            F: {x, y: y+1},
          },
          E: {
            L: 'N',
            R: 'S',
            F: {x: x+1, y},
          },
          S: {
            L: 'E',
            R: 'W',
            F: {x, y: y-1},
          },
          W: {
            L: 'S',
            R: 'N',
            F: {x: x-1, y},
          }
        }

        return commandsMap[direction][command]
      }

      const isOutOfBounds = ({x, y}) => {
        if(x > gridX || x < 0 || y > gridY || y < 0 ) {
          // outOfBounds = true

          return true
        } else {
          return false
        }
      }
      for(let command of commands.split('')) {
          if(command === 'L') {
            direction = move(direction, command, x, y)
          } else if(command === 'R') {
            direction = move(direction, command, x, y)
          } else if(command === 'F') {
            if(lostGrids.some(item =>  JSON.stringify(item) === JSON.stringify({x,y})) && isOutOfBounds(move(direction, command, x, y))) { // next move is in the recorded lostGrids. next move makes rover fall off. we ignore the case and continue follwing commands
            } else if(!lostGrids.some(item =>  JSON.stringify(item) === JSON.stringify({x,y})) && isOutOfBounds(move(direction, command, x, y))) { // next move will make rover fall off. we end it here. ignore the rest of commands.
              outOfBounds = true;
              if(!lostGrids.includes({x,y})) {
                lostGrids.push({x,y})
              }
              break;
            } else {
              ({x, y} = move(direction, command, x, y))
            }
          }

      }
      // ones that made it without falling off
      return { x, y, direction, outOfBounds, index: index + 1 }
    })

    // let directions = ['N', 'E', 'S', 'W']
    this.output(robots)
    this.setState({gridX, gridY, robots })
  }
  output(robots) {
    let answer = ''
    for(let robot of robots) {
      answer += `${robot.x} ${robot.y} ${robot.direction} ${robot.outOfBounds ? 'LOST' : ''}\n`
    }
    this.setState({answer})
    return answer
  }
  onKeyDown(e) {
    // left = 37
    // up = 38
    // right = 39
    // down = 40
    // console.log("onKeyDown", e.key, e.charCode)
    // e.keyCode
  }
  _rememberValue(value) {
    this.setState({value});
  }

  _forgetValue() {
    this.setState({
      value: null
    });
  }
  render() {
    const {value} = this.state;

    return (
      <Fragment>
        <Row type="flex" justify="center" style={{textAlign: 'center', lineHeight: '64px'}}>
          <Col span={5}>
            <div style={{fontFamily: 'karla', color: 'inherit', fontSize: '33px', fontWeight: '400'}}>
              Mars Rover
            </div>
          </Col>
        </Row>
        <Layout.Content
          onKeyDown={this.onKeyDown}
        >
        <Row type="flex" justify="center">
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 12, offset: 0}}
            lg={{ span: 6, offset: 0 }}
            xl={{ span: 4, offset: 0 }}
            xxl={{ span: 4, offset: 0 }}
            style={{cursor: 'pointer'}}
          >
            <Row type="flex" justify="center">
              <Col span={24}>
                <InputForm />
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span={24}>
                {this.state.answer && <Fragment><h1>Answer</h1><div style={{whiteSpace: 'pre-line'}}>{this.state.answer}</div></Fragment>}
              </Col>
            </Row>
          </Col>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 12, offset: 0}}
            lg={{ span: 18, offset: 0 }}
            xl={{ span: 18, offset: 0 }}
            xxl={{ span: 18, offset: 0 }}
            style={{cursor: 'pointer'}}
          >
            <h1>Robots</h1>
            <XYPlot
              width={700}
              height={700}
              xDomain={[0, this.state.gridX]}
              yDomain={[0, this.state.gridY]}
              >
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis title="X" tickFormat={v => v} tickLabelAngle={-45}/>
              <YAxis title="Y" tickFormat={v => v} tickLabelAngle={-45}/>
              <MarkSeries
                onValueMouseOver={this._rememberValue}
                onValueMouseOut={this._forgetValue}
                strokeWidth={2}
                opacity="0.8"
                sizeRange={[0, 15]}
                data={this.state.robots}
              />
              {value ?
                <Hint
                  value={{
                    name: `robot ${value.index}`,
                    x: value.x,
                    y: value.y,
                    direction: value.direction,
                    status: value.outOfBounds ? 'LOST' : 'IN CONTROL',
                    size: 10,
                  }}
                  style={{
                    fontSize: 14,
                    text: {
                      display: 'none'
                    },
                    value: {
                      color: 'red'
                    }
                }}/> :
                null
              }
            </XYPlot>
          </Col>
        </Row>
        </Layout.Content>
        <Footer style={{ textAlign: 'center' }}>
          Created By Seunghun Lee
        </Footer>
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    input: state.input
  };
};

export default connect(
  mapStateToProps,
  null
)(App);
