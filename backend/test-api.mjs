fetch('http://localhost:3000/api/admin/products', {
  method: 'POST',
  body: (() => {
    const fd = new FormData();
    fd.append('name', 'Test');
    fd.append('price', '10');
    fd.append('stock', '5');
    fd.append('description', 'Test desc');
    fd.append('category', 'Skincare');
    fd.append('age_group', 'Adult');
    fd.append('gender', 'Unisex');
    // We cannot easily append a file in simple node script without Blob/File, so we test without image.
    return fd;
  })()
})
.then(res => res.json().then(data => ({status: res.status, data})))
.then(console.log)
.catch(console.error);
