
const navbar = document.querySelector('nav');
const bookmarkSearch = navbar.querySelector('#search')
const sortDropdownOptions = navbar.querySelectorAll('.dropdown-menu li');
const sidebar = document.querySelector('.sidenav');
const sidebarBtn = document.querySelector('#sidebar-btn');

const saveBookmarkFrm = document.querySelector('#save-bookmark-form');
const inputs = saveBookmarkFrm.querySelectorAll('[type="text"]');
const bookmarksUl = document.querySelector('.bookmarks');

const editTagsModal = document.querySelector('.edit-tags');
const saveTagBtn = editTagsModal.querySelector('.btn-save');
const tagInput = editTagsModal.querySelector('[name="tag-list"]');
const editTagsModalHeader = editTagsModal.querySelector('.header');

const bulkEditButton = document.querySelector('#main .heading .bulk-btn');
const bulkEditModal = document.querySelector('.bulk-edit');
const selectionCounter = bulkEditModal.querySelector('.counter h4');
const bulkEditOptions = bulkEditModal.querySelector('.options');

const bookmarkList = JSON.parse(localStorage.getItem('bookmarks')) || [] ;
let selectedBookmarks = [];
let selectedBookmarksLi = [];
let isBulkEditMode = false;
let counter = bookmarkList.reduce((max,item)=> Math.max(max, item.index),0); // Must initialise with max bookmark index present in localStorage
const bulkEditModalUiConfig = {header:"Add tags"}

// Cannot assign below variables here - because bookmarks are not yet rendered from localStorage

/* const bookmarkLinks = bookmarksUl.querySelectorAll('a');
 const deleteBtns = document.querySelectorAll('.data-delete');
 */

function toggleSideBar() {

    document.body.classList.contains('closed') ? document.body.classList.remove('closed') :  document.body.classList.add('closed') 
}

function handleSideBarCollapse(e) {

    window.outerWidth < 750 ? document.body.classList.add('closed')  : document.body.classList.remove('closed');
  
}

function renderBookmarks(bookmarks = bookmarkList) {

    const html = bookmarks.map((bookmark, index)=>{
        return `
        <li data-index="${bookmark.index}" class="bookmark" data-checked="false" >
            <a data-url="${bookmark.url}" target="_blank">
                <h3>${bookmark.name}</h3>
                <img src="images/pexels-photo-1151262.jpeg"" alt="Placeholder">
                <div class="options">                    
                    <button class="btn btn-primary btn-xs" data-option="edit-tag">Tags</button>
                    <button class="btn btn-danger btn-xs" data-option="delete">Delete</button> 
                </div>
            </a>                    
        </li>`
    }).join('')

    bookmarksUl.innerHTML = html;
    renderSidebar();
    renderBulkEditModal();
    
    //Solving without Event delegation concept - Have to Assign vars and Eventslistener after each Rendering event 
    /*
        bookmarkLinks = bookmarksUl.querySelectorAll('a');
        deleteBtns = document.querySelectorAll('.delete-btn'); 

        deleteBtns.forEach(btn=>btn.addEventListener('click',deleteBookmark))
        bookmarkLinks.forEach(link=>link.addEventListener('click',openLink));
    */


}

function saveBookmark(e) {

    e.preventDefault();

    // Get input values

    const bookmarkName = inputs[0].value;
    const bookmarkUrl = inputs[1].value;
    const tags = ['MyList'];
    counter++;
    const bookmark = {
        index : counter,
        name: bookmarkName,
        url: bookmarkUrl,
        tags: tags,
        createdDate : Date()
    }
  
    bookmarkList.push(bookmark);    

    // Render the modified bookmark list again

    renderBookmarks() ;
    
    // Save in local Storage

    localStorage.setItem('bookmarks',JSON.stringify(bookmarkList));

    saveBookmarkFrm.reset();

}

function toggleEditMode(modalUiConfig = bulkEditModalUiConfig) {
    // debugger
    if(isBulkEditMode){
        // configure Modal Ui
        editTagsModalHeader.innerHTML = modalUiConfig.header;
        tagInput.value = "";

    }
    const hidden = editTagsModal.classList.contains('is-hidden')
    hidden ? editTagsModal.classList.remove('is-hidden') : editTagsModal.classList.add('is-hidden'); 
}

function renderTaglist(index) {
    console.log(index);
    bookmark = bookmarkList.find(b => b.index == index);
    tagInput.value = bookmark.tags.slice(1).join(','); //slicing to ensure "MyList" default tag is not modified by mistake
    saveTagBtn.dataset.index = index; // set index reference to use while saving bookmark tags

}

function saveTags(e) { // Edit and Add Tags
    
    if(isBulkEditMode) return;
    
    const index = e.target.dataset.index;
    const taglist = tagInput.value ? tagInput.value.split(",") : null;
    const bookmark = bookmarkList.find(b => b.index == index);
    const length = bookmark.tags.length;

    if(taglist){
        bookmark.tags = bookmark.tags
            .slice(0,1) // keep default tag "MyList" untouched
            .concat(taglist); // recreate bookmarks tags property

        console.log("bookmark new",bookmark.tags);

    }else { //Delete all tags except default
        bookmark.tags = bookmark.tags.slice(0,1);
    }
    
    // Render modified unique tag list in the side bar
    
    renderSidebar();

    // Close modal

    toggleEditMode();

    // Save in local Storage

    localStorage.setItem('bookmarks',JSON.stringify(bookmarkList));
}

function deleteBookmark(bookmarkLi) {
    
    // Find parent Li
    // const bookmarkLi = e.target.closest('li.bookmark') 
    const propIndex = bookmarkLi.dataset.index 

    // Remove item from Array and Render UI with modified bookmarkList
    bookmarkLi.remove();
    
    //Update localStorage
    const spliceIndex = bookmarkList.findIndex(b=>b.index==propIndex);
    
    bookmarkList.splice(spliceIndex,1);
    counter = bookmarkList.reduce((max,item)=> Math.max(max, item.index),0); // set counter to max index

    localStorage.setItem('bookmarks',JSON.stringify(bookmarkList));
    
}

function editTags(e) {
     // Find parent Li
     const bookmarkLi = e.target.closest('li.bookmark')
     const index = bookmarkLi.dataset.index;

     toggleEditMode(); 
     renderTaglist(index);
}

function gotoLink(e) {
    
    // find url 
    const a = e.target.closest('a'); 
    const url = a.dataset.url

    // open new tab
    var win = window.open(url, '_blank');

}

function handleByDelegation(e) {

    // console.log("Delegation",e.target,"this",this)

    const clickedOnDeleteBtn = e.target.dataset.option && e.target.dataset.option=='delete' ? true : false; // if the target has an attribute "data-option" and its  value is "delete" 
    const clickedOnTagsBtn = e.target.dataset.option && e.target.dataset.option=='edit-tag' ? true : false; // if the target has an attribute "data-option" and its  value is "edit-tag"
    const clickedOnBookmarkAnchor = e.target.closest('a') ? true : false; // if click was inside an anchor element of a bookmark item
    let targetBookmarkLi;
    
    if(!isBulkEditMode) {
        if(clickedOnDeleteBtn) { 
            targetBookmarkLi = e.target.closest('li.bookmark') 
            deleteBookmark(targetBookmarkLi);
            // deleteBookmark(e);
        }
        else if(clickedOnTagsBtn) { 
            editTags(e);
        }
        else if(clickedOnBookmarkAnchor) { 
            gotoLink(e)
        }
    }
    
    else return; // return if click was not inside a bookmark item or isBulkEditMode = true;
}

function renderSidebar() {
    const uniqueTags = [];
    let html = ""

    // bookmarkList
    //     .forEach(b => {            
    //         b.tags.forEach(t => {
    //             if(uniqueTags[t]){
    //                 return;     
    //             }else {
    //                 uniqueTags[t] = t;
    //             }
    //         })
    //     })
    //     console.log("uniqueTags new",uniqueTags);

    bookmarkList.forEach(b => { b.tags.forEach(t => !uniqueTags[t] ? uniqueTags[t] = t : null) });

    for (let prop in uniqueTags) {
        html +=  `<a href="#" data-filterby="${prop}">${prop}</a> `
    }

    sidebar.innerHTML = html;
    
    return uniqueTags;
}

function filterBookmark(e) { // handle both search box and sidebar link
    
    // If in bulk edit mode then switch to normal mode
    isBulkEditMode ? toggleBulkEditMode() : null;
    
    const sidebarTag = e.target.dataset.filterby;
    const searchBox = this.value;
    const searchStr = searchBox || sidebarTag || ""; 
    const filteredList = bookmarkList.filter(b => b.name.includes(searchStr) || b.tags.join(',').includes(searchStr))
    
    renderBookmarks(filteredList);

    console.log(Boolean(searchStr),{sidebarTag,filteredList});
    return filteredList;
}

function sortBookmarks() {
    const newest = this.dataset.value == 'newest' ? true : false;
    
    if(newest){
        renderBookmarks(bookmarkList.sort((a, b) => a.createdDate < b.createdDate ? 1 : -1))     
    }else {        
        renderBookmarks(bookmarkList.sort((a, b) => a.createdDate > b.createdDate ? 1 : -1))           
    }
}

function bulkAddTags() { // Add tags to selected bookmarks 
    
    if(!isBulkEditMode) return;

    // Get tag input list
    const taglist = tagInput.value ? tagInput.value.split(",") : null;

    if(!taglist) { // if no tag inputs are entered return
        toggleEditMode(bulkEditModalUiConfig);
        return;
    }else {
        // Add tags in the input to existing tags of the selected bookmarks 
        selectedBookmarksLi.forEach(li => {
            let bookmark = bookmarkList.find(bookmark => bookmark.index == li.dataset.index);
            bookmark.tags = bookmark.tags
            .concat(taglist); // recreate bookmarks tags property
            console.log(bookmark);
        });

        // Render modified unique tag list in the side bar

        renderSidebar();

        // Close modal

        toggleEditMode();

        // Save in local Storage

        localStorage.setItem('bookmarks',JSON.stringify(bookmarkList));
    }  
}

function renderBulkEditModal() {
    // Adjust with navbar height
    height =  navbar.offsetHeight;
    bulkEditModal.style.height = `${height+5}px`;   
}

function toggleBulkEditMode() {
    // debugger;
    // disable all event listeners on bookmark items // show the bulk edit modal // on click dont go to a new page
    isBulkEditMode = !isBulkEditMode
    
    const hidden = bulkEditModal.classList.contains('is-hidden') 
    hidden ? bulkEditModal.classList.remove('is-hidden') : bulkEditModal.classList.add('is-hidden'); 
    
    // user should only be able to select a bookmark item for bulk edit // on hover dont show the tag and delete options 
    bookmarksUl.classList.contains('bulk-mode') ? bookmarksUl.classList.remove('bulk-mode') : bookmarksUl.classList.add('bulk-mode');
    
    // Uncheck all bookmarks
    selectedBookmarksLi.forEach(b => b.dataset.checked = "false")
    
    // Reset selectionCounter 
    selectedBookmarksLi.splice(0);
    let countIsSelected = selectedBookmarksLi.length;

    // Update item selected counter
    selectionCounter.innerHTML = `${countIsSelected} Items Selected`;
}

function handleBulkEditOptions(e) {
    
    const clickedOnDeleteBtn = e.target.dataset.option && e.target.dataset.option=='delete' ? true : false; // if the target has an attribute "data-option" and its  value is "delete" 
    const clickedOnTagsBtn = e.target.dataset.option && e.target.dataset.option=='edit-tag' ? true : false; // if the target has an attribute "data-option" and its  value is "edit-tag"

    if(clickedOnDeleteBtn) {
        console.log("delete selected bookmarks",selectedBookmarksLi);
        selectedBookmarksLi.forEach(b => deleteBookmark(b));
        
        // If in bulk edit mode then switch to normal mode
        isBulkEditMode ? toggleBulkEditMode() : null;
        
    }else if(clickedOnTagsBtn) {
        console.log("bulk edit tags of selected bookmarks")
        toggleEditMode(bulkEditModalUiConfig);
    }

    console.log({clickedOnDeleteBtn,clickedOnTagsBtn});
}

function handleBulkSelection(e) {
    console.log("handle bulk edit")
    
    const clickedOnBookmarkItem = e.target.closest('li') ? true : false; // if click was inside a bookmark item
    let bookmarkLi;
    let index;
    let isSelected = false;

    if(isBulkEditMode && clickedOnBookmarkItem) {
        // Find the bookmark item and index
        bookmarkLi = e.target.closest('li.bookmark') 
        index = bookmarkLi.dataset.index 
        
        // Check if selected of deselected
        isSelected = bookmarkLi.dataset.checked == "true" ? true : false;

        // toggle selection
        isSelected ? bookmarkLi.dataset.checked ="false" : bookmarkLi.dataset.checked ="true"
        isSelected = !isSelected; 

        // Find the bookmark from the original bookmarkList to push
        const bookmark = bookmarkList.find(b => b.index == index); 


        // if isSelected push the bookmark in "selectedBookmarks" array else remove the bookmark 
        if(isSelected) {
            // selectedBookmarks.push(bookmark);
            selectedBookmarksLi.push(bookmarkLi);
        } else {
            // selectedBookmarks = selectedBookmarks.filter(b => b.index != index);  
            selectedBookmarksLi = selectedBookmarksLi.filter(b => b.dataset.index != index);  
        }
        
        // Count the number of selected bookmarks
        let countIsSelected = selectedBookmarksLi.length;
        console.log({isSelected,selectedBookmarks,countIsSelected,index});

        // Update item selected counter
        selectionCounter.innerHTML = `${countIsSelected} Items Selected`;

        // if countIsSelected > 0 enable the bulk edit button
        bulkEditOptions.querySelectorAll('button').forEach(button => countIsSelected > 0 ? button.disabled = false : button.disabled = true);
    }
    

    // If at least 1 bookmark is selected then enable the bulk edit options else disable them
    // When user exits Bulk Mode deselect all bookmarks if selected
}
// On load

/* window.addEventListener('load', renderBookmarks); */
renderBookmarks();

/* Window resizing*/
window.addEventListener('resize',handleSideBarCollapse);
window.addEventListener('resize',renderBulkEditModal);

/* Navbar events */
saveBookmarkFrm.addEventListener('submit',saveBookmark);
bookmarkSearch.addEventListener('keyup',filterBookmark)
sidebar.addEventListener('click',filterBookmark);
sidebarBtn.addEventListener('click',toggleSideBar);
sortDropdownOptions.forEach(d => d.addEventListener('click',sortBookmarks))

/* All bookmark item click events */
bookmarksUl.addEventListener('click',handleByDelegation);
saveTagBtn.addEventListener('click',saveTags);
saveTagBtn.addEventListener('click',bulkAddTags);

// Bulk Edit
bulkEditButton.addEventListener('click',toggleBulkEditMode);
bulkEditOptions.addEventListener('click',handleBulkEditOptions);
bookmarksUl.addEventListener('click',handleBulkSelection); 


// Cannot assign below eventListeners here - because bookmarkLinks and deleteBtns are already assigned before Rendering from localStorage
/* 
    deleteBtns.forEach(btn=>btn.addEventListener('click',deleteBookmark))
    bookmarkLinks.forEach(link=>link.addEventListener('click',openLink)); 

    function deleteBookmark(e) { 
        e.stopPropagation(); //stops firing the openLink()
        console.log("delete bookmark",this);
    }
    function openLink() {
        const url = this.dataset.url
        var win = window.open(url, '_blank');
        console.log(url);
    }
 */




