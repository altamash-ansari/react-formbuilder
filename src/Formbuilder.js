import React from 'react'
import FormBuilderView from './FormBuilderView'
import './FormBuilder.css';

class FormBuilder extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      delta: {}
    }
  }

  onChange = (fieldSchema, parent_uid, e) => {
    let uid = fieldSchema.uid

    if(parent_uid) {
      uid = `${parent_uid}.${uid}`
    }

    let delta = this.state.delta

    let value = e.target.type === "checkbox" ? e.target.checked : e.target.value

    assignValue(delta, uid.split("."), fieldSchema, e.target.id, value)

    this.setState({
      delta
    })
  }

  onAdd = (fieldSchema, parent_uid, e) => {
    let uid = fieldSchema.uid

    if(parent_uid) {
      uid = `${parent_uid}.${uid}`
    }

    let delta = this.state.delta

    // let value = fieldSchema.type === "group" ? {} : ""
    let value = fieldSchema.type === "string" ? "" : {}

    addValue(delta, uid.split("."), fieldSchema, value)

    this.setState({
      delta
    })
  }

  onDelete = (fieldSchema, parent_uid, index, e) => {
    let uid = fieldSchema.uid

    if(parent_uid) {
      uid = `${parent_uid}.${uid}`
    }

    let delta = this.state.delta

    removeValue(delta, uid.split("."), fieldSchema, index)

    this.setState({
      delta
    })
  }

  onMixedChange = (fieldSchema, parent_uid, {keyChange, key} = {}, e) => {
    console.log(parent_uid, keyChange, key)

    let uid = fieldSchema.uid

    if(parent_uid) {
      uid = `${parent_uid}.${uid}`
    }

    let delta = this.state.delta

    assignMixedValue(delta, uid.split("."), fieldSchema, keyChange, key, e.target.value)

    this.setState({
      delta
    })
  }

  componentDidMount(){
    const delta = Object.assign({}, this.props.data)

    this.setState({
      delta
    })
  }

  render() {
    return (
      <div id="main">
        <div id="FormBuilderView">
          <FormBuilderView 
            schema        = {this.props.schema} 
            data          = {this.state.delta} 
            parent_uid    = {""} 
            onChange      = {this.onChange}
            onAdd         = {this.onAdd}
            onDelete      = {this.onDelete}
            onMixedChange = {this.onMixedChange}
          />
        </div>
        <div id="JSONView">
          <textarea rows={50} value={JSON.stringify(this.state.delta, null, 2)} readOnly></textarea>
        </div>
      </div>
    )
  }
}

function assignValue(obj, pathArr, fieldSchema, fieldID, value) {
  let currentPath  = pathArr[0]
  // Next path is an interger, so we set it as array
  if(isNaN(pathArr[1]) && !fieldSchema.multiple) {
    obj[currentPath] = obj[currentPath] || {}
  }
  else {
    obj[currentPath] = obj[currentPath] || []
  }

  pathArr.shift()
  if(pathArr.length) {
    return assignValue(obj[currentPath], pathArr, fieldSchema, fieldID, value)
  }
  else {
    // string field we need to push the data
    if(fieldSchema.multiple) {
      let indexArr = fieldID.split(".")
      obj[currentPath][indexArr[indexArr.length - 1]] = value
    }
    else {
        obj[currentPath] = value
    }
  }
}

function addValue(obj, pathArr, fieldSchema, value) {
  let currentPath  = pathArr[0]
  // Next path is an interger, so we set it as array
  if(isNaN(pathArr[1]) && !fieldSchema.multiple) {
    obj[currentPath] = obj[currentPath] || {}
  }
  else {
    obj[currentPath] = obj[currentPath] || []
  }

  pathArr.shift()
  if(pathArr.length) {
    return addValue(obj[currentPath], pathArr, fieldSchema, value)
  }
  else {
    // string field we need to push the data
    if(fieldSchema.multiple) {
      obj[currentPath].push(value)
    }
    else if(fieldSchema.type === "mixed") {
      obj[currentPath] = {
        ...obj[currentPath],
        [`key_${makeid(5)}`]: ""
      }
    }
    else {
      obj[currentPath] = value
    }
  }
}

function removeValue(obj, pathArr, fieldSchema, index) {
  let currentPath  = pathArr[0]

  pathArr.shift()
  if(pathArr.length) {
    return removeValue(obj[currentPath], pathArr, fieldSchema, index)
  }
  else if(fieldSchema.type === "mixed") {
    delete obj[currentPath][index]
  }
  else {
    // filtered out the incoming index from array
    obj[currentPath] = obj[currentPath].filter((data, i) => {
      if(index === i)
        return false

      return true
    })
  }
} 

function assignMixedValue(obj, pathArr, fieldSchema, keyChange, key, value) {
  let currentPath  = pathArr[0]

  pathArr.shift()
  if(pathArr.length) {
    return assignMixedValue(obj[currentPath], pathArr, fieldSchema, keyChange, key, value)
  }
  else {
    if(keyChange){
      let tempObj = {}
      Object.keys(obj[currentPath]).map(k => {
        if(k === key){
          tempObj[value] = obj[currentPath][k]
        }
        else {
          tempObj[k] = obj[currentPath][k]
        }

        return null
      })

      obj[currentPath] = tempObj
    }
    else{
      obj[currentPath][key] = value
    }
  }
}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default FormBuilder