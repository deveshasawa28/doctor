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
  var cart = []
  var carts = []
  let data = JSON.parse(xhttp.response);
  function cartDelete(index) {
    console.log(index);
    cart.splice(index, 1);
  }
  function cartAdd(item, index) {
    cart.push(item)
    for (var i = 0; i < cart.length; i++) {
      carts[i] = `<div className="row" key={cart[i]}>
        <div className="col-sm-6 col-md-4">
          <div className="thumbnail">
            <div className="caption">
              <h3>product name:       ${cart[i].product_name}</h3>
              <p>product description: ${cart[i].product_des}</p>
              <p>amount:               ${cart[i].ammount}</p>
              <button className="btn btn-default" onClick='${e => cartDelete(index)} '>Remove from cart</button>
            </div>
          </div>
        </div>
      </div>`
    }
    document.getElementById("order").innerHTML = carts
   
  }
  const productsList = data.map((item, index) =>
    <div className="row" key={index}>
      <div className="col-sm-6 col-md-4">
        <div className="thumbnail">
          <div className="caption">
            <h3>product name:       {item.product_name}</h3>
            <p>product description: {item.product_des}</p>
            <p>amount:               {item.ammount}</p>
            <p><button className="btn btn-primary" onClick={e => cartAdd(item, cart.length)} >Add to cart</button>
              <button className="btn btn-default" onClick={e => cartDelete(cart.length)} >Remove from cart</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )

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