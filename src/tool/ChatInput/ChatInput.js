import React, { Component } from "react";
import './ChatInput.scss';
import send from "../kit/send.png";
import micIcon from "../kit/mic.svg";
import listeningIcon from "../kit/voice.gif"
import { Button, Checkbox } from 'react-bootstrap';
import { speechToText, stopRecorder } from '../speech/SpeechAPI';

class ChatInput extends Component {
  state = {
    newComment: '',
    overflow: false,
    isListening: false,
    isSentItNow: false,
    recorderState: ""
  };

  static getDerivedStateFromProps(){
    return {
      overflow:false,
    }
  }

  handleNewChat = (e) => {
    e.preventDefault();
    // 輸入字串長度大於30輸入格的高度會變為100
    if (e.target.value.length > 30) {
      this.setState({
        newComment: e.target.value,
        overflow: true,
      });
    } else {
      this.setState({
        newComment: e.target.value,
        overflow: false,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.sendMessage();
  };

  sendMessage() {
    const {newComment} = this.state;
    this.props.sendMessage(newComment)
    this.setState({
      newComment: ""
    })
  }

  onKeyDown = (e) => {
    if(e.keyCode === 13 && !e.shiftKey) {
       this.handleSubmit(e);
    }
  }

  startSpeechToText() {

    if (this.state.isListening) {
      stopRecorder();
      this.setState({
        isListening: false,
        recorderState: ""
      });
      return;
    }

    speechToText({
      onStart: () => {
        console.log("listening...")
        this.setState({
          isListening: true,
          recorderState: ""
        })
      },
      onComplete: (text) => {
        this.setState({isListening: false});
      },
      onError: (msg) => {
        this.setState({isListening: false});
      }
    });
  }


  render() {
    return (
      <div className="chat-window-input">
        <div className="message_form">
          <div style={{marginLeft: "10px"}}>
            <img src={micIcon} onClick={this.startSpeechToText.bind(this)}/>
          </div>
          {this.state.isListening && <div style={{marginLeft: "10px"}}>
              <img src={listeningIcon}/>
          </div>}
          <div style={{marginLeft: "10px"}}>
              {this.state.recorderState}
          </div>
        </div>
      </div>
    );
  }
}

export default ChatInput;
