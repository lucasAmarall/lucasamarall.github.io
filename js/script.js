function loadImage(imagePath) {
  var protocol = window.location.protocol || 'http';
  var host = window.location.host;
  var url = protocol + "//" + host + imagePath
  return new Promise(res => {
      fetch(url).then(r => r.blob()).then(blob => {
        var reader = new FileReader();
        reader.onload = function() {
          var b64 = reader.result.replace(/^data:.+;base64,/, '');
          res("data:image/png;base64," + b64)
        };
        reader.readAsDataURL(blob);
      });
    })
    // return fetch(url+ imagePath, {dataType:"image/jpg",})
}

function setPhotos() {
  var hero = document.querySelector('.hero');
  var testimonial = document.querySelector('.testimonial');
  var introPhoto = document.querySelector('.intro__image');

  loadImage('/images/lucas.jpg').then(function(res) { introPhoto.setAttribute("src", res) })
  loadImage('/images/hero.jpg').then(function(res) { hero.style.backgroundImage = "url("+ res +")" })
  loadImage('/images/testimonial-bg').then(function(res) { testimonial.style.backgroundImage = "url("+ res +")" })
}

window.addEventListener('load', setPhotos)