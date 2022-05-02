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
  const contactElement = [data].map((item, index) =>
    <div className="row" key={index}>
      <div className="col-sm-6 col-md-4">
        <div className="thumbnail">
          <div className="caption">
            <h3>User Id : {item.user.id}</h3>
            <p> User name : {item.user.username}</p>
            <p> Full name : {item.user.fullname}</p>
            <p> Prefer : {data.user.prefer}</p>
          </div>
        </div>
      </div>
    </div>
  )
  let element = (
    <div>
      {contactElement}
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