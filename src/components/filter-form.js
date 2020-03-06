import React from 'react'
import Products from './products';

class FilterForm extends React.Component {
    constructor(props) {
      super(props);
      var urlParams = new URLSearchParams(window.location.search);
      
      this.state = {
        products: [],
        url: 'http://localhost:8000/products?',
        departments: new Set(),
        currentPage: urlParams.get('page') || "1",
        pagesCount: 1,
        promocode: "",
        searchText: ""  
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
      var urlParams = new URLSearchParams(window.location.search);
      let promocode = urlParams.get('code');
      let searchText = urlParams.get('search');
      this.setState({promocode: promocode});
      this.setState({searchText: searchText});
      let filterUrl = this.state.url;
      let departments = urlParams.getAll('department_ids[]');
      let departmentsSet = new Set();
      for (let item of departments){
        filterUrl = filterUrl + '&department_ids[]=' + item
        departmentsSet.add(item);
      }
      this.setState({departments: departmentsSet});
      if(promocode){
        filterUrl = filterUrl + '&code=' + promocode
      }
      if(searchText){
        filterUrl = filterUrl + '&search=' + searchText
      }
      filterUrl = filterUrl + "&page=" + this.state.currentPage
      window.history.replaceState({}, '','?'+urlParams.toString());
      fetch(filterUrl)
      .then(res => res.json())
      .then((data) => {
        this.setState({ products: data["products"], pagesCount: data["meta"]["pages_count"] });
      })
    
    }
    handleChange(event) {
      let departments = this.state.departments;
      if(event.target.checked){
        departments.add(event.target.value);
      }
      else{
        departments.delete(event.target.value);
      }

      this.setState({departments: departments});
    }
  
    handleSubmit(event) {
      event.preventDefault();

      var urlParams = new URLSearchParams('');
      let promocode = event.target.elements.promocode.value
      let searchText = event.target.elements.searchText.value
      let filterUrl = this.state.url
      if(promocode!==''){
        filterUrl = filterUrl + '&code=' + promocode
        urlParams.append('code', promocode);
      }
      if(searchText!==''){
        filterUrl = filterUrl + '&search=' + searchText
        urlParams.append('search', searchText);
      }
      if(this.state.departments.size > 0){
        for (let item of this.state.departments){
          filterUrl = filterUrl + '&department_ids[]=' + item
          urlParams.append('department_ids[]', item);
          
        }
      }
      this.setState({ currentPage: "1" });
      urlParams.append('page', 1);
      this.setState({ url: filterUrl });
      window.history.replaceState({}, '','?'+urlParams.toString());
      fetch(filterUrl)
      .then(res => res.json())
      .then((data) => {
        this.setState({ products: data["products"], pagesCount: data["meta"]["pages_count"] 
        });        
      })
    }
    handleClick(page) {
      var urlParams = new URLSearchParams(window.location.search);
      let nextPage = parseInt(this.state.currentPage) + page;
      urlParams.set('page', nextPage);
      window.history.replaceState({}, '','?'+urlParams.toString());
      this.setState({ currentPage: nextPage.toString() });
      let url = this.state.url +urlParams.toString() + '&page=' + nextPage;
      fetch(url)
      .then(res => res.json())
      .then((data) => {
        this.setState({ products: data["products"], pagesCount: data["meta"]["pages_count"] 
        });        
      })
    }
    render() {
      return (
    <>
      <div className="col-lg-3">
        <form onSubmit={this.handleSubmit}>
              <h1 className="my-4">Trufla Shop</h1>
              <div className="list-group">
              <h4>Filter</h4>
              <b><p>Departments</p></b>
                {this.props.departments.map((department) => (
                  <div>
                  <input id={department.id} type="checkbox" onChange={this.handleChange} value={department.id} defaultChecked={this.state.departments.has(department.id.toString())} />
                  <label htmlFor={department.id}>{department.name}</label>
                  </div>
                ))}
              </div>
              <input defaultValue={this.state.promocode} type="text" className="form-control" placeholder="Enter Coupon Code" name="promocode" />
              <input defaultValue={this.state.searchText} type="text" className="form-control" placeholder="Search" name="searchText"/>
          <input className="btn btn-secondary" type="submit" value="Filter" />
        </form>
      </div>
        <div className="col-lg-9">
    <Products products={this.state.products} />
    <nav aria-label="...">
          <ul className="pagination">
          { this.state.currentPage==="1"?    
              <li className="page-item disabled">
                <button className="page-link">Previous</button>
              </li>:
              <li className="page-item">
                <button className="page-link" onClick={()=>this.handleClick(-1)}>Previous</button>
              </li>
          }
          <li className="page-item"><p className="page-link">{this.state.currentPage}</p></li>
          { this.state.currentPage < this.state.pagesCount?
            <li className="page-item">
              <button className="page-link" onClick={()=>this.handleClick(1)}>Next</button>
            </li>:
            <li className="page-item disabled">
              <button className="page-link">Next</button>
            </li>

          }
            
          </ul>
        </nav>
      </div>
    </>
      );
    }
  }
export default FilterForm
