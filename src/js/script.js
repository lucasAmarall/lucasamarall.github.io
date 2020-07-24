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
}

function setPhotos() {
  var hero = document.querySelector('.hero');
  var testimonial = document.querySelector('.testimonial');
  var introPhoto = document.querySelector('.intro__image');

  loadImage('/images/lucas.jpg').then(function(res) { introPhoto.setAttribute("src", res) })
  // loadImage('/images/hero.jpg').then(function(res) { hero.style.backgroundImage = "url(" + res + ")" })
  loadImage('/images/testimonial-bg.jpg').then(function(res) { testimonial.style.backgroundImage = "url(" + res + ")" })
}

function initIntroSwiper(){
  setTimeout(function(){
    if(!Swiper) initIntroSwiper()
    new Swiper ('.about-swiper', {
      loop: false,
      pagination: {
        el: '.about-swiper-pagination',
        clickable: true,
      }
    })
    new Swiper ('.testimonial-container', {
      loop: true,
      autoplay: {
        delay: 3000,
      },
    })
  }, 100)
}

function emailSent(){
  console.log('SUCCESS!');
}

function emailFailed(){
  console.log('!!SUCCESS!');
}

function sendEmail(){
  const to_name = document.querySelector("#contact > div > div > div.w-100 > form > label:nth-child(1) input").value;
  const to_email = document.querySelector("#contact > div > div > div.w-100 > form > label:nth-child(2) input").value;
  const to_message = document.querySelector("#contact > div > div > div.w-100 > form > label:nth-child(3) textarea").value;
  const templateParams = {to: 'lucasamaral.dev@gmail.com', to_name: to_name, to_email:to_email, to_message : to_message}
  emailjs.send('default_service', 'template_hLjKCX34', templateParams).then(emailSent).catch(emailFailed)
}

function initEmailService(){
  const form = document.querySelector('form')
  form.addEventListener ('submit', sendEmail);
}
function init() {
  setPhotos();
  initIntroSwiper()
  initEmailService()
}

window.addEventListener('load', init)

