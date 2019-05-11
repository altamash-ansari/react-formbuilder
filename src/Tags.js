import React from 'react'

class Tags extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      tags    : [],
      tagInput: ""
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.tags.length !== prevState.tags.length) {
      return {
        tags: nextProps.tags
      }
    }

    return null
  }

  componentDidMount(){
    this.setState({
      tags: this.props.tags
    })
  }

  onChange = (e) => {
    this.setState({
      tagInput: e.target.value
    })
  }

  onKeyDown = (e) => {
    if(e.key === "Enter"){
      e.target.id = `${this.props.uid}.${this.state.tags.length}`
      if(e.target.value.length){
        this.props.onTagAdd && this.props.onTagAdd(e)
        this.setState({
          tagInput: ""
        })
      }
    }
    else if(e.key === "Backspace"){
      if(this.state.tagInput.length === 0 && this.state.tags.length) {
        e.target.id = `${this.props.uid}.${this.state.tags.length}`
        this.props.onTagRemove && this.props.onTagRemove(-1, e)
      } 
    }
  }

  render() {
    let state = this.state

    return (
      <div> 
          <ul>  
            {
              state.tags.map((item, i) => {
                return <li
                  id = { `${this.props.uid}.${i}` }
                  key = { `${this.props.uid}.${i}` }
                > {item}
                <button 
                  id={`${this.props.uid}.${i}_button`}
                  onClick={this.props.onTagRemove.bind(this, i)}
                >x</button> </li> 
              })
            }
          </ul> 
          <input 
            value    = { state.tagInput } 
            onChange = {this.onChange}
            onKeyDown= {this.onKeyDown}
            /> 
      </div>
    )
  }
}

export default Tags