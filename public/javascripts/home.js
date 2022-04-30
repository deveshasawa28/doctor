let who = new XMLHttpRequest(); 
      
who.addEventListener("load",getUser); 
who.open("GET", "/users/whoami", true); 
who.send();

function getUser(){
  let res = JSON.parse(who.response);
  console.log('homepage data loaded!', res);
  if (res) {
    let element = (
      <span>{res.user}</span>
    );
    ReactDOM.render(
      element,
      document.getElementById('username')
    );
  }
}
