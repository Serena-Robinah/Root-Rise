fetch('http://localhost:3000/api/products')
.then(res => res.json().then(data => ({status: res.status, data})))
.then(console.log)
.catch(console.error);
