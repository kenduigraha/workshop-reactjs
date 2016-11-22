// statefull
var CommentBox = React.createClass({
  getInitialState: function(){
    return {data: []}
  },
  //custom function
  loadComments: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'JSON',
      cache: false,
      success: function(res_data){
        this.setState({
          data: res_data
        })
      }.bind(this),// for point parent this : CommentBox
      error: function(xhr, status, errr){
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  componentDidMount: function(){// function name from React
    this.loadComments()
  },
  render: function(){
    return(
      <div className="commentBox">
        <h1>Comments App</h1>
        <CommentList data={this.state.data}/>
        <Comment />
      </div>
    )
  }
  /*
  alternative:
  render (){

  }
  */
})

// stateless
var CommentList = React.createClass({
  render: function(){
    var h2 = <h2>Comment List</h2>
    var commentNodes = this.props.data.map((comment) => {
      // Comment is a componen
      // key for props in each data
      return(
        <Comment key={comment.id} author={comment.author} text={comment.text} />
      )
    })
    // return(
    //   div(null, {commentNodes})
    // )
    return (<div>{commentNodes}</div>)
  }
})

var Comment = React.createClass({
  render(){
    return (
      <div className="comment">
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

ReactDOM.render(
  <CommentBox url="http://localhost:3000/api/comments"/>, document.getElementById('content')
)
