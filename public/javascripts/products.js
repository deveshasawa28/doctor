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

  let rows = data.map((row) =>
    <tr key={JSON.stringify(row)}>
      <td> {row.id}</td>
      <td> {row.username}</td>
      <td> {row.description}</td>
      <td> {row.due}</td>
    </tr>
  );
  console.log('products loaded from backend....')
  console.log(rows);
  const productsList = rows.map((item, index) =>
    <div className="row" key={index}>
      <div className="col-sm-6 col-md-4">
        <div className="thumbnail">
          <img src="..." alt="..." />
            <div className="caption">
              <h3>{item.product_name}</h3>
              <p>{item.product_des}</p>
              <p>{item.ammount}</p>
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