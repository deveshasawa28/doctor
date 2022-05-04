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
var cart = []

function getCartItem(items) {
  return items.map((item, index) =>
  <div className="row" key={index}>
    <div className="col-sm-12 col-md-8 ">
      <div className="thumbnail">
        <div className="caption">
          <p> Product name: <b>{item.product_name}</b> </p>
          <p> Product description: <b>{item.product_des}</b> </p>
          <p> Amount: <b>{item.ammount} </b> </p>
          <div>
          <button className="btn btn-primary" style={{marginLeft: '15px'}} onClick={e => cartDelete(index)} >Remove from cart</button>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}

function cartDelete(index) {
  //Removing item from cart and updating cart again 
  cart.splice(index, 1);
  const cartItems= getCartItem(cart);
  ReactDOM.render(
    cartItems,
    document.getElementById('order')
  )
}
function success() {
 
  let data = JSON.parse(xhttp.response);
  
  function cartAdd(item, index) {
    cart.push(item)
    const cartItems= getCartItem(cart);
    ReactDOM.render(
      cartItems,
      document.getElementById('order')
    )
  }
  const productsList = data.products.map((item, index) =>
    <div className="row" key={index}>
      <div className="col-sm-12 col-md-8 ">
        <div className="thumbnail">
          <div className="caption">
            <p> Product name: <b>{item.product_name}</b> </p>
            <p> Product description: <b>{item.product_des}</b> </p>
            <p> Amount: <b>{item.ammount} </b> </p>
            <div>
            <button className="btn btn-primary" onClick={e => cartAdd(item, cart.length)} >Add to cart</button>
            <button className="btn btn-primary" style={{marginLeft: '15px'}} onClick={e => cartDelete(cart.length)} >Remove from cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  function placeOrder(){
    console.log('place oder funciton should work');
  }

  let element = (
    <div>
      { data.userInfo.role === 'admin'? <div><a href="/products/orders">See All Orders</a></div>:''}
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