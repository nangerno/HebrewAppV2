$('#translate').change(function(){
    console.log(this.value)
    let to = this.value
    fetch('/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to:to })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);
        // Update the UI or perform other actions based on the server response
      })
      .catch(error => {
        console.error('Error:', error);
      });
})