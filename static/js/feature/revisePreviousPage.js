export function revisePreviousPage(){
    const previousPageBtn = document.getElementById('previous-page-btn');
    previousPageBtn.style.display = "flex";
    previousPageBtn.addEventListener('click', ()=>{
        window.location.href='/';
    })
}