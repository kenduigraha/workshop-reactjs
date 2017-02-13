// statefull
var CommentBox = React.createClass({
  getInitialState: function(){
    return {data: []}
  },
  //custom function
  loadComments: function(){
    console.log(this.props.url);
    $.ajax({
      url: this.props.url,
      dataType: 'JSON',
      // cache: false,
      success: function(res_data){
        console.log(res_data);
        this.setState({
          data: res_data
        })
      }.bind(this),// for point parent this : CommentBox
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  componentDidMount: function(){// function name from React
    this.loadComments()
    console.log('didmount');
  },
  // componentDidUpdate : function (prevProps, prevState) {
  //   console.log(prevProps, "prevProps");
  //   console.log(prevState, "prevState");
  //   console.log(`aa`);
  // },
  // componentWillReceiveProps : function (nextProps) {
  //   console.log(nextProps);
  //   console.log('bb');
  //   this.loadComments()
  // },
  handleCommentSubmit: function(comment){
    var comments = this.state.data
    comment.id = Date.now()
    var newComments = comments.concat([comment])
    // console.log(newComments);
    this.setState({
      data: newComments
    })

    $.ajax({
      url: this.props.url,
      dataType: 'JSON',
      type: 'POST',
      data: comment,
      success: function(res_new_data){
        this.setState({
          data: res_new_data
        })
      }.bind(this),
      error: function(xhr, status, err){
        this.setState({
          data: comments
        })
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    })
  },
  // render: function(){
  //   return(
  //     <div className="commentBox">
  //       <h1>Comments App</h1>
  //       <CommentList data={this.state.data}/>
  //       <CommentForm onCommentSubmit={this.handleCommentSubmit} />
  //     </div>
  //   )
  // }
  //alternative:
  handleDeleteComment(data){
    let deleted_id = data.id
    var comments = this.state.data

    // remove state yang diinginkan
    this.setState({
      data: comments.filter(comment => comment.id != deleted_id)
    })
    
    $.ajax({
      url: this.props.url+'/'+deleted_id,
      method: "DELETE",
      success: function(response) {
        console.log(response);
        this.setState({
          data: response
        })
      }.bind(this),
      error: function(xhr, status, err){
        this.setState({
          data: comments
        })
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    })
  },
  render (){
    return(
      <div className="mui-container">
        <h1>Comments App</h1>
        <CommentList data={this.state.data} onEditComment={this.handleDeleteComment}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    )
  }
})

// stateless
var CommentList = React.createClass({
  render: function(){
    var h2 = <h2>Little Comment React Apps</h2>
    var commentNodes = this.props.data.map((comment) => {
      // Comment is a componen
      // key for props in each data
      return(
        <Comment key={comment.id} id={comment.id} author={comment.author} text={comment.text} onDeleteComment={this.props.onEditComment} />
      )
    })
    // return(
    //   div(null, {commentNodes})
    // )
    return (<div>{commentNodes}</div>)
  }
})

var Comment = React.createClass({
  handleEditOnClick(e) {
    console.log(e.target.id);
  },
  handleDeleteOnClick(e) {
    if(!confirm('Are you sure ?')) return;

    this.props.onDeleteComment({
      id: e.target.id
    })
  },
  render(){
    return (
      <div className="mui-panel" id={this.props.id}>
        <div>
          <button className="mui-btn mui-btn--primary mui-btn--raised" onClick={this.handleEditOnClick} id={this.props.id}>Edit</button>

          <button className="mui-btn mui-btn--danger mui-btn--raised" onClick={this.handleDeleteOnClick} id={this.props.id}>Delete</button>
        </div>
        <h4>
          {this.props.author}
        </h4>
        <span>
          {this.props.text}
        </span>
      </div>
    )
  }
})

var CommentForm = React.createClass({
  getInitialState(){
    return ({
      author: '',
      text: ''
    })
  },
  handleAuthorChange(e){
    this.setState({
      author: e.target.value
    })
  },
  handleTextChange(e){
    this.setState({
      text: e.target.value
    })
  },
  handleSubmit(e){
    e.preventDefault()
    var author = this.state.author.trim()
    var text = this.state.text.trim()
    if(!author || !text){
      return
    }else{
      this.props.onCommentSubmit({
        author: author,
        text: text
      })
      this.setState({
        author: '',
        text: ''
      })
    }
  },
  render(){
    return(
      <form className="mui-form" onSubmit={this.handleSubmit}>
        <div className="mui-textfield">
          <input type="text" placeholder="Your Name" value={this.state.author} onChange={this.handleAuthorChange} />
        </div>
        <div className="mui-textfield">
          <textarea onChange={this.handleTextChange} value={this.state.text} placeholder="Your Text"></textarea>
        </div>
        <input className="mui-btn mui-btn--primary" type="submit" value="Add Post" />
      </form>
    )
  }
})

ReactDOM.render(
  <CommentBox url="http://localhost:3000/api/comments"/>, document.getElementById('content')
)
