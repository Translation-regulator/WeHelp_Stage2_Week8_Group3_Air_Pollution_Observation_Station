export function confirmPreviousSelect(){
    initSubindexChips()
}

let initSubindexChipsIsListening = false;

function initSubindexChips() {
    const subindexSelect = document.getElementById('subindex-select');
  
    if(!initSubindexChipsIsListening){
        subindexSelect.addEventListener('click', (event) => {
            const target = event.target;

            if (!target.classList.contains('chip')) return;

            const activeChips = subindexSelect.querySelectorAll('.chip-active'); //是否只剩一個
            const isActive = target.classList.contains('chip-active'); //該選項是否 active
            console.log(target)
            console.log(activeChips)
            console.log(isActive)
            
            // 如果目前只有一個 chip-active 且點擊的是它本人，禁止取消
            if (isActive && activeChips.length === 1 && activeChips[0] === target) {
                return;
            }

            target.classList.toggle('chip-active');
        });
        initSubindexChipsIsListening = true;
    }
}