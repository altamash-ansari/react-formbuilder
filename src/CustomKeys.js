import React from 'react'

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

class CustomKeys extends React.Component {
  onClick = () => {
    this.props.onAdd(this.props.fieldSchema, this.props.parent_uid, {
      [`key${makeid(5)}`]: ""
    })
  }

  render() {
    let fieldData   = this.props.data || {};
    let uid         = this.props.uid
    let fieldSchema = this.props.fieldSchema

    return (
      <fieldset>
        <legend>{fieldSchema.label}</legend>
        <button
          id      = {`${uid}_addbutton`}
          onClick = {this.onClick}
        >Add</button>
        {
          Object.keys(fieldData).map((key, index) => {
            return (
              <div key={`${uid}.${index}`} >
                <input
                  type     = "text"
                  id       = {`${uid}.${key}.key`}
                  value    = {key}
                  onChange = {this.props.onMixedChange.bind(this, fieldSchema, this.props.parent_uid, { keyChange: true, key: key })}
                ></input>
                <input
                  type     = "text"
                  id       = {`${uid}.${key}.value`}
                  value    = {fieldData[key] || ""}
                  onChange = {this.props.onMixedChange.bind(this, fieldSchema, this.props.parent_uid, { key: key })}
                ></input>
                <button
                  id      = {`${uid}.${key}_delbutton`}
                  onClick = {this.props.onDelete.bind(this, fieldSchema, this.props.parent_uid, key)}
                >Delete</button>
              </div>
            )
          })
        }
        <br></br>
      </fieldset>
    )
  }
}


export default CustomKeys