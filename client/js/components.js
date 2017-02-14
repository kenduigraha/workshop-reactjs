// statefull
var CommentBox = React.createClass({
  getInitialState: function(){
    return {
      id: '',
      data: [],
      author: '',
      text: '',
      isEdit: false
    }
  },
  //custom function
  loadComments: function(){
    console.log(this.props.url);
    $.ajax({
      url: this.props.url,
      dataType: 'JSON',
      // cache: false,
      success: function(res_data){
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
  handleEditComment(data) {
    this.setState({
      id: data.id,
      author: data.author,
      text: data.text,
      isEdit: true
    })
  },
  // componentWillMount() {
  //   // initialize modal element
  //   var modalEl = document.createElement('div');
  //   modalEl.style.width = '400px';
  //   modalEl.style.height = '300px';
  //   modalEl.style.margin = '100px auto';
  //   modalEl.style.backgroundColor = '#fff';
  //
  //   // show modal
  //   mui.overlay('on', modalEl);
  // },
  handleEditCommentSubmit(data) {
    var updated_id = data.id
    var comments = this.state.data

    this.setState({
      data: this.state.data.map(comment => {
        return comment.id === updated_id ? Object.assign({}, comment, {
          author: data.author,
          text: data.text
        }) : comment
      })
    })

    $.ajax({
      url: this.props.url+'/'+updated_id,
      method: 'PUT',
      data: {
        author: data.author,
        text: data.text
      },
      success: function (response) {
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
    // console.log(this.state);
    return(
      <div className="mui-container">
        <h1>Comments App</h1>
        <CommentList data={this.state.data} onDeleteComment={this.handleDeleteComment} onEditComment={this.handleEditComment} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} onEditCommentSubmit={this.handleEditCommentSubmit} id ={this.state.id} author={this.state.author} text={this.state.text} isEdit={this.state.isEdit} />
      </div>
    )
  }
})

// stateless
var CommentList = React.createClass({
  render: function(){
    var h2 = <h2>Little Comment React Apps</h2>
    // console.log(this.props.data);
    var commentNodes = this.props.data.map((comment) => {
      // Comment is a componen
      // key for props in each data
      return(
        <Comment key={comment.id} id={comment.id} author={comment.author} text={comment.text} onDeleteComment={this.props.onDeleteComment} onEditComment={this.props.onEditComment} />
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
    this.props.onEditComment({
      id: e.target.offsetParent.id,
      author: this.props.author,
      text: this.props.text
    })
  },
  handleDeleteOnClick(e) {
    if(!confirm('Are you sure ?')) return;

    this.props.onDeleteComment({
      id: e.target.offsetParent.id
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
      id: '',
      author: this.props.author,
      text: this.props.text,
      isEdit: this.props.isEdit
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
  componentWillReceiveProps(nextProps) {
    // console.log(this.state);
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.id !== this.state.id
        && nextProps.author !== this.state.author
        && nextProps.text !== this.state.text) {
          // console.log(nextProps);
      this.setState({
        id: nextProps.id,
        author: nextProps.author,
        text: nextProps.text,
        isEdit: nextProps.isEdit
      });
    }
  },
  handleUpdateSubmit(e) {
    e.preventDefault()
    var id = this.state.id.trim()
    var author = this.state.author.trim()
    var text = this.state.text.trim()
    if(!author || !text){
      return
    }else{
      this.props.onEditCommentSubmit({
        id: id,
        author: author,
        text: text
      })
      this.setState({
        author: '',
        text: '',
        isEdit: false
      })
    }
  },
  render(){
    // console.log(this.state);
    if (this.state.isEdit == false) {
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
    } else {
      return(
        <form className="mui-form" onSubmit={this.handleUpdateSubmit}>
          <div className="mui-textfield">
            <input type="text" placeholder="Your Name" value={this.state.author} onChange={this.handleAuthorChange} />
          </div>
          <div className="mui-textfield">
            <textarea onChange={this.handleTextChange} value={this.state.text} placeholder="Your Text"></textarea>
          </div>
          <input className="mui-btn mui-btn--primary" type="submit" value="Update Post" />
        </form>
      )
    }
  }
})

ReactDOM.render(
  <CommentBox url="http://localhost:3000/api/comments"/>, document.getElementById('content')
)
