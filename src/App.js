import React, { Component } from 'react';
import FilterForm from './components/filter-form';

class App extends Component {

  state = {
    products: [],
    departments: []
  }
  render() {
    return (
      <FilterForm  departments={this.state.departments}/>
    );
  }
  componentDidMount() {
    fetch('http://localhost:8000/departments')
    .then(res => res.json())
    .then((data) => {
      this.setState({ departments: data })
    })
  }

}

export default App;
