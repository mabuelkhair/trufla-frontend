import React from 'react'

const Products = ({ products }) => {
    return (
      <>
        <div  className="row">
        {products.map((product) => (
            <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100">
              <img className="card-img-top" src="http://placehold.it/700x400" alt=""/>
              <div className="card-body">
                <h4 className="card-title">
                  {product.name}
                </h4>
                { product.promotion==null?     
                <h5>${product.price}</h5>:
                <>
                <strike><h5>${product.price}</h5></strike>
                <h5>${product.promotion.price}</h5>
                </>
                }
                <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!</p>
              </div>
              <div className="card-footer">
                <small className="text-muted">&#9733; &#9733; &#9733; &#9733; &#9734;</small>
              </div>
            </div>
          </div>
        ))}
        </div>
        </>
    )
};

export default Products
