let xhttp = new XMLHttpRequest(); 
      
xhttp.addEventListener("load",success); 
xhttp.addEventListener("error",error);  
xhttp.open("GET", "/products/ordersList", true); 
xhttp.send();

const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
/* 
https://reactjs.org/docs/lists-and-keys.html
https://en.wikipedia.org/wiki/Map_(higher-order_function)
*/
function success() {
  
  let data = JSON.parse(xhttp.response);
  let rows ;
  let element='';
  if(message) {
    let element = (
      <span>{message}</span>
    );
    ReactDOM.render(
      element,
      document.getElementById('message')
    );
  }
  console.log('orderlist fetched orders are :', data.length);
  if(data.length){
    rows = data.map((row) => 
    <tr key={JSON.stringify(row)}>
        <td> { row.id }</td>
        <td> { row.username }</td>
        <td> { row.description }</td>
        <td> { row.due } </td>
    </tr>
  );
   element =(
    <div>
        <table id="myTable">
        <thead>
        <tr><th>ID</th><th>Username</th><th>Description</th><th>Due</th></tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
        </table>
    </div>
  );
  }
  
  console.log(rows);
  
  
  ReactDOM.render(
    element,
    document.getElementById('orders')
  );
  /*
   datatable CSS 
   https://datatables.net/
   https://github.com/fiduswriter/Simple-DataTables
  */
  const dataTable = new simpleDatatables.DataTable("#myTable");

}
function error(){
  console.log(xhttp.readyState);
  console.log(xhttp.status);
}