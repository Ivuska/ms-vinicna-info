// On page load or when changing themes, best to add inline in `head` to avoid FOUC
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
        document.getElementById('darkmodeicon').classList.add('fa-sun')
    } else {
        document.documentElement.classList.remove('dark')
        document.getElementById('darkmodeicon').classList.add('fa-moon')
    }
})
  
function setMode(){
    if (document.documentElement.classList.contains('dark')) {
        // Whenever the user explicitly chooses light mode
        localStorage.theme = 'light'
        document.documentElement.classList.remove('dark')
        document.getElementById('darkmodeicon').classList.replace('fa-sun', 'fa-moon')
    } else {
        localStorage.theme = 'dark'
        document.documentElement.classList.add('dark')
        document.getElementById('darkmodeicon').classList.replace('fa-moon', 'fa-sun')

    }
}

function closeFlashMessage() {
    document.getElementById('flashmessage').style.display='none';
}
