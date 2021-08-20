document.addEventListener("DOMContentLoaded", () => {
    const btns = document.querySelectorAll("button");
    btns.forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            document.location.href = "app.html";
        })
    })
})