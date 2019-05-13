import React from 'react';
import Formbuilder from './Formbuilder';
// import FilterableProductTable from './FilterableProductTable';
import './App.css';
import schema from './schema.json';

const data = {
  "version": "1.1.1",
  // "latest_app_version": {
  //   "ios_version": "1.1.1"
  // },
  // "app_db_reset": ["1.1.1", "1.1.2"],
  // "thirdparty_app_deeplink": [{
  //   "app_name": "uber"
  // },{
  //   "app_name": "ola"
  // }],
  // "config":{
  //   "data": "adad",
  //   "nba": "aa"
  // }
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      schema  : schema,
      data    : data,
      showForm: true
    }
  }

  onClick = (e) => {
    this.setState({
      showForm: !this.state.showForm
    })
  }

  onSchemaChange = (e) => {
    let schema = this.state.schema
    try {
      schema = JSON.parse(e.target.value)
    } catch (error) {

    }

    this.setState({
      schema
    })
  }

  onDataChange = (e) => {
    let data = this.state.data
    try {
      data = JSON.parse(e.target.value)
    } catch (error) {

    }

    this.setState({
      data
    })
  }

  render(){
    return (
      <div className="App">
        {
          !this.state.showForm && <div>
            <button onClick={this.onClick}>Render Schema</button><br></br>
            <div className="schema">
              <label>Schema</label><br></br>
              <textarea rows={50} defaultValue={JSON.stringify(this.state.schema, null, 2)} onChange={this.onSchemaChange}></textarea>
            </div>
            <div className="data">
              <label>Data</label><br></br>
              <textarea rows={50} defaultValue={JSON.stringify(this.state.data, null, 2)} onChange={this.onDataChange}></textarea>
            </div>
          </div>
        }
        {
          this.state.showForm && <div>
            <button onClick={this.onClick}>Edit Schema</button>
            <Formbuilder schema={this.state.schema} data={this.state.data}/>
          </div>
        }
      </div>
    );
  }
}

export default App;
