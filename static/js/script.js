let validata = false
function validateFile(fileInput) {
  const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
  const fileError = document.getElementById('fileError');

  if (!allowedExtensions.exec(fileInput.value)) {
    fileInput.value = '';
    fileError.textContent = 'Please select a JPG, JPEG, PNG or PDF file.';
    fileError.style.display = 'block';
    return false;
  } else {
    fileError.style.display = 'none';
    return true;
  }
}
$('#imageInput').change(function(){
  console.log(this)
  validata = validateFile(this)
})
$('#translate').change(function(){
    // let to = this.value
    if(!validata) {
      const fileError = document.getElementById('fileError');
      fileError.textContent = 'Please input a correct file type.';
      fileError.style.display = 'block';
    }
    else {
      fileError.style.display = 'none';
      const imageInput = document.getElementById('imageInput');
      const imageFile = imageInput.files[0];
      // Create a new FileReader object
      const fileReader = new FileReader();    
      fileReader.onload = function() {
          const base64ImageWithPrefix = fileReader.result;
          // Remove the data URI prefix from the base64-encoded string
          const base64ImageWithoutPrefix = base64ImageWithPrefix.split(',')[1];
          let accessToken = 'ya29.c.c0AY_VpZga7rcQOd8xqi-tnBJyBPN3MEQufzGIXVbHqHzjFOQnyWPmAa8ttFgMlUfmxKEULJt0Brfl1bqZM2zQIxVkml0xmWTebBhPTTP0p_jjqS4GoN6w7y6GYkvbj2KekbAky06cjZM6EEbyoZT3UoXfwHGNysJQfPCRNxG4VkIBtSsLpoDuiMtvRbgPvMvCEEWt1zfp9lrnlqBLQecjI6HX91uMsuddn46D-c3LwGL--zGUHfKGpc3XFGM10UHJyKVNTlUzxGNf9n2CfXdbSCVltv-uY43OhU5JeaHWRVDufNZkZFVxZC7RrzcBGI-Mw7nNOr15If8E2no2t3-Ao2C-5PbY_ImSPmVUn_X56P73khyNF9PSrHkE384C3o8xMwkBlbMzinJ3Z62-I8WwOmxkdanmjRJ9dv2_iZVimn0B329dgx7F7XOoUFIoSseUQOcFZp0Qgb3_sxysVtjsepIf2z1dIZnendF8y9x4Fyi2JX4yqxmf6rgS9XkO1wJ2FMtxm2g4rV8mtz2I5QXj96lgMRaloFfXOeU-0ywck8mwt_cd9XbhR1k5RXfxWhx96X9d4ahhYcsu682uuqMrY_MxkrJBYcFFv8hR3XcJMy3m0iplRrtmBq4Mkr-gx99irJZy1-MFhmerjFOtQryMeI4lfQ5qZa_V9X7J1If5afOIIzi9jnwfB7s6b5IidvmYcwaj6qhecB-JqMS7oxwSm1rIqX8yBa-6F4fkBtV9wwi0R12y5Ugg22FO3b6uY_I_ahttg7StMOnau6WezmyShhriM47jd49BOonf3eV5plSQb81h8rhc6eyBl9n3whWRXa_fwYWidBXbV4ItkgvFeqUv6ggR1gM6bMiliSWwXsOv0xZll4BddyJInlxQ-uu9Q4udJB38XI8_JYB63ttVFou4lFarkrhU6pYi-onfqzogOxakq51v11e_I0bcmsOe33ws_soWlZQuo0yyS2aIs1-IJO9BbYohvYJ-z7lWYZf6atkmqcrrnj1'
          fetch('https://eu-documentai.googleapis.com/v1/projects/679844559797/locations/eu/processors/fdac58f1e29315ea:process', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
              },
              body: JSON.stringify(
                  {
                      "skipHumanReview": false,
                      "rawDocument": {
                      "mimeType": "image/png",
                      "content": `${base64ImageWithoutPrefix}`
                      },
                      "fieldMask": "",
                      "processOptions": {
                      // "individualPageSelector": {
                      //     "pages": []
                      // }
                      }
                  }
              )
          })
          .then(response => response.json())
          .then(data => {
            console.log(data.document.text)
            fetch('/translate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ to:data.document.text })
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
          .catch(error => console.error(error));
          
      };
      fileReader.readAsDataURL(imageFile);
    }
})

$('#mailsend').click(function(){
  const fileInput = document.getElementById('imageInput');
  const file = fileInput.files[0];
  if (!file) {
    console.log("file is not exist")
    return;
  }
  fetch('/send_file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "to": "to"
    })
  })
  .then(response => response.text())
  .then(data => {
    console.log(data)
  })
  .catch(error => {
      responseDiv.textContent = 'An error occurred: ' + error;
  });
})