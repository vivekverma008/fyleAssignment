async function fetchUser(username) {
    const loader = document.querySelector('.loader'); 
    const remLoad = document.querySelector('.rem_load'); 
    loader.style.display = 'block'; 
    remLoad.style.display = 'none'; 
    
    try{
        const res = await fetch(`https://api.github.com/users/${username}`);
        const repos = await fetch(`https://api.github.com/users/${username}/repos`);

        if(res.status === 404 || repos.status === 404){
            throw new Error('User not found');
        }
        
        const data = await res.json();
        data.repos = await repos.json();


        loader.style.display = 'none';
        remLoad.style.display = 'block'; 
        
        return data;
    }
    catch(err){
        console.error('Error : ', err);
    }
}








const getAnotherUser = async function (event) {


    event.preventDefault();
    const username = event.target[0].value;

    console.log(username);

    const data = await fetchUser(username);


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
    const repo_container  = document.querySelector('.repo_box') ;
    
    repo_container.innerHTML = '';
    
    repos.forEach((repo, ind) => {
        console.log(repo.topics);
        var repoDiv = document.createElement("div");
        repoDiv.className = "border card_mobile";
        repoDiv.id = `${repo.name}-${ind}`;
        console.log(repo.topics);
        repoDiv.innerHTML = ` 
                <div class="heading margin">${repo.name}</div>
                ${!repo.description ? ``: `<div class="margin description">${repo.description }</div>`}
                
                <ul class="topic_container list_style_none">
                   
                    ${repo.topics.map((topic)=>{
                       return  ` <li class="topics margin" id= '${repo.name}-${ind}'>${topic}</li>`
                    })}
                  
                
                </ul>
            `


        repo_container.appendChild(repoDiv);
    });



}





const bind_getAnotherUser = function () {
    const elements = document.getElementsByClassName('get_another_user');
    console.log(elements);
    Array.from(elements).forEach((element) => {
        console.log(element);
        element.addEventListener('submit', getAnotherUser);
    });
}

document.addEventListener('DOMContentLoaded', bind_getAnotherUser);
