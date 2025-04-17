export function enableVPN() {
  const element = document.querySelector('main');
  const header = document.querySelector('header');
  header.innerText = '';
  element.innerText = '';
  const modal = document.createElement('dialog');
  modal.setAttribute('data-keyboard', 'false');
  modal.classList.add('modal');

  const h2 = document.createElement('h2');
  h2.innerText = 'VPN required!';

  const p = document.createElement('p');
  p.innerText = 'Please, enable Metropolia VPN to use the app.';

  modal.append(h2, p);
  element.append(modal);
  modal.show();
}
