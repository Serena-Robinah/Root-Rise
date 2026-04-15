const fd = new FormData();
fd.append('name', 'Test');
fd.append('price', '10');

fetch('http://localhost:3000/api/admin/products', {
  method: 'POST',
  body: fd
})
.then(async res => {
  console.log('Status:', res.status);
  console.log('Headers:', res.headers);
  const text = await res.text();
  console.log('Body:', text);
})
.catch(console.error);
