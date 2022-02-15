
/*-------------- navigation menu ---------------------*/
(() =>{

    const hamburgerBtn = document.querySelector(".hamburger-btn"),
    navMenu = document.querySelector(".nav-menu"),
    closeNavBtn = navMenu.querySelector(".close-nav-menu");

    hamburgerBtn.addEventListener("click", showNavMenu);
    closeNavBtn.addEventListener("click", hideNavMenu);

    function showNavMenu(){
        navMenu.classList.add("open");
        bodyScrollingToggle();
    }
    function hideNavMenu(){
        navMenu.classList.remove("open");
        fadeOutEffect();
        bodyScrollingToggle();
    }
    function fadeOutEffect() {
        document.querySelector(".fade-out-effect").classList.add("active");
        setTimeout(() =>{
            document.querySelector(".fade-out-effect").classList.remove("active");
        },300)
    }

    // attch an event handler to document
    document.addEventListener("click", (event) =>{
        if(event.target.classList.contains("link-item")){
            /* make sure event.target.hash has a value before overriding default behavior */
            if(event.target.hash !==""){
                // prevent default anchor click behavior
                event.preventDefault();
                const hash = event.target.hash;
                // deactivate existing active section
                document.querySelector(".section.active").classList.add("hide");
                document.querySelector(".section.active").classList.remove("active");
                // activate "new" section
                document.querySelector(hash).classList.add("active");
                document.querySelector(hash).classList.remove("hide");
                /* deactivate existing active navigation menu 'link-item' */
                navMenu.querySelector(".active").classList.add("outer-shadow","hover-in-shadow");
                navMenu.querySelector(".active").classList.remove("active","inner-shadow");
                /* if clicked 'link-item' is contained within the navigation menu */
                if(navMenu.classList.contains("open")){
                    // activate new navigation menu 'link-item'
                    event.target.classList.add("active", "inner-shadow");
                    event.target.classList.remove("outer-shadow", "hover-in-shadow");

                    // hide navigation menu
                    hideNavMenu();
                }
                else{
                    let navItems = navMenu.querySelectorAll(".link-item");
                    navItems.forEach((item) =>{
                        if(hash === item.hash){
                            // activate new navigation menu 'link-item'
                            item.classList.add("active", "inner-shadow");
                            item.classList.remove("outer-shadow", "hover-in-shadow");
                        }
                    })
                    fadeOutEffect();
                }
                // add hash (#) to url
                window.location.hash = hash;
            }
        }
    })

})();




// about section tabs

(() =>{
    const aboutSection =  document.querySelector(".about-section"),
    tabsContainer = document.querySelector(".about-tabs");

    tabsContainer.addEventListener("click", (event) =>{
        /* if event.target contais 'tab-item' class and not contains 'active' class */
        if(event.target.classList.contains("tab-item") && 
        !event.target.classList.contains("active")){
            const target = event.target.getAttribute("data-target");
            // deactivate existing active 'tab-item'
            tabsContainer.querySelector(".active").classList.remove("outer-shadow", "active");
            // activate new 'tab-item'
            event.target.classList.add("active","outer-shadow");
            // deactivate existing active 'tab-content'
            aboutSection.querySelector(".tab-content.active").classList.remove("active");
            // activate new 'tab-content'
            aboutSection.querySelector(target).classList.add("active");
        }
    })
})();

function bodyScrollingToggle(){
    document.body.classList.toggle("hidden-scrolling");
    
}

/* ------------portfolio filter and popup---------- */
(() =>{

    const filterContainer = document.querySelector(".portfolio-filter"),
    portfolioItemsContainer = document.querySelector(".portfolio-items"),
    portfolioItems = document.querySelectorAll(".portfolio-item"),
    popup = document.querySelector(".portfolio-popup"),
    prevBtn = popup.querySelector(".pp-prev"),
    nextBtn = popup.querySelector(".pp-next"),
    closeBtn = popup.querySelector(".pp-close"),
    projectDetailsContainer = popup.querySelector(".pp-details"),
    projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
    let itemIndex, slideIndex, screenshots;

    /* filter portfolio items */
    filterContainer.addEventListener("click", (event)=>{
        if(event.target.classList.contains("filter-item") &&
        !event.target.classList.contains("active")){
            // deactivate existing active 'filter-item'
            filterContainer.querySelector(".active").classList.remove("outer-shadow","active");
            //active new 'filter-itrm'
            event.target.classList.add("active","outer-shadow");
            const target = event.target.getAttribute("data-target");
            portfolioItems.forEach((item) =>{
                if(target === item.getAttribute("data-category") || target === 'all'){
                    item.classList.remove("hide");
                    item.classList.add("show");
                }
                else{
                    item.classList.remove("show");
                    item.classList.add("hide");
                }
            })
        }
        
    })

    portfolioItemsContainer.addEventListener("click", (event) =>{
        if(event.target.closest(".portfolio-item-inner")){
            const portfolioItem = event.target.closest(".portfolio-item-inner").parentElement;
            // get the portfolio Item idex
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
            screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img").getAttribute("data-screenshots");
            //convert screenshots into array
            screenshots = screenshots.split(",");
            if(screenshots.length === 1){
                prevBtn.style.display="none";
                nextBtn.style.display="none";
            }
            else{
                prevBtn.style.display="block";
                nextBtn.style.display="block";
            }
            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }
    })

    closeBtn.addEventListener("click", () =>{
        popupToggle();
        if(projectDetailsContainer.classList.contains("active")){
            popupDetailsToggle();
        }
    })

    function popupToggle() {
        popup.classList.toggle("open");
        bodyScrollingToggle();
    }

    function popupSlideshow(){
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector(".pp-img");
        /* activate loader until the popupimage loaded */
        popup.querySelector(".pp-loader").classList.add("active");
        popupImg.src=imgSrc;
        popupImg.onload = () =>{
            //deactivate loader after the popupimg loaded
            popup.querySelector(".pp-loader").classList.remove("active");
        }
        popup.querySelector(".pp-counter").innerHTML = (slideIndex+1) + " of " + screenshots.length;
    }

    //next slide
    nextBtn.addEventListener("click", () =>{
        if(slideIndex === screenshots.length-1){
            slideIndex = 0;
        }
        else{
            slideIndex++;
        }
        popupSlideshow();
    })

    //prev slide
    prevBtn.addEventListener("click", () =>{
        if(slideIndex === 0){
            slideIndex = screenshots.length-1;
        }
        else{
            slideIndex--;
        }
        popupSlideshow();
    })

    function popupDetails(){
        // if portfolio item details not exists
        if(!portfolioItems[itemIndex].querySelector(".portfolio-item-details")){
            projectDetailsBtn.style.display="none";
            return; /* end function execution */
        }
        projectDetailsBtn.style.display="block";
        // get the project details
        const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
        popup.querySelector(".pp-project-details").innerHTML = details;
        const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
        popup.querySelector(".pp-title h2").innerHTML = title;
        const category = portfolioItems[itemIndex].getAttribute("data-category");
        popup.querySelector(".pp-project-category").innerHTML = category;
    }

    projectDetailsBtn.addEventListener("click", () =>{
        popupDetailsToggle();
    })

    function popupDetailsToggle(){
        if(projectDetailsContainer.classList.contains("active")){
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");
            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight = 0 + "px";
        }
        else{
            projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
            projectDetailsBtn.querySelector("i").classList.add("fa-minus");
            projectDetailsContainer.classList.add("active");
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
            popup.scrollTo(0,projectDetailsContainer.offsetTop);
        }
    }

})();

/*--------------hide all sections except active--------*/

(() => {

    const sections = document.querySelectorAll(".section");
    sections.forEach((section) =>{
        if(!section.classList.contains("active")){
            section.classList.add("hide");
        }
    })

})();



window.addEventListener("load", () =>{
    //preloader
    document.querySelector(".preloader").classList.add("fade-out");
    setTimeout(() =>{
        document.querySelector(".preloader").style.display="none";
    },600)
})


//Glitch Effect

// function WordShuffler(holder,opt){
//     var that = this;
//     var time = 0;
//     this.now;
//     this.then = Date.now();
    
//     this.delta;
//     this.currentTimeOffset = 0;
    
//     this.word = null;
//     this.currentWord = null;
//     this.currentCharacter = 0;
//     this.currentWordLength = 0;
  
  
//     var options = {
//       fps : 20,
//       timeOffset : 5,
//       textColor : '#000',
//       fontSize : "50px",
//       useCanvas : false,
//       mixCapital : false,
//       mixSpecialCharacters : false,
//       needUpdate : true,
//       colors : [
//         '#f44336','#e91e63','#9c27b0',
//         '#673ab7','#3f51b5','#2196f3',
//         '#03a9f4','#00bcd4','#009688',
//         '#4caf50','#8bc34a','#cddc39',
//         '#ffeb3b','#ffc107','#ff9800',
//         '#ff5722','#795548','#9e9e9e',
//         '#607d8b'
//       ]
//     }
  
//     if(typeof opt != "undefined"){
//       for(key in opt){
//         options[key] = opt[key];
//       }
//     }
  
  
    
//     this.needUpdate = true;
//     this.fps = options.fps;
//     this.interval = 1000/this.fps;
//     this.timeOffset = options.timeOffset;
//     this.textColor = options.textColor;
//     this.fontSize = options.fontSize;
//     this.mixCapital = options.mixCapital;
//     this.mixSpecialCharacters = options.mixSpecialCharacters;
//     this.colors = options.colors;
  
//      this.useCanvas = options.useCanvas;
    
//     this.chars = [
//       'A','B','C','D',
//       'E','F','G','H',
//       'I','J','K','L',
//       'M','N','O','P',
//       'Q','R','S','T',
//       'U','V','W','X',
//       'Y','Z'
//     ];
//     this.specialCharacters = [
//       '!','§','$','%',
//       '&','/','(',')',
//       '=','?','_','<',
//       '>','^','°','*',
//       '#','-',':',';','~'
//     ]
  
//     if(this.mixSpecialCharacters){
//       this.chars = this.chars.concat(this.specialCharacters);
//     }
  
//     this.getRandomColor = function () {
//       var randNum = Math.floor( Math.random() * this.colors.length );
//       return this.colors[randNum];
//     }
  
//     //if Canvas
   
//     this.position = {
//       x : 0,
//       y : 50
//     }
  
//     //if DOM
//     if(typeof holder != "undefined"){
//       this.holder = holder;
//     }
  
//     if(!this.useCanvas && typeof this.holder == "undefined"){
//       console.warn('Holder must be defined in DOM Mode. Use Canvas or define Holder');
//     }
  
  
//     this.getRandCharacter = function(characterToReplace){    
//       if(characterToReplace == " "){
//         return ' ';
//       }
//       var randNum = Math.floor(Math.random() * this.chars.length);
//       var lowChoice =  -.5 + Math.random();
//       var picketCharacter = this.chars[randNum];
//       var choosen = picketCharacter.toLowerCase();
//       if(this.mixCapital){
//         choosen = lowChoice < 0 ? picketCharacter.toLowerCase() : picketCharacter;
//       }
//       return choosen;
      
//     }
  
//     this.writeWord = function(word){
//       this.word = word;
//       this.currentWord = word.split('');
//       this.currentWordLength = this.currentWord.length;
  
//     }
  
//     this.generateSingleCharacter = function (color,character) {
//       var span = document.createElement('span');
//       span.style.color = color;
//       span.innerHTML = character;
//       return span;
//     }
  
//     this.updateCharacter = function (time) {
      
//         this.now = Date.now();
//         this.delta = this.now - this.then;
  
         
  
//         if (this.delta > this.interval) {
//           this.currentTimeOffset++;
        
//           var word = [];
  
//           if(this.currentTimeOffset === this.timeOffset && this.currentCharacter !== this.currentWordLength){
//             this.currentCharacter++;
//             this.currentTimeOffset = 0;
//           }
//           for(var k=0;k<this.currentCharacter;k++){
//             word.push(this.currentWord[k]);
//           }
  
//           for(var i=0;i<this.currentWordLength - this.currentCharacter;i++){
//             word.push(this.getRandCharacter(this.currentWord[this.currentCharacter+i]));
//           }
  
  
//           if(that.useCanvas){
//             c.clearRect(0,0,stage.x * stage.dpr , stage.y * stage.dpr);
//             c.font = that.fontSize + " sans-serif";
//             var spacing = 0;
//             word.forEach(function (w,index) {
//               if(index > that.currentCharacter){
//                 c.fillStyle = that.getRandomColor();
//               }else{
//                 c.fillStyle = that.textColor;
//               }
//               c.fillText(w, that.position.x + spacing, that.position.y);
//               spacing += c.measureText(w).width;
//             });
//           }else{
  
//             if(that.currentCharacter === that.currentWordLength){
//               that.needUpdate = false;
//             }
//             this.holder.innerHTML = '';
//             word.forEach(function (w,index) {
//               var color = null
//               if(index > that.currentCharacter){
//                 color = that.getRandomColor();
//               }else{
//                 color = that.textColor;
//               }
//               that.holder.appendChild(that.generateSingleCharacter(color, w));
//             }); 
//           }
//           this.then = this.now - (this.delta % this.interval);
//         }
//     }
  
//     this.restart = function () {
//       this.currentCharacter = 0;
//       this.needUpdate = true;
//     }
  
//     function update(time) {
//       time++;
//       if(that.needUpdate){
//         that.updateCharacter(time);
//       }
//       requestAnimationFrame(update);
//     }
  
//     this.writeWord(this.holder.innerHTML);
  
  
//     console.log(this.currentWord);
//     update(time);
//   }
  
  
  
  
//   var headline = document.getElementById('headline_about');
//   var text = document.getElementById('para_text');
  
//   var headText = new WordShuffler(headline,{
//     textColor : '#fff',
//     timeOffset : 7,
//     mixCapital : true,
//     mixSpecialCharacters : true
//   });
  
//   var pText = new WordShuffler(text,{
//     textColor : '#fff',
//     timeOffset : 2
//   });
  
  
// Typing functionality

var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 72;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};