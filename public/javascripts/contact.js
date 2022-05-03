let xhttp = new XMLHttpRequest();
console.log('loading products from backend....');
xhttp.addEventListener("load", success);
xhttp.addEventListener("error", error);
xhttp.open("GET", "/users/contact", true);
xhttp.send();
/* 
https://reactjs.org/docs/lists-and-keys.html
https://en.wikipedia.org/wiki/Map_(higher-order_function)
*/
function success() {
  let data = JSON.parse(xhttp.response);
  let element = (
    <div>
      <p>Email : onlineMadical@gmail.com</p>
      <p> Phone : 777778888999</p>
    </div>
  );

  ReactDOM.render(
    element,
    document.getElementById('contact')
  );

}
function error() {
  console.log(xhttp.readyState);
  console.log(xhttp.status);
}