import React, { Component } from "react";
import './ChatInput.scss';
import send from "../kit/send.png";
import micIcon from "../kit/mic.svg";
import listeningIcon from "../kit/voice.gif"
import { Button, Checkbox } from 'react-bootstrap';
import { speechToText, stopRecorder } from '../speech/SpeechAPI';
import LinearLayout from '../kit/LinearLayout';

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

        if (this.state.isSentItNow) {
          this.props.sendMessage(text);
          this.setState({
            newComment: "",
            isListening: false,
            recorderState: ""
          });
        } else {
          this.setState({
            newComment: text,
            isListening: false,
            recorderState: ""
          });
        }
      },
      onError: (msg) => {
        this.setState({
          newComment: "",
          isListening: false,
          recorderState: `${msg}`
        });
      }
    });
  }

  onChangeSentItNow() {
    this.setState({
      isSentItNow: !this.state.isSentItNow
    })
  }

  render() {
    return (
      <div className="chat-window-input">
        <div className="message_form">
          <textarea
            className="message_input"
            rows={1}
            cols={15}
            style={{ height: `${this.state.overflow ? '100px' : ''}`, width:"89%" }}
            name="message"
            value={this.state.newComment}
            onChange={this.handleNewChat}
            autoComplete="off"
            placeholder="傳送訊息 ..."
            onKeyDown={this.onKeyDown}
          />
          {/* <button className="sending_button" onClick={this.handleSubmit.bind(this)}>
            <img className="icon" src={send} alt="" />
          </button> */}
        </div>
        <LinearLayout orientation={"horizontal"} align={"left"} style={{height: "60px"}}>
          <div style={{marginLeft: "10px"}}>
            <Checkbox onClick={this.onChangeSentItNow.bind(this)} checked={this.state.isSentItNow}/>
          </div>
          <div style={{marginLeft: "10px"}}>
            <img src={micIcon} onClick={this.startSpeechToText.bind(this)}/>
          </div>
        </LinearLayout>
        <LinearLayout orientation={"horizontal"} align={"left"} style={{height: "60px"}}>
          {this.state.isListening && <div style={{marginLeft: "10px"}}>
            <img src={listeningIcon}/>
          </div>}
        </LinearLayout>
        <LinearLayout orientation={"horizontal"} align={"left"} style={{height: "60px"}}>
          <div style={{marginLeft: "10px"}}>
            {this.state.recorderState}
          </div>
        </LinearLayout>
      </div>
    );
  }
}

export default ChatInput;
