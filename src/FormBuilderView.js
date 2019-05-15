import React from 'react'
import Tags from './Tags'
import CustomKeys from './CustomKeys'

class FormBuilderView extends React.Component {
  render() {
    let data = this.props.data

    return (
      this.props.schema.map(fieldSchema => {
        let uid = fieldSchema.uid
        if(this.props.parent_uid)
          uid = `${this.props.parent_uid}.${fieldSchema.uid}`

        if(!fieldSchema.multiple){

          if(fieldSchema.type === "string") {
            if(fieldSchema.metadata) {
              if(fieldSchema.metadata.textArea) {
                return (
                  <div key={uid}>
                    <label>{fieldSchema.label}</label>
                    { fieldSchema.required && <span>*</span>}
                    <textarea 
                      placeholder = {fieldSchema.metadata.placeholder} 
                      id          = {uid} 
                      value       = {data[fieldSchema.uid] || ""}
                      onChange    = {this.props.onChange.bind(this, fieldSchema, this.props.parent_uid)}
                    ></textarea>
                    <br></br>
                  </div>
                )
              }

              if(fieldSchema.metadata.enum && fieldSchema.metadata.enum.length) {
                return (
                  <div key={uid}>
                    <label>{fieldSchema.label}</label>
                    { fieldSchema.required && <span>*</span>}
                    <select 
                      placeholder = {fieldSchema.metadata.placeholder} 
                      id          = {uid} 
                      value       = {data[fieldSchema.uid]}
                      onChange    = {this.props.onChange.bind(this, fieldSchema, this.props.parent_uid)}
                    >
                      <option val={""}>Select One</option>
                      {fieldSchema.metadata.enum.map(val => [
                        <option key={`${uid}.${val}`} value={val}>{val}</option>
                      ])}
                    </select>
                    <br></br>
                  </div>
                )
              }
            }

            return (
              <div key={uid}>
                <label>{fieldSchema.label}</label>
                { fieldSchema.required && <span>*</span>}
                <input 
                  type        = "text" 
                  placeholder = {fieldSchema.metadata.placeholder} 
                  id          = {uid} 
                  value       = {data[fieldSchema.uid] || ""}
                  onChange    = {this.props.onChange.bind(this, fieldSchema, this.props.parent_uid)}
                ></input>
                <br></br>
              </div>
            )
          }

          if(fieldSchema.type === "boolean") {
            return (
              <div key={uid}>
                <label>{fieldSchema.label}</label>
                <input 
                  type     = "checkbox" 
                  id       = {uid} 
                  checked  = {data[fieldSchema.uid] || false}
                  onChange = {this.props.onChange.bind(this, fieldSchema, this.props.parent_uid)}
                ></input>
                <br></br>
              </div>
            )
          }

          if(fieldSchema.type === "group") {
            return (
              <fieldset key={uid}>
                <legend>{fieldSchema.label}</legend>
                <FormBuilderView 
                  schema        = {fieldSchema.schema || []} data = {data[fieldSchema.uid] || {}} 
                  id            = {uid} 
                  parent_uid    = {uid}
                  onChange      = {this.props.onChange}
                  onAdd         = {this.props.onAdd}
                  onDelete      = {this.props.onDelete}
                  onMixedChange = {this.props.onMixedChange}
                  onTagAdd      = {this.props.onTagAdd}
                  onTagRemove   = {this.props.onTagRemove}
                />
              </fieldset>
            )
          }

          if(fieldSchema.type === "mixed") {
            return (
              <CustomKeys
                key           = {uid}
                uid           = {uid}
                data          = {data[fieldSchema.uid] || {}}
                fieldSchema   = {fieldSchema}
                parent_uid    = {this.props.parent_uid} 
                onAdd         = {this.props.onAdd}
                onMixedChange = {this.props.onMixedChange}
                onDelete      = {this.props.onDelete}
              />
            )
          }
        }
        else {
          if(fieldSchema.type === "string") {
            let fieldDataArr = data[fieldSchema.uid] || []

            return (
              <div key={uid}>
                <label>{fieldSchema.label}</label>
                <Tags 
                  tags        = {fieldDataArr}
                  uid         = {uid}
                  onTagAdd    = {this.props.onTagAdd.bind(this, fieldSchema, this.props.parent_uid)}
                  onTagRemove = {this.props.onTagRemove.bind(this, fieldSchema, this.props.parent_uid)}
                />
                <br></br>
              </div>
            )
          }

          if(fieldSchema.type === "group") {
            let fieldDataArr = data[fieldSchema.uid] || [];

            return (
              <fieldset key={uid}>
                <legend>{fieldSchema.label}</legend>
                <button 
                  id      = {`${uid}_addbutton`}
                  onClick = {this.props.onAdd.bind(this, fieldSchema, this.props.parent_uid, {})}
                >Add</button>
                {
                  fieldDataArr.map((fieldData, index) => {
                    return (
                      <fieldset key={`${uid}.${index}`} >
                        <legend>{index}</legend>
                        <FormBuilderView 
                          schema        = {fieldSchema.schema} 
                          id            = {`${uid}.${index}`} 
                          data          = {(data[fieldSchema.uid] && data[fieldSchema.uid][index]) || {}} 
                          parent_uid    = {`${uid}.${index}`} 
                          onChange      = {this.props.onChange}
                          onAdd         = {this.props.onAdd}
                          onDelete      = {this.props.onDelete}
                          onMixedChange = {this.props.onMixedChange}
                          onTagAdd      = {this.props.onTagAdd}
                          onTagRemove   = {this.props.onTagRemove}
                        />
                        <button 
                          id      = {`${uid}.${index}_delbutton`}
                          onClick = {this.props.onDelete.bind(this, fieldSchema, this.props.parent_uid, index)}
                        >Delete</button>
                      </fieldset>
                    )
                  })
                }
                <br></br>
              </fieldset>
            )
          }
        }

        return null
      })
    )
  }
}

export default FormBuilderView