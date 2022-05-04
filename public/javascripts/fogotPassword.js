let xhttp = new XMLHttpRequest();

// xhttp.addEventListener("load", success);
// xhttp.addEventListener("error", error);
// xhttp.open("GET", "/products/ordersList", true);
// xhttp.send();

const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
  let element = (

    <div>
      <span>{message}</span>
      <form className="form-signin" method="post" action="restPassword">
      <input className="form-control" type="text" name="email" placeholder="email" required autoFocus />
      <input className="form-control" type="password" name="oldpassword" placeholder="Old Password" required />
      <input className="form-control" type="password" name="newpassword" placeholder="New Password" required />
      <input className="form-control" type="password" name="confirmpassword" placeholder="Confirm password" required />
      <br/>
      <button className="btn btn-lg btn-primary btn-block" type="submit">Rest Password</button>
      </form>
    </div>
  )
  console.log('message :', message);
// function error() {
//   console.log('onError state :', xhttp.readyState);
//   console.log('onError status :', xhttp.status);
// }  

ReactDOM.render(
  element,
  document.getElementById('changepwd')
);