
window.onload = function () {
    menu = document.getElementsByClassName("menu")[0]

    menu_top = menu.offsetTop
    fixed_position()


    window.onscroll = function () {
        fixed_position()
    }

    function fixed_position() {
        if (window.scrollY > menu_top) {
            menu.classList.add("fixed-menu")
            menu.style.left = "-" + window.scrollX + "px"
        } else {
            menu.classList.remove("fixed-menu")
        }
    }
}