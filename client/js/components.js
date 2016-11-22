var CommentBox = React.createClass({
  getInitialState: function(){
    return {data: []}
  },
  render: function(){
    return(
      <div className="commentBox">
        <h1>Comments App</h1>
      </div>
    )
  }
  /*
  alternative: 
  render (){

  }
  */
})

ReactDOM.render(
  <CommentBox />, document.getElementById('content')
)
