

var linkParser = async (linkHeader) => {
    const linkObject = {};

    const entries = linkHeader.split(',');

    for (const entry of entries) {
        const [url, rel] = entry.split(';').map(part => part.trim());
        const urlValue = url.slice(1, -1);
        const relation = rel.split('=')[1].slice(1, -1);
        linkObject[relation] = urlValue;
    }

    return linkObject;
}

function extractPageNumber(url) {
    // Extract the page number from the URL
    const match = /\bpage=(\d+)/.exec(url);
    return match ? parseInt(match[1], 10) : null;
}

const updateDom = function (data) {
    const avatar = document.querySelector('.avatar');
    const userName = document.querySelector('.userName');
    const bio = document.querySelector('.bio');
    const location = document.querySelector('.location');
    const twitter = document.querySelector('.twitter_url a')

    const githubAccount = document.querySelector('.github_account_link a');

    const followers = document.querySelector('.topic_container .followers')
    const following = document.querySelector('.topic_container .following')




    avatar.src = data.avatar_url;
    userName.textContent = data.name;
    bio.textContent = data.bio;
    location.textContent = data.location;
    twitter.href = data.twitter_username ? `https://twitter.com/${data.twitter_username}` : '#';
    twitter.textContent = data.twitter_username ? `https://twitter.com/${data.twitter_username}` : '#';
    githubAccount.href = data.html_url;
    githubAccount.textContent = data.html_url;
    followers.textContent = `Followers: ${data.followers}`;
    following.textContent = `Following: ${data.following}`;

    const repos = data.repos;
    const repo_container = document.querySelector('.repo_box');

    repo_container.innerHTML = '';

    repos.forEach((repo, ind) => {
        // console.log(repo.topics);
        var repoDiv = document.createElement("div");
        repoDiv.className = "border card_mobile";
        repoDiv.id = `${repo.name}-${ind}`;
        // console.log(repo.topics);
        repoDiv.innerHTML = ` 
                <div class="heading margin">${repo.name}</div>
                ${!repo.description ? `` : `<div class="margin description">${repo.description}</div>`}
                
                <ul class="topic_container list_style_none">
                   
                    ${repo.topics.map((topic) => {
            return `<li class="topics margin" id= '${repo.name}-${ind}'>${topic}</li>`
        })}
                  
                
                </ul>
            `


        repo_container.appendChild(repoDiv);
    });

    console.log('links ', data.links)
    const pages = document.querySelector('.pagination');
}




async function fetchUser(username) {
    const loader = document.querySelector('.loader');
    const remLoad = document.querySelector('.rem_load');
    loader.style.display = 'block';
    remLoad.style.display = 'none';

    try {


        let page = document.querySelector('.pagination .active').innerHTML;
        page = (page ? page : 1);
        let perPage = document.querySelector('.per-Page').value;
        console.log(perPage);
        if (!perPage) perPage = 10;

        const timeoutId = setTimeout(() => {
            remLoad.style.display = 'block';
            loader.style.display = 'none'
            throw new Error('timeOUt');
        }, 5000)

        console.log(perPage, page);

        const res = await fetch(`https://api.github.com/users/${username}`);
        const repos = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`);

        clearTimeout(timeoutId);


        if (res.status === 404 || repos.status === 404) {
            throw new Error('User not found');
        }

        const data = await res.json();
        data.repos = await repos.json();
        const linkHeader = repos.headers.get('Link');

        if (linkHeader) {
            console.log(linkHeader);
            const links = await linkParser(linkHeader);
            console.log(links);
            data.links = links;
        }
        console.log(data.repos);
        const numberOfPages = 5;
        data.numberOfPages = numberOfPages;
        console.log(numberOfPages);
        loader.style.display = 'none';
        remLoad.style.display = 'block';

        return data;
    }
    catch (err) {
        console.error('Error : ', err);
    }
}


const handlePageClick = function (event) {
    console.log(event.target);
}





const getAnotherUser = async function (event) {


    event.preventDefault();
    const username = event.target[0].value;

    console.log(username);

    const data = await fetchUser(username);

    updateDom(data);
}

const changeActivePage = async function (event) {
    event.preventDefault();
    const username = document.querySelector('#inp_get_User').value;
    if(username == ''){
        throw new Error('username empty cannot switch page');
    }
    console.log(event.target);
    const prevSelected = document.querySelector('.page.active');
    prevSelected.classList.remove('active');
    event.target.classList.add('active');
    const data = await fetchUser(username);
    updateDom(data);

}


const bindPages = function () {
    const pageElements = document.getElementsByClassName('page');

    Array.from(pageElements).forEach((element) => {
        console.log(element);
        element.addEventListener('click', changeActivePage);
    })
}



const bind_getAnotherUser = function () {
    const elements = document.getElementsByClassName('get_another_user');
    bindPages();
    console.log(elements);
    Array.from(elements).forEach((element) => {
        console.log(element);
        element.addEventListener('submit', getAnotherUser);
    });
}

document.addEventListener('DOMContentLoaded', bind_getAnotherUser);
