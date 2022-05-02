let who = new XMLHttpRequest(); 
      
who.addEventListener("load",whoami); 
who.open("GET", "/users/whoami", true); 
who.send();

function whoami(){
  let data = JSON.parse(who.response);
  console.log('whoami called and response is', data);
    let element =(
    <span>{data.user}</span>
  );
  
  ReactDOM.render(
    element,
    document.getElementById('whoami')
  );
}
