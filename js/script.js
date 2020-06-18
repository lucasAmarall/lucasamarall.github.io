function setPhotos(){
    document.querySelector('.intro__image').setAttribute('src', '../images/lucas.jpg');
    document.querySelector('.hero').style.backgroundImage = "url(../images/hero.jpg)";
    document.querySelector('.testimonial').style.backgroundImage = "url(../images/testimonial-bg.jpg)";
}

window.addEventListener('load', setPhotos)