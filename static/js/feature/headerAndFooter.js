export async function renderHeaderAndFooter(){
    try{
        const header = await fetch("/header.html");
        const html = await header.text();
        document.body.insertAdjacentHTML('afterbegin', html);
    }
    catch(error){
        console.error('Error fetching data:', error);
    }

    const footer = document.createElement('footer');
    footer.innerHTML = `
        <div>
        <p class="body-bold">COPYRIGHT @ 2025</p>
        </div>
        `
    document.body.appendChild(footer);

    document.querySelector('header nav h3').addEventListener('click', ()=>{
        window.location.href='/';
    })

    rwdHeader();
}

function rwdHeader(){
    const hideHeaderText = document.querySelector('#header-logo h3');
    const isMobileScreen = window.matchMedia('(max-width: 601px)').matches;
    if (isMobileScreen){
        hideHeaderText.style.display = 'none';
    }else{
        hideHeaderText.style.display = 'block';
    }
    console.log('working')
}

window.addEventListener('resize', rwdHeader);
