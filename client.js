$('#error').hide();
checkForBannerVisibility();
$('#add-link').hide();
$('#sign-up-form').hide();
$('#not-signed-up').on('click',(e) => {
    e.preventDefault();
    $('#sign-in-form').hide();
    $('#sign-up-form').fadeIn(200);
});
$('#already-signed-up').on('click',(e) => {
    e.preventDefault();
    $('#sign-up-form').hide();
    $('#sign-in-form').fadeIn(200);
});

function showSignInForm(){
    $('#sign-up-form').hide();
    $('#sign-in-form').fadeIn(200);
}

$('#sign-in-form').on('submit', (e) => {
    e.preventDefault();
    const form = document.querySelector("#sign-in-form");
    const name = form.username.value;
    const password = form.password.value;
    const check = checkForIncompleteForm(name,password);
    if(check)
    {
        signInUser(name,password);
    }
    else
        showError('Don\'t leave any field vacant.');
    form.reset();
});

$('#sign-up-form').on('submit', (e) => {
    e.preventDefault();
    const form = document.querySelector("#sign-up-form");
    const password = form.password.value;
    const email = form.email.value;
    const check = checkForIncompleteForm(password,email);
    if(check)
    {
        addUser(email,password);
    }
    else
        showError('Don\'t leave any field vacant.');
    form.reset();
});

$('#add-link-button').on('click' , (e) => {
    e.preventDefault();
    $('#add-link').fadeIn(200);
});
$('#hide-link-form').on('click' , (e) => {
    e.preventDefault();
    $('#add-link').fadeOut(200);
});

$('#add-link-form').on('submit', (e) => {
    e.preventDefault();
    const form = document.querySelector("#add-link-form");
    const name = form.name.value;
    const link = form.link.value;
    const check = checkForIncompleteForm(name,link);
    if(check)
    {
        $('#add-link').fadeOut(300);
        var d = new Date();
        d = d.toString().substring(0,15);
        const email = $("#acc-email > code").text();
        addLinkToUserLinkDatabase(email,name,link,d);
    }
    else
        showError('Don\'t leave any field vacant.');
    form.reset();
});

function checkForIncompleteForm(para1,para2){
    if(para1 == null || para2 == null)
        return false;
    if(para1 == '' || para2 == '')
        return false;
    if(para1 == undefined || para2 == undefined)
        return false;
    return true;
}

function showError(message){
    $('#error').text(message);
    $('#error').fadeIn(300).delay(5000).fadeOut(300);
}

function active_user(state) {
    if(state)
    {
        $('#banner').hide();
        $('#the-form').hide();
        $('#quote-block').hide();
        $('#sign-in-up').hide();
        $('#account').show();
        $('#log-out').show();
        $('#add-link-button').show();
        $('#link-list').show();
        $('footer').hide();
    }
    else{
        showSignInForm();
        $('#banner').show();
        $('#the-form').show();
        $('#quote-block').show();
        $('#sign-in-up').show();
        $('#account').hide();
        $('#log-out').hide();
        $('#add-link-button').hide();
        $('#add-link').hide();
        $('#link-list').hide();
        $('footer').show();
    }
}

function emptyTheLinkList(){
    $('ul').remove();
    $('#link-list').append('<ul></ul>');
    $('ul').append(`
        <li id="no-link-banner">
            Add a link by clicking on the '+' button.
        </li>
    `);
}

var Months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function appendToList(name,link){
    var d = new Date();
    var date = d.toString().substring(0,15);
    const newLi = $(`
    <li>
        <div class="items-in-link-list">
            <h3>${name}</h3>
            <p>${date}</p>
        </div>
        <a href="${link}">${link}</a>
        <a href="#" id="delete-link"><img src="/images/trash.png" id="bin"></a>
    </li>
    `);
    $('#link-list > ul').prepend(newLi);
    checkForBannerVisibility();
    const email = $('#acc-email > code').text();
    addLinkToUserLinkDatabase(email,name,link,d);
}

function appendToList(name,link,date){
    const newLi = $(`
    <li>
        <div class="items-in-link-list">
            <h3>${name}</h3>
            <p>${date}</p>
        </div>
        <a href="${link}">${link}</a>
        <a href="#" id="delete-link"><img src="/images/trash.png" id="bin"></a>
    </li>
    `);
    $('#link-list > ul').append(newLi);
    updateNumberOfLinks();
    checkForBannerVisibility();
}

function checkForBannerVisibility()
{
    var len =0;
    $('ul > li').each( () => {
        len = len +1;    
    });
    if( len > 1)
        $('#no-link-banner').hide();
    else
        $('#no-link-banner').fadeIn(300);
}

var deleteErrorCheck = true;
$('ul').on('dblclick' , (e) => {
    e.preventDefault();
    if(!deleteErrorCheck)
    {
    if(e.target.getAttribute('id') == 'bin')
    {
        deleteLink($('#acc-email > code').html(),$('#delete-link').parent().find('.items-in-link-list').find('h3').html());
        $('#delete-link').parent().remove();
    }
    checkForBannerVisibility();
    updateNumberOfLinks();
    deleteErrorCheck = false;
    }
});
$('ul').on('click' , (e) => {
    e.preventDefault();
    if(deleteErrorCheck)
    {
    if(e.target.getAttribute('id') == 'bin')
    {
        const precautionMessage = 'It will be deleted forever and you will not be able to get it back. If you ready and sure, double click on bin again.';
        showError(precautionMessage);
    }
    deleteErrorCheck = false;
    }
});


active_user(false);
getQuote();

$('#quote-refresh').on('click' , (e) => {
    e.preventDefault();
    getQuote();
});

function setEmail(email)
{
    $('#acc-email > code').html(email);
}

$('#log-out').on('click' , (e) => {
        e.preventDefault();
        logOutUser();
});

function getQuote()
{
    fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .then(data => {
            //console.log(`${data.content} —${data.author}`)
            $('#the-quote').text(data.content+' -'+data.author);
    });
}

function updateNumberOfLinks(){
    var no = 0;
    $('ul > li').each( () => {
        no = no + 1;
    });
    $('#number-of-links').html(no-1);
}

/*
    li format:
         <li>
            <div class="items-in-link-list">
                <h3>Name of the link</h3>
                <p>Sept'20</p>
            </div>
            <a href="#">https//www.google.com/</a>
            <a href="#" id="delete-link"><img src="/images/trash.png" id="bin"></a>
        </li>
*/