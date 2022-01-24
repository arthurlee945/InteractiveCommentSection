import React, {Component, useEffect, useState} from "react";
import './App.scss';
import data from './data.json';
const currentUser = data.currentUser;


class App extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    let comments = data.comments.map(comment => <Comments  key ={comment.id} userComment = {comment} commentBox = "comment"/>);

    return(
    <div id="mainSection">
      {comments}
    </div>
    );
  }
}


class Comments extends React.Component{
  constructor(props){
    super(props);
    this.state={
      count: this.props.userComment.score,
      current: false,
      reply: false,
      comment: this.props.commentBox,
      addedReply: "",
      click: false,
      delete:false,
      idNumber: this.props.userComment.id,
      deleteId: "",
      edit: false,
      popOrNot:false,
      editedText: this.props.userComment.content
    }
    this.handleClick = this.handleClick.bind(this);
    this.checkCurrentUser = this.checkCurrentUser.bind(this);
    this.clickReply = this.clickReply.bind(this);
    this.actualReply = this.actualReply.bind(this);
    this.editContent = this.editContent.bind(this);
    this.deleteBoxClick = this.deleteBoxClick.bind(this);
    this.giveMeTheBox = this.giveMeTheBox.bind(this);
    this.editedContent = this.editedContent.bind(this);
    this.assignEdited = this.assignEdited.bind(this);
  }

  componentDidMount(){
    this.setState({
      addedReply: this.props.userComment.replies.map(reply => <Comments key ={reply.id} userComment ={reply} giveMeTheBox = {this.giveMeTheBox} boxStyle ="replyStyle" username = {this.props.userComment.user.username} commentBox = "reply" textBox ="textStyle"/>)
    });
    this.checkCurrentUser();
  }

  componentDidUpdate(){
    if(this.state.delete){
      this.props.userComment.replies = this.props.userComment.replies.filter(reply=> reply.id != this.state.deleteId)
    }

    if(this.state.click || this.state.delete){
      this.setState({
        deleteContent:"",
        click:false,
        delete:false,
        edit: false,
        addedReply: this.props.userComment.replies.map(reply => <Comments  key ={reply.id}  yesOrNo = {this.props.yesOrNo} giveMeTheBox= {this.giveMeTheBox} userComment ={reply} boxStyle ="replyStyle" username = {this.props.userComment.user.username} commentBox = "reply" textBox ="textStyle"/>)
      });
    }
  }

  handleClick = (e) =>{
    e.target.id =="up"? this.setState({count: this.state.count+1}) : this.setState({count: this.state.count-1})
  };

  checkCurrentUser=()=>{
    if(this.props.userComment.user.username == currentUser.username){
      this.setState({
        current: !this.state.current
      })
    }
  }

  clickReply(){
    this.setState({
      reply:true
    })
  }
  actualReply(){
    this.setState({
      click:true,
      reply:false
    })
  }

  deleteBoxClick(e){
    if(e.target.className == "yes"){
      this.setState({
        delete:true,
        popOrNot:false
      });
    
    }
    else{
      this.setState({
        delete:false,
        popOrNot:false
      })
    }
  }

  giveMeTheBox(e){
    this.setState({
      popOrNot:true,
      deleteId: e.target.getAttribute("value")
    })
  }

  editContent(){
    this.setState({
      edit:true
    })
  }

  editedContent(e){
    this.setState({
      editedText: e.target.value
    })
  }

  assignEdited(){
    this.props.userComment.content = this.state.editedText;
    this.setState({
      edit:false
    })
  }
  
  render(){
    let user = this.props.userComment.user.username;
    let replyB = this.state.reply? this.state.comment =="comment" ? <Reply user = {this.props.userComment} username = {user} onClick ={this.actualReply}/> : <Reply user = {this.props.userComment} boxWidth="replyLength" username = {user} onClick ={this.actualReply}/> : "";
    let userTag = this.state.comment === "reply" ? `@${this.props.username} `:"";
    let currentTag = this.state.current? <p className = "tag">you</p> :"";
    
    let userOrNot = (this.state.current? <div className ="currentUserEdit"><i id ="trash" className="fas fa-trash-alt" onClick = {this.props.giveMeTheBox} value = {this.state.idNumber}> Delete</i><i id ="edit" className="fas fa-edit" onClick = {this.editContent}> Edit</i></div> :<i onClick = {this.clickReply} id = "reply" className="fas fa-reply"> Reply</i>)

    let popDeleteBox = this.state.popOrNot? (<div className = "deleteContainer">
    <div className ="deleteBox" >
        <h2 className = "deleteHeader">Delete comment</h2>
        <p className="question">Are you sure you want to delete this comment? This cannot be undone.</p>
        <div className = "deleteButtons">
          <div onClick = {this.deleteBoxClick} className = "no">NO</div>
          <div onClick = {this.deleteBoxClick} className = "yes">YES</div>
        </div>
      </div>
    </div>) : "";

    let editBox = this.state.edit? (<div className ="editComment">
      <textarea className = "editBox" maxLength = "225" onChange = {this.editedContent} value = {this.state.editedText} required></textarea><div className = "updateBtn" onClick = {this.assignEdited}>Update</div>
    </div>): (<div className ="comment" id = {this.props.textBox}>
    <p className ="text" ><a href = {`#${this.props.username}`} className = "userStyle">{userTag}</a>{this.props.userComment.content}</p>
  </div>);


    return(
      <div>
        {popDeleteBox}
        <div id = "thread">
        <div className="commentBox" id={this.props.boxStyle}>
          <div id = "karma">
            <i id ="up" className="fas fa-plus" onClick = {this.handleClick}></i>{this.state.count}<i id="down" className="fas fa-minus" onClick = {this.handleClick}></i>
          </div>
          <div id = "mainComment">
            <div id = "info">
              <div className="userInfo" id = {user}>
                  <img id = "userimg" src = {require(`${this.props.userComment.user.image.webp}`)} alt="userImg"/>
                  <a href="#" className = "username" id ={this.props.userComment.user.username}>{this.props.userComment.user.username}</a>
                  {currentTag}
                  <p id = "createdAt">{this.props.userComment.createdAt}</p>
              </div>
              <div>
                {userOrNot}
              </div>
            </div>
            {editBox}
          </div>
        </div>
          {replyB}
        <div className = {this.state.comment == "comment"?"replyBox": "noBoxStyle" }>
          <div className = {this.state.comment == "comment"? "replyBorder":"noBorderStyle"}>
          </div>
          <div>
            {this.state.addedReply}
          </div>
        </div>
        </div>
      </div>
    )
  }
}



function Reply(props){
  const[reply, setReply] = useState("")
  const handleChange = (e) => {
    setReply(e.target.value)
    if(e.target.value.length === 225){
      alert("You reached character limits!")
    }
  }
  
  const randomId = Math.floor(Math.random()*10000000000+5)
  let replyComp = {
    "id": randomId,
    "content": reply,
    "createdAt": "now",
    "score": 0,
    "replyingTo": props.username,
    "user": {
      "image": { 
        "png": currentUser.image.png,
        "webp": currentUser.image.webp,
      },
      "username": currentUser.username
    },
    "replies": []
  }

  const combined=(e)=>{
    btnPressReply();
    props.onClick(e);
  };
  const btnPressReply=()=>{
    props.user.replies.unshift(replyComp);
  };
  
  return(
    <div className ="actualReplyBox"  id={props.boxWidth}>
      <img id ="replyImg" src = {require(`${currentUser.image.png}`)} alt="currentUserImg"/>
      <textarea required id = "reply" maxLength = "225" type = "text" onChange = {handleChange} value = {reply}></textarea>
      <button id = "replyBtn" onClick ={combined}>Reply</button>
    </div>
  )
}

export default App;


//<p id = "signature">Coded by <a href="#">Arthur Lee</a>.</p>

