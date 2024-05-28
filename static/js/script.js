let validata = false
let inputType = ''
function getFileExtension(filename) {
  const extension = filename.split('.').pop();
  return extension;
}
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
  validata = validateFile(this)
  const fileExtension = getFileExtension(this.value);
  switch(fileExtension.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      inputType = 'image/jpeg';
      break;
    case 'png':
      inputType = 'image/png';
      break;
    case 'pdf':
      inputType = 'application/pdf';
      break;
    default:
      inputType = '';
      break;
  }
})
$('#translate').change(function(){
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
          let accessToken = document.getElementById('token').textContent;
          document.getElementById('token').textContent = null
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
                      "mimeType": `${inputType}`,
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