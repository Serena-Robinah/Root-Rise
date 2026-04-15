import FormData from 'form-data';
import fetch from 'node-fetch';

const fd = new FormData();
fd.append('name', 'My Product');
fd.append('price', '19.99');
fd.append('stock', '5');

fetch('http://localhost:3000/api/admin/products', {
  method: 'POST',
  body: fd
})
.then(async res => {
  console.log('Status:', res.status);
  console.log('Body:', await res.text());
})
.catch(console.error);
