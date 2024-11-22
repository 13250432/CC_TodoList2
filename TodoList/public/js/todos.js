let searchBlockShown = false;

function showSearchBlock() {
    let searchBlock = document.getElementById('search-block');

    if (searchBlockShown) {
        searchBlock.style.setProperty('display', 'none');
    } else {
        searchBlock.style.setProperty('display', 'block');
    }

    searchBlockShown = !searchBlockShown;
}
