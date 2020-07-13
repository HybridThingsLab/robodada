////IMPLEMENTS CUSTOM CURSORS TO REPLACE THE HIDDEN REAL CURSOR
$(document).ready(function() {
    let cursor = document.querySelector(".cursor");
    let page = document.querySelector("html");
    page.addEventListener('mousemove', function(evt) {
        cursor.style.left = evt.clientX - 2 + 'px';
        cursor.style.top = evt.clientY - 2 + 'px';
        
        //dont sit in corner on reload
        cursor.style.display = "block";
    });
    
    
    document.querySelectorAll(".button").forEach(function(button) {
        button.addEventListener('mouseover', function() {
        cursor.src = "img/cursor/cursor_hand.svg";
        })
        button.addEventListener('mouseleave', function() {
        cursor.src = "img/cursor/cursor_arrow.svg";
        })
    });
    
    let canvas = document.querySelector("#canvas");
    canvas.addEventListener('mouseover', function() {
        cursor.src = "img/cursor/cursor_pen.svg";
    });
    canvas.addEventListener('mouseleave', function() {
        cursor.src = "img/cursor/cursor_arrow.svg";
    });  
});
