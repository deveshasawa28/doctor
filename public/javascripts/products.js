let xhttp = new XMLHttpRequest();
console.log('loading products from backend....');
xhttp.addEventListener("load", success);
xhttp.addEventListener("error", error);
xhttp.open("GET", "/products/productList", true);
xhttp.send();
/* 
https://reactjs.org/docs/lists-and-keys.html
https://en.wikipedia.org/wiki/Map_(higher-order_function)
*/
function success() {
  console.log('success');
    let data = JSON.parse(xhttp.response);
  
  const productsList = data.map((item, index) =>
    <div className="row" key={index}>
      <div className="col-sm-6 col-md-4">
        <div className="thumbnail"> 
            <div className="caption">
              <h3>product name:       {item.product_name}</h3>
              <p>product description: {item.product_des}</p>
              <p>amount:               {item.ammount}</p>
              <p><a href="#" className="btn btn-primary" role="button">Add to cart</a> <a href="#" className="btn btn-default" role="button">Remove from cart</a></p>
            </div>
        </div>
      </div>
    </div>
  )
  console.log('list of items',productsList)
  let element = (
    <div>
     {productsList}
    </div>
  );

  ReactDOM.render(
    element,
    document.getElementById('products')
  );

}
function error() {
  console.log(xhttp.readyState);
  console.log(xhttp.status);
}