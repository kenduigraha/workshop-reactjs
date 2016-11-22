// statefull
var CommentBox = React.createClass({
  getInitialState: function(){
    return {data: []}
  },
  render: function(){
    return(
      <div className="commentBox">
        <h1>Comments App</h1>
        <CommentList />
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
    return (h2) // or return h2
  }
})

ReactDOM.render(
  <CommentBox />, document.getElementById('content')
)
