const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('name');

if (message) {
  let element = (
    <span>{message}</span>
  );
  ReactDOM.render(
    element,
    document.getElementById('name')
  );
}