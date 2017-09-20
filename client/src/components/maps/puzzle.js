import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Request from '../../../../helpers/requests';
import styles from '../../../../styles/maps/puzzle.css';
import { GridList } from 'material-ui/GridList';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


class Puzzle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      playerName: '',
      time: 30,
      equipped: [],
      attempts: 3
    };
  }

  componentWillMount() {
    this.setState({
      playerName: this.props.playerName,
      time: this.props.time[this.props.map + this.props.currentQuest]
    });
    Request.get('/puzzleItems', (data) => {
      this.setState({
        equipped: data
      });
    });
  }

  componentDidMount() {
    this.handleOpen();
  }

  componentWillUnmount() {
    clearInterval(interval);
    window.onbeforeunload = () => {
      clearInterval(interval);
    };
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleTimer() {
    window.interval = null;
    if (this.state.time) {
      document.getElementById('timer').style.display = 'inline-block';
      interval = setInterval(() => {
        this.setState({
          time: this.state.time - 1
        }, () => {
          if (this.state.time === 0) {
            Request.post('/lives', {lives: this.props.lives - 1}, function(data) {
              console.log(data);
            });
            this.props.handleLifeChange(this.props.lives - 1);
            this.props.handleReturntoMapClick(true);
            clearInterval(interval);
          }
        });
      }, 1000);
    } else {
      // document.getElementById('timer').style.display = 'none';
      document.getElementById('attempts').style.display = 'block';
    }
  }

  handleItemUsage() {
    // this.setState({
    //   time: this.state.time + 30
    // });
  }

  handleClose() {
    this.setState({open: false});
    this.refs.answerInput.focus();
    this.handleTimer();
  }
  render() {
    const actions = [
      <RaisedButton
        label="Close"
        primary={true}
        buttonStyle={{backgroundColor: '#F6F7EB'}}
        labelStyle={{color: '#3F88C5'}}
        onClick={this.handleClose.bind(this)}
      />
    ];

    return (
      <div>
        <div>
          <Dialog
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose.bind(this)}
            paperClassName={styles.message}
            bodyStyle={{color: 'white', fontFamily: 'monospace', fontSize: '2vw'}}
          >
            {this.props.changeName(this.props.messages[this.props.map + this.props.currentQuest])}
          </Dialog>
        </div>
        <div><RaisedButton disabledLabelColor={'black'} label={`Lives Remaining: ${this.props.lives}`} disabled={true} style={{float: 'left', marginLeft: 50}} /></div>
        <div id='timer' style={{float: 'right', display: 'none', marginRight: 50}}><RaisedButton disabledLabelColor={'black'} label={`Time Remaining: ${this.state.time} seconds`} disabled={true} /></div>
        <div id='attempts' style={{float: 'right', display: 'none', marginRight: 50}}><RaisedButton disabledLabelColor={'black'} label={`Attempts Remaining: ${this.props.attempts}`} disabled={true} /></div>
        <br />
        <br />
        <div>
          <div className={styles.puzzle_container}>
            <br />
            <div className={styles.puzzle_inner_container}>
              <div className={styles.question}>{this.props.questions[this.props.map + this.props.currentQuest]}</div>
              <br />
              <div className={styles.textField_container}>
                <TextField
                  ref="answerInput"
                  id="puzzleAnswer"
                  hintText='Your answer here'
                  underlineShow={false}
                  style={{backgroundColor: 'white', border: '2px solid #44BBA4', width: '95%', paddingLeft: '12px', paddingRight: '12px'}}
                  fullWidth ={true}
                  multiLine={true}
                />
              </div>
              <br />
              <br />
            </div>
            <div className={styles.button}>
              <RaisedButton onClick={() => this.props.handlePuzzleSubmit()} label={'Submit'} style={{width: '200px', display: 'flex', marginBottom: '5px'}}/>
            </div>
            <div className={styles.button}>
              <RaisedButton label="Return to Map" onClick={() => this.props.handleReturntoMapClick(true)} backgroundColor='#E94F37' labelColor='#F6F7EB' style={{width: '200px', display: 'flex'}}/>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Puzzle;
