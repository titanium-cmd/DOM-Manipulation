const BASE_URL = 'https://jsonplaceholder.typicode.com';

const loader = ({ state = 'show', query }) => {
    const p = document.querySelector(query);
    p.textContent = 'Loading...';
    p.style.display = state === 'hide' ? 'none' : 'block';
}

const getUsers = async () => {
    try {
        loader({ state: 'show', query: '#user-loader' });
        const res = await fetch(`${BASE_URL}/users`);
        const users = await res.json();
        return users;
    } catch (error) {
        console.log('error::', error);
        alert("Error fetching users. Kindly check your internet connection and try again.");
    } finally {
        loader({ state: 'hide', query: '#user-loader' });
    }
}

const addHeadersToTable = ({ headers, table }) => { 
    if (headers && Array.isArray(headers) && table) { 
        const tableHead = table.createTHead();        
        const tableHeadRow = tableHead.insertRow(0);
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            tableHeadRow.insertCell(i).innerHTML = `<b>${header}</b>`;
        }
    }
}

const getAllPostByUserId = async ({user_id}) => {
    try {
        loader({ state: 'show', query: '#post-loader' });
        const res = await fetch(`${BASE_URL}/users/${user_id}/posts`);
        const posts = await res.json();
        return posts;
    } catch (error) {
        console.log('error::', error);
        alert("Error fetching user posts. Kindly check your internet connection and try again.");
    } finally {
        loader({ state: 'hide', query: '#post-loader' });
    }
}

const displayUserPosts = async ({ user_id, name }) => { 
    const dl = window.document.querySelector('dl');
    dl.innerHTML = '';
    const posts = await getAllPostByUserId({ user_id });
    const postTitle = window.document.querySelector('#post-title');
    postTitle.textContent = `${name}'s posts`;
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const dt = document.createElement('dt')
        dt.innerHTML = post.title;
        dt.style.color = 'blue';
        dt.style.marginTop = '20px';
        const dd = document.createElement('dd')
        dt.innerHTML = post.title;
        dd.innerHTML = post.body;        
        dl.appendChild(dt);
        dl.appendChild(dd);
    }
}

(async () => {
    const users = await getUsers();
    if (users) {
        const usersTable = window.document.querySelector('table');

        // adding headers to users table
        addHeadersToTable({
            table: usersTable,
            headers: ['ID', 'Name', 'Email Address', 'Website', 'Phone Number', 'Action']
        });

        //Insert list of users fetched from endpoint to table rows
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const row = usersTable.insertRow(i+1); //First row of table is occupied by THead so start insert from row 2
            const websiteLink = document.createElement('a');
            websiteLink.href = user.website;
            websiteLink.target = '_blank';
            websiteLink.innerHTML = user.website;
            row.insertCell(0).appendChild(document.createTextNode(user.id))
            row.insertCell(1).appendChild(document.createTextNode(user.name))
            row.insertCell(2).appendChild(document.createTextNode(user.email))
            row.insertCell(3).appendChild(websiteLink);
            row.insertCell(4).appendChild(document.createTextNode(user.phone))

            const action = document.createElement('a');
            action.href = '#';
            action.innerHTML = '<p>View Posts</p>';
            row.insertCell(5).appendChild(action);
            action.onclick = async () => {                
                await displayUserPosts({user_id: user.id, name: user.name})
            }
        }
    }
})()