let xhttp = new XMLHttpRequest();

xhttp.addEventListener("load", success);
xhttp.addEventListener("error", error);
xhttp.open("GET", "/products/ordersList", true);
xhttp.send();

const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');

function placeOrder(item){
  console.log('item for placement', item);
}
/* 
https://reactjs.org/docs/lists-and-keys.html
https://en.wikipedia.org/wiki/Map_(higher-order_function)
*/
function success() {

  let data = JSON.parse(xhttp.response);
  let rows;
  let element = '';
  console.log('orderlist fetched orders are :', data.orders.length);
  if (data.orders.length) {
    rows = data.orders.map((row) => {
      console.log('row', row)
      return (<tr key={JSON.stringify(row)}>
        <td> {row.productName}</td>
        <td> {row.email}</td>
        <td> {row.qty}</td>
        <td> {row.price} </td>
        <td> {row.total} </td>
        <td><button className="btn btn-primary" id=''>Place Order</button></td>
      </tr>)
    }
    );
    element = (
      <div>
        <table id="myTable">
          <thead>
            <tr><th>Product-Name </th><th>User-Email</th><th>qty</th><th>Price</th><th>Total</th></tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
    
  } else {
     element = (
      <span alignment='center'>No Orders</span>
    );
  }

  console.log('rows ::',rows);


  ReactDOM.render(
    element,
    document.getElementById('orders')
  );
  /*
   datatable CSS 
   https://datatables.net/
   https://github.com/fiduswriter/Simple-DataTables
  */

  //  const dataTable = new simpleDatatables.DataTable("#myTable");
}
function error() {
  console.log('onError state :', xhttp.readyState);
  console.log('onError status :', xhttp.status);
}